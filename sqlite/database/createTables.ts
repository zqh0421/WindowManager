import fs from 'fs';
import path from 'path';
import db from '../db';

export async function createTables() {
  try {
    console.log('Creating database schema...');
    const schemaPath = path.join(process.cwd(), 'sqlite', 'schema', 'schema.sql');
    console.log(schemaPath);
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schemaSQL);
    console.log('Database schema created/updated successfully.');
  } catch (error) {
    console.error('Error creating database schema:', error);
  }
}
