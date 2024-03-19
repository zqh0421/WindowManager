import { exec } from 'child_process';
import { getWindowsFrontmost } from './osScripts';

let lastWindowTitle = '';
let lastStartTime = Date.now();
let count = 0;

export function recordWindowUsage() {
  console.log(count++);
  // macOS平台上执行AppleScript
  exec(getWindowsFrontmost.appleScript, (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    const output = stdout.trim().split(', ');
    console.log(output);
    const currentWindowTitle = output[1] || 'Unknown'; // 假设输出的第二部分是窗口标题
    const currentTime = Date.now();

    if (currentWindowTitle !== lastWindowTitle) {
      const duration = currentTime - lastStartTime; // 持续时间，毫秒

      console.log(lastWindowTitle, new Date(lastStartTime).toISOString(), duration);
      // // 将数据插入数据库
      // db.run('INSERT INTO window_usage (app_name, window_title, start_time, duration) VALUES (?, ?, ?, ?)', ['System Events', lastWindowTitle, new Date(lastStartTime).toISOString(), duration], function(err) {
      //   if (err) {
      //     return console.error(err.message);
      //   }
      //   console.log(`A row has been inserted with rowid ${this.lastID}`);
      // });

      // 更新上一个窗口标题和开始时间
      lastWindowTitle = currentWindowTitle;
      lastStartTime = currentTime;
    }
  });
}
