import { ipcMain, shell, BrowserWindow, IpcMainInvokeEvent } from 'electron';
import {
  recordAppActivity,
  getAllWindows,
  getAllWindowsDetail,
  getAllWindowsName
} from './osScripts';
import {
  executePlatformSpecificCommand,
  parseTitlesFromStdout,
  parseWindowsInfoFromStdout
} from './utils';

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

  ipcMain.on('adjust-window-size', (event: IpcMainInvokeEvent, data: { height: number }) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    if (currentWindow) {
      currentWindow.setSize(currentWindow.getSize()[0], data.height, true);
    }
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
    return await executePlatformSpecificCommand(getAllWindows, parseTitlesFromStdout);
  });

  // 事件监听 - 获取所有窗口名称
  ipcMain.handle('get-all-windows-name', async () => {
    return await executePlatformSpecificCommand(getAllWindowsName, parseWindowsInfoFromStdout);
  });

  // 事件监听 - 获取所有窗口详细信息
  ipcMain.handle('get-all-windows-detail', async () => {
    return await executePlatformSpecificCommand(getAllWindowsDetail, parseWindowsInfoFromStdout);
  });

  // 事件监听 - 记录应用活动
  ipcMain.handle('record-app-activity', async () => {
    return await executePlatformSpecificCommand(recordAppActivity, (stdout) => stdout);
  });
};

export { registerHandlers };
