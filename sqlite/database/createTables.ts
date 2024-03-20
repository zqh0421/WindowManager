import fs from 'fs';
import path from 'path';
import db from '../db';

export function createTables() {
  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSQL);
  console.log('Database schema created/updated successfully.');
}
