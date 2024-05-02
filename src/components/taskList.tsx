import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import TaskItem from './taskItem';
import type { Layout } from '@/api/chat';

export type Task = {
  id: number; // Corresponds to INTEGER PRIMARY KEY AUTOINCREMENT in SQL
  // userId: string; // Uncomment or add this if you need to reference a user
  taskName: string; // Corresponds to TEXT NOT NULL in SQL
  taskDescription?: string; // Optional because the SQL column allows NULL
  taskType: string; // ENUM like behavior
  taskStatus: 'In Progress' | 'Completed' | 'Abandoned'; // ENUM like behavior
  taskPriority: 'High' | 'Medium' | 'Low' | 'Common'; // ENUM like behavior
  taskDeadline?: Date; // DATETIME can be null, so it's optional
  lastExecutionTime?: Date; // DATETIME can be null, so it's optional
  createTime: Date; // DATETIME, with default as CURRENT_TIMESTAMP
  completeTime?: Date; // Optional because it can be NULL which means not completed
  isSatisfied: -1 | 0 | 1; // -1, 0, 1 as defaults, represents satisfaction state
  // Add any foreign key relationships if required
};

interface TaskListProps {
  editMode: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setLoadingStage: Dispatch<SetStateAction<string>>;
  setCurrentTask: Dispatch<SetStateAction<Task | null>>;
  setLayouts: Dispatch<SetStateAction<Layout[]>>;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

const TaskList: React.FC<TaskListProps> = ({
  editMode,
  setIsLoading,
  setLoadingStage,
  setCurrentTask,
  setLayouts,
  setEditMode
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    window.electron
      .dbQuery('getAllTasks')
      .then((tasks) => {
        setTasks(tasks);
        console.log(tasks);
      })
      .catch(console.error);
  }, []);

  return (
    <ul className='mb-4'>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editMode={editMode}
          setEditMode={setEditMode}
          setCurrentTask={setCurrentTask}
          setLayouts={setLayouts}
          setIsLoading={setIsLoading}
          setLoadingStage={setLoadingStage}
        />
      ))}
    </ul>
  );
};

export default TaskList;
