import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { exec } from 'child_process';

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
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true // 保持启用状态
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

  // 事件监听
  ipcMain.on('open-dev-tools', () => {
    win?.webContents.openDevTools();
  });

  ipcMain.handle('get-open-windows', () => {
    const windows = BrowserWindow.getAllWindows().map((window) => ({
      id: window.id,
      title: window.getTitle()
    }));
    return windows;
  });

  ipcMain.handle('get-all-windows', async (e) => {
    console.log(e);
    return new Promise((resolve, reject) => {
      // macOS命令示例，其他操作系统需要相应调整
      exec(
        `osascript -e 'tell application "System Events" to get the title of every window of every process'`,
        (error, stdout) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return reject(error);
          }
          console.log(stdout);
          const titles = stdout
            .split(',')
            .filter((title) => title.trim() !== '')
            .map((title) => title.trim());
          resolve(titles);
        }
      );
    });
  });
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
