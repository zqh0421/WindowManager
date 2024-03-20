import { BrowserWindow } from 'electron';
import { getWindowsFrontmost } from './osScripts';
import { executePlatformSpecificCommand } from './utils';

let count = 0;

export async function recordWindowUsage() {
  console.log(count++);
  let currentProcessName = '';
  let currentWindowTitle = '';
  let currentWindowSize = '';
  let currentWindowPosition = '';
  const currentTime = Date.now();
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
  const windowInfo =
    currentProcessName +
    ', ' +
    currentWindowTitle +
    ', ' +
    currentTime +
    ', ' +
    currentWindowSize +
    ', ' +
    currentWindowPosition;
  console.log(windowInfo);
  // 将数据插入数据库的逻辑...
  // db.run('INSERT INTO window_usage (app_name, window_title, start_time, duration) VALUES (?, ?, ?, ?)', ['System Events', lastWindowTitle, new Date(lastStartTime).toISOString(), duration], function(err) {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   console.log(`A row has been inserted with rowid ${this.lastID}`);
  // });
}
