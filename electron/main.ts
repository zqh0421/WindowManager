import { app, BrowserWindow, globalShortcut, Tray, Menu, screen } from 'electron';
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
let tray: Tray | null;

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  // 获取屏幕尺寸
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    // width: width / 2, // 屏幕宽度的一半
    width: width / 3,
    height: height / 2, // 根据内容高度，这里只是一个初始值
    x: 0,
    y: 0,
    // x: width / 4, // 在屏幕中心
    // y: height * 0.1, // 从屏幕顶部开始
    resizable: false, // 不允许用户调整窗口尺寸
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    frame: false, // 隐藏默认的窗口标题栏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true // 保持启用状态
      // nodeIntegration: false
    }
  });
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

  // Hide the window when it loses focus
  // win.on('blur', () => {
  //   win?.hide();
  // });

  // Register the event handlers
  registerHandlers(win);
}

const initWindow = () => {
  if (win) {
    win.show();
  } else {
    createWindow();
  }
};

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

function createTray() {
  tray = new Tray(path.join(process.env.VITE_PUBLIC, '5688008.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开应用',
      click: () => {
        initWindow();
      }
    },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Your App');
  tray.setContextMenu(contextMenu);
}

app
  .whenReady()
  .then(() => {
    initWindow();
  })
  .catch((error) => console.error('Error creating window:', error));
app
  .whenReady()
  .then(() => {
    if (process.platform === 'darwin' && app.dock) app.dock.hide();
    createTray();
    // 添加日志
    console.log('Tray created:', tray);
  })
  .catch((error) => console.error('Error creating tray:', error));
app
  .whenReady()
  .then(() => {
    dbOperations.createTables();
  })
  .then(() => {
    // 每隔5秒执行一次检测
    setInterval(recordWindowUsage, 5 * 1000);
  })
  .catch((error) => console.error('Error initializing database or timer:', error));

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

  globalShortcut.register('Escape', () => {
    // 这里执行按下Esc时你想做的操作
    if (win) {
      win.hide(); // 隐藏当前窗口
    }
  });
});

app.on('before-quit', () => {
  // 确保在应用退出前完成最后一次活动窗口的记录
  recordWindowUsage();
  dbOperations.closeDb();
  globalShortcut.unregisterAll();
  win?.removeAllListeners();
});
