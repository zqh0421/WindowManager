import Database from 'better-sqlite3';

// 初始化数据库
export const db = new Database('./database.db');

export function createTables() {
  // 创建用户表
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS User (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT NOT NULL
    );
  `
  ).run();

  // 创建其他表格...
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS LayoutSelectionHistory (
      SelectionID INTEGER PRIMARY KEY AUTOINCREMENT,
      UserID INTEGER,
      LayoutID INTEGER,
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (UserID) REFERENCES User(UserID),
      FOREIGN KEY (LayoutID) REFERENCES Layout(LayoutID)
    );
  `
  ).run();

  // 根据需要继续创建其他表
  // 注意：对于每个CREATE TABLE命令，都应使用db.prepare(...).run();进行执行
}

// 示例：添加用户
export function addUser(username: string) {
  const insert = db.prepare('INSERT INTO User (Username) VALUES (?)');
  const info = insert.run(username);
  return info.lastInsertRowid;
}

// 示例：查询用户
export function getUsers() {
  return db.prepare('SELECT * FROM User').all();
}

// // import sqlite3 from 'sqlite3';

// // const db = new sqlite3.Database('./window_usage.db', (err) => {
// //   if (err) {
// //       console.error('Error when creating the database', err);
// //   } else {
// //       console.log('Database created!');
// //       db.run(`CREATE TABLE IF NOT EXISTS window_usage (
// //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// //           app_name TEXT NOT NULL,
// //           window_title TEXT,
// //           start_time DATETIME NOT NULL,
// //           duration INTEGER NOT NULL
// //       )`);
// //   }
// // });

// // const dbPath = path.join(app.getPath('userData'), 'window_usage.db');
// // const db = new sqlite3.Database(dbPath, (err) => {
// //   if (err) console.error('Error opening database', err);
// //   else {
// //     console.log('Database opened successfully');
// //     db.run(`CREATE TABLE IF NOT EXISTS window_usage (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       app_name TEXT NOT NULL,
// //       window_title TEXT,
// //       start_time DATETIME NOT NULL,
// //       duration INTEGER NOT NULL
// //     )`);
// //   }
// // });
