import React, { useState, Dispatch, SetStateAction } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { Task } from './taskList';
import type { Layout } from '@/api/chat';
// import { useApps } from '@/context/appsContext';

interface TaskItemProps {
  task: Task;
  editMode: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setLoadingStage: Dispatch<SetStateAction<string>>;
  setCurrentTask: Dispatch<SetStateAction<Task | null>>;
  setLayouts: Dispatch<SetStateAction<Layout[]>>;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  editMode,
  setIsLoading,
  setLoadingStage,
  setCurrentTask,
  setLayouts,
  setEditMode
}) => {
  const [showActions, setShowActions] = useState(false);
  console.log(setLoadingStage, setLayouts);
  // const appsProvider = useApps();
  // const apps = appsProvider?.apps || [];

  const handleSetReminderClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation(); // 阻止事件冒泡
    // onSetReminder(task);
  };

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation(); // 阻止事件冒泡
    setEditMode(true);
    setCurrentTask(task);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation(); // 阻止事件冒泡
    // onDelete(task.id);
  };

  const handleTaskExecution = async () => {
    console.log(task);
    setIsLoading(true);
    // const layouts = await getLayoutBasedOnCommand(task.taskName, apps, setLoadingStage);
    setCurrentTask(task);
    // setLayouts(layouts || []);
    setIsLoading(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setShowActions(true);
    },
    onSwipedRight: () => {
      setShowActions(false);
      setEditMode(false);
    },
    onSwiping: () => {
      // onSwiping
    },
    onTap: () => {
      if (!showActions && !editMode) {
        handleTaskExecution();
      } else {
        setShowActions(false);
      }
    },
    trackMouse: true
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      case 'Common':
        return 'bg-blue-500';
      default:
        return 'bg-grey-500';
    }
  };

  return (
    <li
      {...handlers}
      className={`relative overflow-hidden p-2 bg-white hover:bg-gray-100 rounded-md ${showActions ? 'bg-gray-100' : ''}`}
    >
      {/* Task Info */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <span
            className={`block w-3 h-3 rounded-full mr-2 ${getPriorityColor(task.taskPriority)}`}
          ></span>
          <span>{task.taskName}</span>
          {task.taskDeadline && (
            <span className='ml-2 text-xs text-gray-600'>
              Deadline: {new Date(task.taskDeadline).toLocaleDateString()}
            </span>
          )}
        </div>
        {/* Make taskType disappear on swipe */}
        {!showActions && <div className='text-sm text-gray-400'>{task.taskType}</div>}
      </div>
      {/* Action Buttons */}
      <div
        className={`absolute right-4 inset-y-0 w-full flex justify-end transition-transform duration-300 ${showActions ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='w-40 flex items-center justify-evenly rounded'>
          <button
            className='mr-1 p-1 text-white bg-blue-500 rounded'
            onClick={(e) => handleSetReminderClick(e)}
          >
            Reminder
          </button>
          <button
            className='mr-1 p-1 text-white bg-emerald-500 rounded'
            onClick={(e) => handleEditClick(e)}
          >
            Edit
          </button>
          <button
            className='p-1 text-white bg-red-500 rounded'
            onClick={(e) => handleDeleteClick(e)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
