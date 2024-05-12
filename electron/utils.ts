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

export const applicationListResultProcessor = (stdout: string) => {
  // Split the output into an array by new lines or other delimiters
  const apps = stdout.trim().split('.app, '); // Adjust delimiter based on actual stdout format
  // Remove '.app' suffix from each app name
  // const processedApps = apps.map(app => app.replace(/\.app$/, ''));

  return apps;
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

const generateLayoutCommand = (
  appName: string,
  windowTitle: string | undefined,
  px: number,
  py: number,
  sx: number,
  sy: number
) => {
  return `
    tell application "System Events"
      if exists (process "${appName}") then
        tell process "${appName}"
          if exists (the first window whose name contains "${windowTitle}") then
            set theWindow to (first window whose name contains "${windowTitle}")
            set position of theWindow to {${px}, ${py}}
            set size of theWindow to {${sx}, ${sy}}
            activate
            perform action "AXRaise" of theWindow
          else
            if exists (first window) then
              set firstWindow to first window
              set position of firstWindow to {${px}, ${py}}
              set size of firstWindow to {${sx}, ${sy}}
              activate
              perform action "AXRaise" of firstWindow
            else -- if the app is running but no window is open
              tell application "${appName}"
                activate
              end tell
              set firstWindow to first window
              set position of firstWindow to {${px}, ${py}}
              set size of firstWindow to {${sx}, ${sy}}
              perform action "AXRaise" of firstWindow
            end if
          end if
        end tell
      else
        tell application "${appName}"
          activate
        end tell
        if exists (application process "${appName}") then
          tell process "${appName}"
            activate
            set firstWindow to first window
            set position of firstWindow to {${px}, ${py}}
              set size of firstWindow to {${sx}, ${sy}}
            perform action "AXRaise" of theWindow
          end tell
        end if
      end if
    end tell
    `;
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
        let layoutCommand: string = ``;

        switch (layoutType) {
          case 'Full Screen': {
            layoutCommand = generateLayoutCommand(
              windows[0].appName,
              windows[0].windowTitle,
              0,
              0,
              width,
              height
            );
            break;
          }
          case 'Left Half + Right Half': {
            let i = 0;
            layoutCommand = windows
              .map((win) => {
                return generateLayoutCommand(
                  win.appName,
                  win.windowTitle,
                  i++ == 0 ? 0 : width / 2,
                  0,
                  width / 2,
                  height
                );
              })
              .join('\n');
            break;
          }
          case 'Top Half + Bottom Half': {
            let i = 0;
            layoutCommand = windows
              .map((win) => {
                return generateLayoutCommand(
                  win.appName,
                  win.windowTitle,
                  0,
                  0,
                  width,
                  i++ == 0 ? 0 : height / 2
                );
              })
              .join('\n');
            break;
          }
          case 'First Fourth + Last Three Fourth': {
            let i = 0;
            layoutCommand = windows
              .map((win) => {
                return generateLayoutCommand(
                  win.appName,
                  win.windowTitle,
                  i == 0 ? 0 : width / 4,
                  0,
                  i++ == 0 ? width / 4 : (width / 4) * 3,
                  height
                );
              })
              .join('\n');
            break;
          }
          case 'First Three Fourths + Last Fourth': {
            let i = 0;
            layoutCommand = windows
              .map((win) => {
                return generateLayoutCommand(
                  win.appName,
                  win.windowTitle,
                  i == 0 ? 0 : (width / 4) * 3,
                  0,
                  i++ == 0 ? (width / 4) * 3 : width / 4,
                  height
                );
              })
              .join('\n');
            break;
          }
          default: {
            console.log('Unknown layout type');
            break;
          }
        }
        command = `osascript -e '${minimizeOtherWindowsScript} ${layoutCommand}'`;
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
