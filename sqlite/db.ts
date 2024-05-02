import { app } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(app.getPath('userData'), 'ai-window-manager-user.db');
const db = new Database(dbPath);

export default db;
