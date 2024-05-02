import { useEffect, useState } from 'react';
import { getRecommendedLayout } from '@/api/layout';
import Loading from '@/components/loading';
import type { Layout } from '@/api/chat';
import TaskList from '../components/taskList';
import LayoutViewer from '../components/layoutViewer';
import CommandInputBar from '../components/commandInputBar';
import NavigationBar from '../components/homeBottomNavBar';
import type { Task } from '../components/taskList';
import TaskEditPanel from '@/components/editPanel';

const Home = () => {
  const [loadingStage, setLoadingStage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLayoutsVisible, setIsLayoutsVisible] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentTask, setCurrentTask] = useState<Task | null>(null); // Task is defined in taskList.tsx
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    console.log('current layouts:');
    if (layouts.length > 0) {
      console.log(layouts);
      setIsLayoutsVisible(true);
    }
  }, [layouts.length]);

  const clearLayouts = () => {
    setLayouts([]);
    setIsLayoutsVisible(false);
  };

  const onPlanningLayout = async () => {
    setIsLoading(true);
    setLayouts([]);
    const res = await getRecommendedLayout(setLoadingStage);
    setLayouts(res || null);
    setIsLoading(false);
  };

  return (
    <div className='relative h-screen rounded-lg shadow-lg'>
      <div className='flex flex-col bg-white text-gray-800 w-screen overflow-auto'>
        {/* input bar */}
        <CommandInputBar
          setIsLoading={setIsLoading}
          setLayouts={setLayouts}
          setLoadingStage={setLoadingStage}
          setCurrentCommand={setCurrentCommand}
        />

        {/* list view */}
        <div className='p-4 overflow-y-scroll h-[340px]'>
          <div className='text-gray-600 text-sm mb-2'>Welcome to your AI window manager</div>

          <div className='flex items-center justify-between mb-4'>
            <div className='text-gray-600 text-sm'>Start supercharging your productivity</div>
            <div className='text-blue-500 text-sm'>0% completed</div>
            <button className='text-blue-500 py-1 px-4'>Walkthrough</button>
          </div>

          <div className='flex items-center justify-between mb-4'>
            <div className='text-gray-600 text-sm'>Start your first layout planning randomly</div>
            <button onClick={() => onPlanningLayout()} className='text-blue-500 py-1 px-4'>
              Go
            </button>
          </div>

          <TaskList
            setIsLoading={setIsLoading}
            setCurrentTask={setCurrentTask}
            setLayouts={setLayouts}
            setLoadingStage={setLoadingStage}
            setEditMode={setEditMode}
            editMode={editMode}
          />
        </div>

        {/* Edit Panel */}
        {editMode && (
          <div
            className='absolute top-0 right-0 bottom-0 left-0 z-10'
            onClick={() => setEditMode(false)}
          ></div>
        )}
        <div
          className={`absolute flex flex-col top-0 right-0 z-20 w-96 h-full bg-white shadow-lg p-4 transition-transform duration-300 ${editMode ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {currentTask && (
            <TaskEditPanel
              task={currentTask}
              editMode={editMode}
              setEditMode={setEditMode}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
        {/* Layout Viewer */}

        {isLayoutsVisible && layouts && (
          <LayoutViewer
            layouts={layouts}
            currentCommand={currentCommand}
            clearLayouts={clearLayouts}
          />
        )}

        <Loading isLoading={isLoading} loadingStage={loadingStage} />
      </div>
      <NavigationBar />
    </div>
  );
};

export default Home;
