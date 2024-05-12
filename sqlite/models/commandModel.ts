import db from '../db';
import { Layout } from '@/api/chat';

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
