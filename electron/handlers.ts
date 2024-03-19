import { ipcMain, shell, BrowserWindow } from 'electron';
import { exec } from 'child_process';
import * as os from 'os';
import { OSScript, recordAppActivity, getAllWindows, getAllWindowsDetail } from './osScripts';

const registerHandlers = (win: BrowserWindow | null) => {
  // 事件监听 - 打开开发者工具
  ipcMain.on('open-dev-tools', () => {
    win?.webContents.openDevTools();
  });

  // 事件监听 - 打开外部链接
  ipcMain.on('open-external', async (_, url: string) => {
    console.log(`Opening ${url}`);
    await shell.openExternal(url);
  });

  // 事件监听 - 获取所有窗口
  ipcMain.handle('get-open-windows', () => {
    const windows = BrowserWindow.getAllWindows().map((window) => ({
      id: window.id,
      title: window.getTitle()
    }));
    return windows;
  });

  // 事件监听 - 获取所有窗口标题
  ipcMain.handle('get-all-windows', async () => {
    return executePlatformSpecificCommand(getAllWindows, parseTitlesFromStdout);
  });

  // 事件监听 - 获取所有窗口详细信息
  ipcMain.handle('get-all-windows-detail', async () => {
    return executePlatformSpecificCommand(getAllWindowsDetail, parseWindowsInfoFromStdout);
  });

  // 事件监听 - 记录应用活动
  ipcMain.handle('record-app-activity', async () => {
    return executePlatformSpecificCommand(recordAppActivity, (stdout) => stdout);
  });
};

// Define a type for the processor function to avoid 'any'
type ResultProcessor = (stdout: string) => void;

const executePlatformSpecificCommand = async (
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

const parseTitlesFromStdout = (stdout: string) => {
  return stdout
    .split(',')
    .filter((title) => title.trim() !== '')
    .map((title) => title.trim());
};

const parseWindowsInfoFromStdout = (stdout: string) => {
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

export { registerHandlers };
