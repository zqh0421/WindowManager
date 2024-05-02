import db from '../db';
import { RunResult } from 'better-sqlite3';

// 添加应用活动记录
export async function addAppActivity(
  appName: string,
  windowTitle: string,
  windowSize: string,
  windowPosition: string
) {
  const currentTime = Date.now();
  const insertActivity = db.prepare(`
    INSERT INTO AppActivity (appName, windowTitle, windowSize, windowPosition, initialTime, latestTime)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  if (appName && windowTitle && windowSize && windowPosition) {
    try {
      const result = await insertActivity.run(
        appName,
        windowTitle,
        windowSize,
        windowPosition,
        currentTime,
        currentTime
      );
      console.log('Inserted AppActivity with ID:', result.lastInsertRowid);
      return result.lastInsertRowid; // Return the AppActivity's last inserted ID
    } catch (error) {
      console.error(`addAppActivity error: ${error}`);
    }
  }
}

export async function getLastAppActivity() {
  const select = db.prepare(`
    SELECT * FROM AppActivity
    ORDER BY latestTime DESC LIMIT 1
  `);
  try {
    return await select.get();
  } catch (error) {
    console.error(`getLastAppActivity error: ${error}`);
  }
}

export const updateActiveTime = async (id: number): Promise<RunResult | undefined> => {
  const currentTime = Date.now(); // Update to use correct time format
  const update = db.prepare(`
    UPDATE AppActivity SET latestTime = ? WHERE id = ?
  `);
  try {
    return await update.run(currentTime, id);
  } catch (error) {
    console.error(`updateActiveTime error: ${error}`);
  }
};
