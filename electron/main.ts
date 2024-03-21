import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'node:path';
import { recordWindowUsage } from './recorder';
import { registerHandlers } from './handlers';
import { dbOperations } from '../sqlite/index';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    frame: false, // 隐藏默认的窗口标题栏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true // 保持启用状态
      // nodeIntegration: false
    }
  });

  win.webContents.openDevTools();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // Register the event handlers
  registerHandlers(win);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
app
  .whenReady()
  .then(() => {
    dbOperations.createTables();
  })
  .then(() => {
    // 每隔60秒执行一次检测
    setInterval(recordWindowUsage, 60 * 1000);
  });

app.whenReady().then(() => {
  // 设置全局快捷键
  globalShortcut.register('Option+Space', () => {
    console.log('Option+Space is pressed');
    // 检查主窗口是否存在，如果不存在则创建
    if (!win) {
      createWindow();
    } else {
      // 如果窗口已经在前台显示，则隐藏窗口
      if (win.isVisible()) {
        win.hide();
      } else {
        // 如果窗口不在前台显示，则将其显示到前台
        win.show();
      }
    }
  });
});

app.on('before-quit', () => {
  // 确保在应用退出前完成最后一次活动窗口的记录
  recordWindowUsage();
  dbOperations.closeDb();
});
