import db from '../db';
import { Layout } from '@/api/chat';
// CREATE TABLE IF NOT EXISTS LayoutWindow (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   appName TEXT NOT NULL,
//   windowTitle TEXT NOT NULL,
//   windowManagement TEXT NOT NULL,
//   layoutId INTEGER NOT NULL,
//   description TEXT,
//   windowPath TEXT,
//   initialTime DATETIME DEFAULT CURRENT_TIMESTAMP,
//   latestTime DATETIME DEFAULT CURRENT_TIMESTAMP
//   FOREIGN KEY (layoutId) REFERENCES Layout(layoutId) ON DELETE CASCADE
// );

// -- 创建 Layouts 表
// CREATE TABLE IF NOT EXISTS Layout (
//   layoutId INTEGER PRIMARY KEY AUTOINCREMENT,
//   taskId INTEGER,
//   commandId INTEGER,
//   description TEXT NOT NULL,
//   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//   isSelected INTEGER DEFAULT 0,  -- 0表示未选择，1表示已选择
//   FOREIGN KEY (taskId) REFERENCES Task(id),
//   FOREIGN KEY (commandHistoryId) REFERENCES CommandHistory(id),
// );

// 添加命令执行记录
export async function addCommand(
  command: string,
  layouts: Layout[],
  midTime: number,
  totalTime: number
) {
  const currentTime = Date.now();
  const insertCommand = db.prepare(`
    INSERT INTO CommandHistory (command, commandTime, midTime, totalTime)
    VALUES (?, ?, ?, ?)
  `);
  try {
    const res1 = await insertCommand.run(command, currentTime, midTime, totalTime);
    const commandId = await res1.lastInsertRowid;
    for (const { task, windows, layoutType } of layouts) {
      const insertLayout = db.prepare(`
        INSERT INTO Layout (commandId, layoutType, description, timestamp)
        VALUES (?, ?, ?, ?)
      `);
      const res2 = await insertLayout.run(commandId, layoutType, task, currentTime);
      const layoutId = res2.lastInsertRowid;

      for (const layoutWindow of windows) {
        const insertLayoutWindow = db.prepare(`
          INSERT INTO LayoutWindow (appName, windowTitle, layoutId, initialTime, latestTime)
          VALUES (?, ?, ?, ?, ?)
        `);
        await insertLayoutWindow.run(
          layoutWindow.appName,
          layoutWindow.windowTitle,
          layoutId,
          currentTime,
          currentTime
        );
      }
    }
    // layouts.forEach(async ( { task, layout } ) => {
    //   const insertLayout = db.prepare(`
    //     INSERT INTO Layout (commandId, timestamp)
    //     VALUES (?, ?)
    //   `);
    //   const res2 = await insertLayout.run(commandId, task, currentTime);
    //   const layoutId = await res2.lastInsertRowid;
    //   layout.forEach(async ( layoutWindow ) => {
    //     const insertLayoutWindow = db.prepare(`
    //       INSERT INTO LayoutWindow (appName, windowTitle, windowManagement, layoutId, initialTime, latestTime)
    //       VALUES (?, ?, ?, ?, ?)
    //     `);
    //     const res3 = await insertLayoutWindow.run(layoutWindow.appName, layoutWindow.windowTitle, layoutWindow.windowManagement, layoutId, currentTime, currentTime);
    //     return res3.lastInsertRowid;
    //   });
    // });
  } catch (error) {
    console.error(`addCommand error: ${error}`);
  }
}
