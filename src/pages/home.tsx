import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLayoutBasedOnCommand } from '@/api/layout';
import Loading from '@/components/loading';

interface Task {
  TaskName: string;
  TaskType: string;
}

// interface Layout {
//   taskName: string;
//   layouts: {
//     appName: string;
//     windowTitle: string;
//     windowManagement: string;
//     description: string;
//   }[];
// }

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingStage, setLoadingStage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [layouts, setLayouts] = useState<object | null>([]);

  useEffect(() => {
    window.electron
      .invoke('getAllTasks')
      .then((tasks) => {
        setTasks(tasks);
        console.log(tasks);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    console.log(tasks);
  }, [tasks.length]);

  useEffect(() => {
    console.log(layouts);
  }, [layouts]);

  const onTaskClick = async (task: Task) => {
    console.log(task);
    setIsLoading(true);
    const res = await getLayoutBasedOnCommand(task.TaskName, setLoadingStage);
    if (res) {
      // res JSON.parse(res);
    }
    setLayouts(res || null);
    setIsLoading(false);
  };

  const executeCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
      console.log(e.currentTarget.value);
      setIsLoading(true);
      const res = await getLayoutBasedOnCommand(e.currentTarget.value, setLoadingStage);
      // if (res) {
      //   // res JSON.parse(res);
      // }
      setLayouts(res || null);
      setIsLoading(false);
    }
  };
  // const [listHeight, setListHeight] = useState<number>(0);
  // const setWindowSize = () => {
  //   const searchBarHeight = 50; // Adjust this value as needed
  //   const windowHeight = searchBarHeight + listHeight + 20; // Adjust this value as needed
  //   window.electron.send('adjust-window-size', { height: windowHeight });
  // };
  // // Update the window size whenever the list height changes
  // useEffect(() => {
  //   setWindowSize();
  // }, [listHeight]);

  const navigate = useNavigate();
  return (
    <div className='flex flex-col bg-white text-gray-800 rounded-lg shadow-lg w-screen overflow-auto'>
      {/* input bar */}
      <input
        className='w-full h-14 bg-gray-200 p-4 text-gray-800 focus:outline-none border-[1px] border-gray-300'
        type='text'
        placeholder='Enter your aiming task...'
        onKeyUp={(e) => {
          executeCommand(e);
        }}
      />
      {/* list view */}
      <div className='p-4 overflow-y-scroll max-h-80'>
        <div className='mb-4'>{/* Map over your commands here */}</div>
        <div className='text-gray-600 text-sm mb-2'>Welcome to your AI window manager</div>
        <div className='flex items-center justify-between mb-4'>
          <div className='text-gray-600 text-sm'>Start supercharging your productivity</div>
          <div className='text-blue-500 text-sm'>0% completed</div>
          <button className='text-blue-500'>Walkthrough</button>
        </div>
        <ul className='mb-4'>
          {tasks.map((item: Task, index: number) => (
            <li
              key={index}
              className='flex items-center justify-between p-2 hover:bg-gray-100 rounded-md'
              onClick={() => onTaskClick(item)}
            >
              <div className='flex items-center'>
                <span className='block w-3 h-3 bg-blue-500 rounded-full mr-2'></span>
                <span>{item.TaskName}</span>
              </div>
              <div className='text-sm text-gray-400'>{item.TaskType}</div>
            </li>
          ))}
        </ul>
      </div>
      {/* bottom bar */}
      <div className='bg-gray-200 p-2 flex justify-between items-center'>
        <span className='text-sm text-gray-600'>Shortcuts</span>
        <button onClick={() => navigate('/test')}>Go to Test</button>
        <button className='text-blue-500 hover:text-blue-600'>Settings</button>
      </div>
      <Loading isLoading={isLoading} loadingStage={loadingStage} />
    </div>
  );
};

export default Home;
