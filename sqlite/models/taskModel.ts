import db from '../db';

// Function to add a task with optional deadline and description
export async function addTask(
  taskName: string,
  taskType: string,
  taskStatus: string,
  taskPriority: number,
  taskDeadline?: string,
  taskDescription?: string
) {
  // Start building the SQL query and the parameters array
  let sql = 'INSERT INTO Task (taskName, taskType, taskStatus, taskPriority';
  const params = [taskName, taskType, taskStatus, taskPriority];
  let valuePlaceholders = 'VALUES (?, ?, ?, ?'; // Initial placeholders for mandatory fields

  // Check if taskDeadline is provided and modify the SQL query and parameters accordingly
  if (taskDeadline !== undefined) {
    sql += ', taskDeadline';
    params.push(taskDeadline);
    valuePlaceholders += ', ?';
  }

  // Check if taskDescription is provided and modify the SQL query and parameters accordingly
  if (taskDescription !== undefined) {
    sql += ', taskDescription';
    params.push(taskDescription);
    valuePlaceholders += ', ?';
  }

  // Finalize the SQL statement
  sql += ') ' + valuePlaceholders + ')';

  try {
    const insert = db.prepare(sql);
    const info = insert.run(...params); // Execute the INSERT operation with the parameters
    console.log(`Inserted Task with ID: ${info.lastInsertRowid}`);
    return info.lastInsertRowid; // Return the ID of the newly inserted task
  } catch (error) {
    console.error(`Error adding task: ${error}`);
    throw error; // Rethrow the error after logging it
  }
}

export async function getAllTasks() {
  const getTasks = db.prepare(`
    SELECT * FROM Task
  `);
  try {
    const tasks = getTasks.all();
    console.log(`Retrieved all tasks: ${tasks}`);
    return tasks;
  } catch (error) {
    console.error(`Error retrieving tasks: ${error}`);
    throw error;
  }
}

export async function deleteTask(id: number) {
  const deleteTask = db.prepare(`
    DELETE FROM Task WHERE id = ?
  `);
  try {
    const info = deleteTask.run(id);
    console.log(`Deleted Task with ID: ${id}`);
    return info.changes; // Return the number of rows affected by the DELETE operation
  } catch (error) {
    console.error(`Error deleting task: ${error}`);
    throw error; // Rethrow the error after logging it
  }
}
