import db from '../db';

// 添加用户
export function addUser(username: string) {
  const insert = db.prepare('INSERT INTO User (Username) VALUES (?)');
  const info = insert.run(username);
  return info.lastInsertRowid;
}

// 查询所有用户
export function getAllUsers() {
  return db.prepare('SELECT * FROM User').all();
}

// 根据 id 查询用户
export const getUserById = (id: number) => {
  // 使用 db 访问数据库
  const stmt = db.prepare('SELECT * FROM User WHERE UserID = ?');
  return stmt.get(id);
};
