import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

// Get the __dirname equivalent by using fileURLToPath and dirname with import.meta.url
const __dirname = dirname(fileURLToPath(import.meta.url));

// Construct a database connection string
const dbPath = join(__dirname, 'database.sqlite');

// Set up a Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath, // This replaces 'path/to/your/database.sqlite'
  logging: false // Disabling the SQL logging
});

export default sequelize;

// import sqlite3 from 'sqlite3';

// const db = new sqlite3.Database('./window_usage.db', (err) => {
//   if (err) {
//       console.error('Error when creating the database', err);
//   } else {
//       console.log('Database created!');
//       db.run(`CREATE TABLE IF NOT EXISTS window_usage (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           app_name TEXT NOT NULL,
//           window_title TEXT,
//           start_time DATETIME NOT NULL,
//           duration INTEGER NOT NULL
//       )`);
//   }
// });

// const dbPath = path.join(app.getPath('userData'), 'window_usage.db');
// const db = new sqlite3.Database(dbPath, (err) => {
//   if (err) console.error('Error opening database', err);
//   else {
//     console.log('Database opened successfully');
//     db.run(`CREATE TABLE IF NOT EXISTS window_usage (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       app_name TEXT NOT NULL,
//       window_title TEXT,
//       start_time DATETIME NOT NULL,
//       duration INTEGER NOT NULL
//     )`);
//   }
// });
