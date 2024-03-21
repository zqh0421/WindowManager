import { BrowserWindow } from 'electron';
import { getWindowsFrontmost } from './osScripts';
import { executePlatformSpecificCommand } from './utils';
import { models } from '../sqlite/index';

export async function recordWindowUsage() {
  let currentProcessName = '';
  let currentWindowTitle = '';
  let currentWindowSize = '';
  let currentWindowPosition = '';
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    // 前端窗口属于Electron应用
    currentProcessName = 'Window Manager';
    currentWindowTitle = focusedWindow.getTitle();
    currentWindowSize = focusedWindow.getSize().toString();
    currentWindowPosition = focusedWindow.getPosition().toString();
  } else {
    await executePlatformSpecificCommand(getWindowsFrontmost, (stdout) => {
      // 注意：这里假设parseWindowsInfoFromStdout已经调整为适合你的输出格式
      // const output = parseWindowsInfoFromStdout(stdout); // 或直接处理stdout
      const output = stdout.trim().split(', ');

      currentProcessName = output[0] || 'Unknown';
      currentWindowTitle = output[1] || 'Unknown';
      currentWindowSize = `${output[2] || '0'},${output[3] || '0'}`;
      currentWindowPosition = `${output[4] || '0'},${output[5] || '0'}`;
    }).catch((error) => {
      console.error(`recordWindowUsage error: ${error}`);
    });
  }
  // 将数据插入数据库的逻辑...
  models.addAppActivity(
    currentProcessName,
    currentWindowTitle,
    currentWindowSize,
    currentWindowPosition
  );
}
