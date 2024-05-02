/* eslint-disable @typescript-eslint/no-explicit-any */

import { ipcMain, shell, BrowserWindow, IpcMainInvokeEvent } from 'electron';
import {
  recordAppActivity,
  getAllWindows,
  getAllWindowsDetail,
  getAllWindowsName,
  getAllApplications
} from './osScripts';
import {
  executePlatformSpecificCommand,
  parseTitlesFromStdout,
  parseWindowsInfoFromStdout,
  executePlatformSpecificCommandforLayout
} from './utils';
import { models } from '../sqlite/index';
import { LayoutWindow } from '@/api/chat';

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

  // 事件监听 - 调整窗口大小
  ipcMain.on('adjust-window-size', (event: IpcMainInvokeEvent, data: { height: number }) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    if (currentWindow) {
      currentWindow.setSize(currentWindow.getSize()[0], data.height, true);
    }
  });

  // 事件监听 - 执行 SQL 查询
  ipcMain.on('db-query', async (event, { operation, args }) => {
    try {
      if (typeof (models as any)[operation] === 'function') {
        const result = await (models as any)[operation](...args);
        event.reply(`${operation}-response`, { success: true, data: result });
      } else {
        throw new Error(`No such operation: ${operation}`);
      }
    } catch (error) {
      event.reply(`${operation}-response`, { success: false, error: error });
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

  ipcMain.handle('get-all-applications', async () => {
    return await executePlatformSpecificCommand(getAllApplications, parseWindowsInfoFromStdout);
  });

  // 事件监听 - 记录应用活动
  ipcMain.handle('record-app-activity', async () => {
    return await executePlatformSpecificCommand(recordAppActivity, (stdout) => stdout);
  });

  ipcMain.handle('execute-layout', async (_, layoutType: string, windows: LayoutWindow[]) => {
    return await executePlatformSpecificCommandforLayout(layoutType, windows, (stdout) => stdout);
  });
};

export { registerHandlers };
