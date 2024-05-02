import { useState, Dispatch, SetStateAction, ReactNode } from 'react';
import type { Task } from './taskList';
interface TaskEditPanelProps {
  task: Task;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  // setIsLoading: Dispatch<SetStateAction<boolean>>;
}

interface TaskEditLabelProps {
  children: ReactNode; // 定义 children，使其可以接收任何有效的 React 节点
}

const TaskEditLabel: React.FC<TaskEditLabelProps> = ({ children }) => {
  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700'>{children}</label>
    </div>
  );
};

const TaskEditPanel: React.FC<TaskEditPanelProps> = ({
  task,
  editMode,
  setEditMode
  // setIsLoading
}) => {
  const { taskName } = task;
  const [taskDescription, setTaskDescription] = useState(task.taskDescription || '');
  const [taskType, setTaskType] = useState(task.taskType);
  const [taskStatus, setTaskStatus] = useState(task.taskStatus);
  const [taskPriority, setTaskPriority] = useState(task.taskPriority);
  const [taskDeadline, setTaskDeadline] = useState(
    task.taskDeadline ? new Date(task.taskDeadline).toISOString().substring(0, 10) : ''
  );

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault();
    // // 更新任务逻辑
    // updateTask({
    //   id: task.id,
    //   taskName,
    //   taskDescription,
    //   taskType,
    //   taskStatus,
    //   taskPriority,
    //   taskDeadline: taskDeadline ? new Date(taskDeadline),
    //   isSatisfied,
    // });
    setEditMode(false); // 关闭编辑面板
  };

  return (
    <div
      className={` absolute top-0 right-0 z-20 w-96 h-full bg-white shadow-xl transition-transform duration-300 ${editMode ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col h-full w-full overflow-scroll pb-6 pl-6 pr-6'
      >
        <div className='sticky top-0 bg-white flex justify-between items-center pt-6 pb-4 border-b-[1px]'>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition'
            onClick={() => setEditMode(false)}
          >
            Back
          </button>
          <h3 className='text-lg font-semibold'>Edit Task "{taskName}"</h3>
          <button
            type='submit'
            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition'
          >
            Save
          </button>
        </div>
        <div className='mb-4'>
          <TaskEditLabel>Task Type</TaskEditLabel>
          <input
            className='bg-white mt-1 p-2 w-full border rounded'
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <TaskEditLabel>Task Status</TaskEditLabel>
          <select
            className='bg-white mt-1 p-2 w-full border rounded'
            value={taskStatus}
            onChange={(e) =>
              setTaskStatus(e.target.value as 'In Progress' | 'Completed' | 'Abandoned')
            }
          >
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
            <option value='Abandoned'>Abandoned</option>
          </select>
        </div>
        <div className='mb-4'>
          <TaskEditLabel>Task Priority</TaskEditLabel>
          <select
            className='bg-white mt-1 p-2 w-full border rounded'
            value={taskPriority}
            onChange={(e) =>
              setTaskPriority(e.target.value as 'High' | 'Medium' | 'Low' | 'Common')
            }
          >
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
            <option value='Common'>Common</option>
          </select>
        </div>
        <div className='mb-4'>
          <TaskEditLabel>Task Deadline (optional)</TaskEditLabel>
          <input
            type='date'
            className='bg-white mt-1 p-2 w-full border rounded'
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <TaskEditLabel>Task Description (optional)</TaskEditLabel>
          <textarea
            placeholder={
              'Add more detailed information to this task for better analysis when necessary. (100 characters max)'
            }
            maxLength={100}
            rows={3}
            className='bg-white mt-1 p-2 w-full border rounded'
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default TaskEditPanel;
