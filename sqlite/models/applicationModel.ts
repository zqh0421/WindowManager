import db from '../db';

export async function getAllApplications() {
  const getApplications = db.prepare(`
    SELECT * FROM Application;
  `);
  try {
    const applications = getApplications.all();
    console.log(`Retrieved all applications in database: ${applications}`);
    return applications;
  } catch (error) {
    console.error(`Error retrieving applications in database: ${error}`);
    throw error;
  }
}

export async function addApplication(name: string) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO Application (name) VALUES (?);
  `);
  try {
    const info = insert.run(name);
    console.log(`Inserted Application with ID: ${info.lastInsertRowid}`);
    return info.lastInsertRowid;
  } catch (error) {
    console.error(`Error adding application: ${error}`);
    throw error;
  }
}

export async function addApplications(applications: string[]) {
  let sql = ``;
  for (const application of applications) {
    sql += `INSERT OR IGNORE INTO Application (name) VALUES ('${application}');`;
  }
  try {
    db.exec(sql);
    console.log(`Inserted/Updated Applications`);
  } catch (error) {
    console.error(`Error adding applications: ${error}`);
    throw error;
  }
}
