import Database from 'better-sqlite3';

// 初始化数据库
const db = new Database('~/database.db', { verbose: console.log });

export default db;
