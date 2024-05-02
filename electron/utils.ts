import { exec } from 'child_process';
import * as os from 'os';
import { screen } from 'electron';
import { OSScript } from './osScripts';
import { LayoutWindow } from '@/api/chat';

// Define a type for the processor function to avoid 'any'
type ResultProcessor = (stdout: string) => void;

export const executePlatformSpecificCommand = async (
  osScript: OSScript,
  resultProcessor: ResultProcessor
) => {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    let command: string | undefined = '';

    switch (platform) {
      case 'darwin':
        command = osScript.appleScript;
        break;
      case 'linux': // 'wmctrl -l'
        command = osScript.linuxCommand;
        break;
      case 'win32': // 'powershell -Command "Get-Process | Select-Object Name"'
        command = osScript.windowsCommand;
        break;
      default:
        return reject(new Error(`Unsupported platform: ${platform}`));
    }

    if (!command) {
      return reject(new Error(`No command provided for platform: ${platform}`));
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        return reject(stderr || error);
      }
      resolve(resultProcessor(stdout));
    });
  });
};

export const parseTitlesFromStdout = (stdout: string) => {
  return stdout
    .split(',')
    .filter((windowTitle) => windowTitle.trim() !== '')
    .map((windowTitle) => windowTitle.trim());
};

export const parseWindowsInfoFromStdout = (stdout: string) => {
  return stdout
    .trim()
    .split('\n')
    .map((line) => {
      const parts = line.split(', '); // Assuming each property is separated by ', '
      return {
        appName: parts[0],
        windowTitle: parts[1],
        position: parts[2],
        size: parts[3]
      };
    });
};

export const executePlatformSpecificCommandforLayout = async (
  layoutType: string,
  windows: LayoutWindow[],
  resultProcessor: ResultProcessor
) => {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    let command: string | undefined = '';

    switch (platform) {
      case 'darwin': {
        console.log('Executing layout command...');
        console.log(layoutType);
        console.log(windows);
        const minimizeOtherWindowsScript: string = `
          tell application "System Events"
            set allProcesses to every application process where visible is true and frontmost is false
            repeat with theApp in allProcesses
              set visible of theApp to false
            end repeat
          end tell
        `;

        const activateWindowsScript: string = `
          tell application "System Events"
            ${windows
              .map(
                (win) => `
              if exists (application process "${win.appName}") then
              tell process "${win.appName}" to activate
              tell process "${win.appName}"
                set theWindow to the first window whose name is "${win.windowTitle}"
                if exists theWindow then
                  perform action "AXRaise" of theWindow
                end if
              end tell
              end if
            `
              )
              .join('\n')}
          end tell
        `;
        let layoutCommand: string = ``;

        switch (layoutType) {
          case 'Full Screen': {
            layoutCommand = `
              tell application "System Events"
                if exists (application process "${windows[0].appName}") then
                  tell process "${windows[0].appName}"
                    set theWindow to first window whose name contains "${windows[0].windowTitle}"
                    if exists theWindow then
                      set position of theWindow to {0, 0}
                      set size of theWindow to {${width}, ${height}}
                    end if
                  end tell
                end if
              end tell
            `;
            break;
          }
          case 'Left Half + Right Half': {
            let i = 0;
            layoutCommand = `
              tell application "System Events"
                ${windows
                  .map(
                    (win) => `
                if exists (application process "${win.appName}") then
                  tell process "${win.appName}"
                    set position of window "${win.windowTitle}" to ${i++ == 0 ? `{0, 0}` : `{${width / 2}, 0}`}
                    set size of window "${win.windowTitle}" to {${width / 2}, ${height}}
                  end tell
                end if
                `
                  )
                  .join('\n')}
              end tell
            `;
            break;
          }
          case 'Top Half + Bottom Half': {
            let j = 0;
            layoutCommand = `
              tell application "System Events"
                ${windows
                  .map(
                    (win) => `
                if exists (application process "${win.appName}") then
                  tell process "${win.appName}"
                    set position of window "${win.windowTitle}" to ${j++ == 0 ? `{0, 0}` : `{0, ${Math.floor(height / 2)}}`}
                    set size of window "${win.windowTitle}" to {${width}, 50 + ${Math.floor(height / 2)}}
                  end tell
                end if
                `
                  )
                  .join('\n')}
              end tell
            `;
            break;
          }
          case 'First Fourth + Last Three Fourth': {
            let k = 0;
            layoutCommand = `
              tell application "System Events"
                ${windows
                  .map(
                    (win) => `
                if exists (application process "${win.appName}") then
                  tell process "${win.appName}"
                    set position of window "${win.windowTitle}" to ${k == 0 ? `{0, 0}` : `{${width / 4}, 0}`}
                    set size of window "${win.windowTitle}" to ${k++ == 0 ? `{${width / 4}, ${height}}` : `{${(width / 4) * 3}, ${height}}`}
                  end tell
                end if
                `
                  )
                  .join('\n')}
              end tell
            `;
            break;
          }
          case 'First Three Fourths + Last Fourth': {
            let n = 0;
            layoutCommand = `
              tell application "System Events"
                ${windows
                  .map(
                    (win) => `
                if exists (application process "${win.appName}") then
                  tell process "${win.appName}"
                    set position of window "${win.windowTitle}" to ${n == 0 ? `{0, 0}` : `{${(width / 4) * 3}, 0}`}
                    set size of window "${win.windowTitle}" to ${n++ == 0 ? `{${(width / 4) * 3}, ${height}}` : `{${width / 4}, ${height}}`}
                  end tell
                end if
                `
                  )
                  .join('\n')}
              end tell
            `;
            break;
          }
          default: {
            console.log('Unknown layout type');
            break;
          }
        }
        command = `osascript -e '${minimizeOtherWindowsScript} ${layoutCommand} ${activateWindowsScript}'`;
        break;
      }
      case 'linux': {
        // 'wmctrl -l'
        // command = osScript.linuxCommand;
        break;
      }
      case 'win32': {
        // 'powershell -Command "Get-Process | Select-Object Name"'
        // command = osScript.windowsCommand;
        break;
      }
      default:
        return reject(new Error(`Unsupported platform: ${platform}`));
    }

    if (!command) {
      return reject(new Error(`No command provided for platform: ${platform}`));
    }
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        return reject(stderr || error);
      }
      resolve(resultProcessor(stdout));
    });
  });
};
