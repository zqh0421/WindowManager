import db from '../db';

// 添加任务
export function addTask(task: string) {
  const insert = db.prepare('INSERT INTO Task (TaskName) VALUES (?)');
  const info = insert.run(task);
  return info.lastInsertRowid;
}

// 查询所有任务
export function getAllTasks() {
  return db.prepare('SELECT * FROM Task').all();
}

// 根据 id 查询任务
export const getTaskById = (id: number) => {
  // 使用 db 访问数据库
  const stmt = db.prepare('SELECT * FROM Task WHERE TaskID = ?');
  return stmt.get(id);
};

// 根据 id 删除任务
export const deleteTaskById = (id: number) => {
  const stmt = db.prepare('DELETE FROM Task WHERE TaskID = ?');
  return stmt.run(id);
};

// 根据 id 更新任务
export const updateTaskById = (id: number, task: string) => {
  const stmt = db.prepare('UPDATE Task SET TaskName = ? WHERE TaskID = ?');
  return stmt.run(task, id);
};

// 根据 id 更新任务状态
export const updateTaskStatusById = (id: number, status: number) => {
  const stmt = db.prepare('UPDATE Task SET Status = ? WHERE TaskID = ?');
  return stmt.run(status, id);
};

// 根据 id 更新任务优先级
export const updateTaskPriorityById = (id: number, priority: number) => {
  const stmt = db.prepare('UPDATE Task SET Priority = ? WHERE TaskID = ?');
  return stmt.run(priority, id);
};

// 根据 id 更新任务截止日期
export const updateTaskDeadlineById = (id: number, deadline: string) => {
  const stmt = db.prepare('UPDATE Task SET Deadline = ? WHERE TaskID = ?');
  return stmt.run(deadline, id);
};

// 根据 id 更新任务备注
export const updateTaskNoteById = (id: number, note: string) => {
  const stmt = db.prepare('UPDATE Task SET Note = ? WHERE TaskID = ?');
  return stmt.run(note, id);
};

// 根据 id 更新任务标签
export const updateTaskTagById = (id: number, tag: string) => {
  const stmt = db.prepare('UPDATE Task SET Tag = ? WHERE TaskID = ?');
  return stmt.run(tag, id);
};

// 根据 id 更新任务进度
export const updateTaskProgressById = (id: number, progress: number) => {
  const stmt = db.prepare('UPDATE Task SET Progress = ? WHERE TaskID = ?');
  return stmt.run(progress, id);
};

// 根据 id 更新任务开始日期
export const updateTaskStartDateById = (id: number, startDate: string) => {
  const stmt = db.prepare('UPDATE Task SET StartDate = ? WHERE TaskID = ?');
  return stmt.run(startDate, id);
};

// 根据 id 更新任务结束日期
export const updateTaskEndDateById = (id: number, endDate: string) => {
  const stmt = db.prepare('UPDATE Task SET EndDate = ? WHERE TaskID = ?');
  return stmt.run(endDate, id);
};

// 根据 id 更新任务创建日期
export const updateTaskCreateDateById = (id: number, createDate: string) => {
  const stmt = db.prepare('UPDATE Task SET CreateDate = ? WHERE TaskID = ?');
  return stmt.run(createDate, id);
};

// 根据 id 更新任务修改日期
export const updateTaskModifyDateById = (id: number, modifyDate: string) => {
  const stmt = db.prepare('UPDATE Task SET ModifyDate = ? WHERE TaskID = ?');
  return stmt.run(modifyDate, id);
};

// 根据 id 更新任务完成日期
export const updateTaskCompleteDateById = (id: number, completeDate: string) => {
  const stmt = db.prepare('UPDATE Task SET CompleteDate = ? WHERE TaskID = ?');
  return stmt.run(completeDate, id);
};

// 根据 id 更新任务删除日期
export const updateTaskDeleteDateById = (id: number, deleteDate: string) => {
  const stmt = db.prepare('UPDATE Task SET DeleteDate = ? WHERE TaskID = ?');
  return stmt.run(deleteDate, id);
};

// 根据 id 更新任务恢复日期
export const updateTaskRecoverDateById = (id: number, recoverDate: string) => {
  const stmt = db.prepare('UPDATE Task SET RecoverDate = ? WHERE TaskID = ?');
  return stmt.run(recoverDate, id);
};

// 根据 id 更新任务彻底删除日期
export const updateTaskDestroyDateById = (id: number, destroyDate: string) => {
  const stmt = db.prepare('UPDATE Task SET DestroyDate = ? WHERE TaskID = ?');
  return stmt.run(destroyDate, id);
};

// 根据 id 更新任务是否被删除
export const updateTaskIsDeletedById = (id: number, isDeleted: number) => {
  const stmt = db.prepare('UPDATE Task SET IsDeleted = ? WHERE TaskID = ?');
  return stmt.run(isDeleted, id);
};

// 根据 id 更新任务是否被完成
export const updateTaskIsCompletedById = (id: number, isCompleted: number) => {
  const stmt = db.prepare('UPDATE Task SET IsCompleted = ? WHERE TaskID = ?');
  return stmt.run(isCompleted, id);
};

// 根据 id 更新任务是否被彻底删除
export const updateTaskIsDestroyedById = (id: number, isDestroyed: number) => {
  const stmt = db.prepare('UPDATE Task SET IsDestroyed = ? WHERE TaskID = ?');
  return stmt.run(isDestroyed, id);
};

// 根据 id 更新任务是否被完成
export const updateTaskIsArchivedById = (id: number, isArchived: number) => {
  const stmt = db.prepare('UPDATE Task SET IsArchived = ? WHERE TaskID = ?');
  return stmt.run(isArchived, id);
};
