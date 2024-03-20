import { exec } from 'child_process';
import * as os from 'os';
import { OSScript } from './osScripts';

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
    .filter((title) => title.trim() !== '')
    .map((title) => title.trim());
};

export const parseWindowsInfoFromStdout = (stdout: string) => {
  return stdout
    .trim()
    .split('\n')
    .map((line) => {
      const parts = line.split(', '); // Assuming each property is separated by ', '
      return {
        processName: parts[0],
        title: parts[1],
        position: parts[2],
        size: parts[3]
      };
    });
};
