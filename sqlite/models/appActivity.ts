import db from '../db';

// 添加应用活动记录
export async function addAppActivity(
  appName: string,
  windowTitle: string,
  size: string,
  position: string
) {
  const insert = db.prepare(`
    INSERT INTO AppActivity (AppName, WindowTitle, WindowSize, WindowPosition, RecordedTime)
    VALUES (?, ?, ?, ?, ${Date.now()})
  `);
  console.log(appName, windowTitle, size, position, Date.now());
  try {
    const info = await insert.run(appName, windowTitle, size, position);
    console.log(info);
    return info.lastInsertRowid;
  } catch (error) {
    console.error(`addAppActivity error: ${error}`);
  }
}
