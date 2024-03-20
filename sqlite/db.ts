import { app } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';

const userDataPath = app.getAppPath();
const dbPath = path.join(userDataPath, 'database.db');
const db = new Database(dbPath);

export default db;
