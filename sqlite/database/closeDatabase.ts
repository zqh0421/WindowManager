import db from '../db';

export function closeDb() {
  db.close();
}
