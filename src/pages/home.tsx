import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLayoutBasedOnCommand } from '@/api/layout';
import Loading from '@/components/loading';
import type { Layout, LayoutWindow } from '@/api/chat';

interface Task {
  taskName: string;
  taskType: string;
}

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingStage, setLoadingStage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLayoutsVisible, setIsLayoutsVisible] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    window.electron
      .dbQuery('getAllTasks')
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
    console.log('current layouts:');
    if (layouts.length > 0) {
      console.log(layouts);
      setIsLayoutsVisible(true);
    }
  }, [layouts.length]);

  const onTaskClick = async (task: Task) => {
    console.log(task);
    setIsLoading(true);
    const layouts = await getLayoutBasedOnCommand(task.taskName, setLoadingStage);
    setCurrentCommand(task.taskName);
    setLayouts(layouts || []);
    setIsLoading(false);
  };

  const clearLayouts = () => {
    setLayouts([]);
    setIsLayoutsVisible(false);
  };

  const executeCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
      console.log(e.currentTarget.value);
      setIsLoading(true);
      const res = await getLayoutBasedOnCommand(e.currentTarget.value, setLoadingStage);
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

  const configShortcuts = () => {
    navigate('/config');
  };

  const executeLayout = (layoutType: string, windows: LayoutWindow[]) => {
    window.electron.executeLayout(layoutType, windows);
  };

  return (
    <div className='flex flex-col bg-white text-gray-800 rounded-lg shadow-lg w-screen overflow-auto'>
      {/* input bar */}
      <input
        className='w-full h-14 bg-gray-200 p-4 text-gray-800 focus:outline-none border-[1px] border-gray-300'
        type='text'
        placeholder='Create your aiming task...'
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
                <span>{item.taskName}</span>
              </div>
              <div className='text-sm text-gray-400'>{item.taskType}</div>
            </li>
          ))}
        </ul>
      </div>
      {/* bottom bar */}
      {isLayoutsVisible && (
        <div className='bg-zinc-200 text-center w-[100vw] absolute top-14 left-[0vw] max-h-[calc(100vh-3.5rem)] overflow-y-scroll'>
          <div>Recommended Layouts {currentCommand ? 'for ' + currentCommand : ''}</div>
          <div
            className='sticky top-[40%] left-3 w-6 h-6 bg-black rounded-2xl'
            onClick={() => setIndex(index + 1)}
          >
            -Re-Organize
          </div>
          <div className='bg-zinc-400 flex flex-col items-center w-[full]'>
            {layouts.map(({ windows, task, layoutType }, index) => {
              return (
                <div
                  className='mb-4'
                  key={index}
                  onClick={() => executeLayout(layoutType, windows)}
                >
                  <div>{task}</div>
                  {/* TODO: organize layout */}
                  <div className='bg-black w-[50vw] h-[40vh] relative'>
                    {
                      layoutType === 'Full Screen' ? (
                        <div className='top-0 left-0 w-full h-full absolute bg-white  text-center flex justify-center items-center border-blue-500 border-4 group'>
                          <div>{windows[index % 1].description}</div>
                          <div
                            className="window-info z-[99] absolute top-0 left-[calc(100%+2rem)] w-[calc(40%)] h-full bg-white bg-opacity-90 group-hover:flex flex-col hidden justify-center items-center text-center border-4 border-blue-500
                          before:content-[''] before:absolute before:top-[50%] before:left-[-0.6rem] before:w-0 before:h-0 before:border-t-[0.6rem] before:border-b-[0.6rem] before:border-r-[0.6rem] before:border-t-transparent before:border-b-transparent before:border-r-blue-500"
                          >
                            <p>{windows[index % 1].appName}</p>
                            <p>{windows[index % 1].windowTitle}</p>
                          </div>
                        </div>
                      ) : layoutType === 'Left Half + Right Half' ? (
                        <div>
                          <div className='top-0 left-0 w-[50%] h-full absolute bg-white text-center flex justify-center items-center border-blue-500 border-4 group'>
                            <div>{windows[index % 2].description}</div>
                            <div
                              className="window-info z-[99] absolute top-0 left-[calc(100%+2rem)] w-[calc(80%)] h-full bg-white bg-opacity-90 group-hover:flex flex-col hidden justify-center items-center text-center border-4 border-blue-500
                          before:content-[''] before:absolute before:top-[50%] before:left-[-0.6rem] before:w-0 before:h-0 before:border-t-[0.6rem] before:border-b-[0.6rem] before:border-r-[0.6rem] before:border-t-transparent before:border-b-transparent before:border-r-blue-500"
                            >
                              <p>{windows[index % 2].appName}</p>
                              <p>{windows[index % 2].windowTitle}</p>
                            </div>
                          </div>
                          <div className='top-0 right-0 w-[50%] h-full absolute bg-white text-center flex justify-center items-center border-blue-500 border-4 group'>
                            <div>{windows[(index + 1) % 2].description}</div>
                            <div
                              className="window-info z-[99] absolute top-0 left-[calc(100%+2rem)] w-[calc(80%)] h-full bg-white bg-opacity-90 group-hover:flex flex-col hidden justify-center items-center text-center border-4 border-blue-500
                          before:content-[''] before:absolute before:top-[50%] before:left-[-0.6rem] before:w-0 before:h-0 before:border-t-[0.6rem] before:border-b-[0.6rem] before:border-r-[0.6rem] before:border-t-transparent before:border-b-transparent before:border-r-blue-500"
                            >
                              <p>{windows[(index + 1) % 2].appName}</p>
                              <p>{windows[(index + 1) % 2].windowTitle}</p>
                            </div>
                          </div>
                        </div>
                      ) : layoutType === 'Top Half + Bottom Half' ? (
                        <div>
                          <div className='top-0 left-0 w-full h-1/2 absolute bg-white text-center flex justify-center items-center border-blue-500 border-4 group'>
                            <div>{windows[index % 2].description}</div>
                            <div
                              className="window-info z-[99] absolute top-0 left-[calc(100%+2rem)] w-[calc(40%)] h-full bg-white bg-opacity-90 group-hover:flex flex-col hidden justify-center items-center text-center border-4 border-blue-500
                          before:content-[''] before:absolute before:top-[50%] before:left-[-0.6rem] before:w-0 before:h-0 before:border-t-[0.6rem] before:border-b-[0.6rem] before:border-r-[0.6rem] before:border-t-transparent before:border-b-transparent before:border-r-blue-500"
                            >
                              <p>{windows[index % 2].appName}</p>
                              <p>{windows[index % 2].windowTitle}</p>
                            </div>
                          </div>
                          <div className='left-0 bottom-0 w-full h-1/2 absolute bg-white text-center flex justify-center items-center border-blue-500 border-4 group'>
                            <div>{windows[(index + 1) % 2].description}</div>
                            <div
                              className="window-info z-[99] absolute top-0 left-[calc(100%+2rem)] w-[calc(40%)] h-full bg-white bg-opacity-90 group-hover:flex flex-col hidden justify-center items-center text-center border-4 border-blue-500
                          before:content-[''] before:absolute before:top-[50%] before:left-[-0.6rem] before:w-0 before:h-0 before:border-t-[0.6rem] before:border-b-[0.6rem] before:border-r-[0.6rem] before:border-t-transparent before:border-b-transparent before:border-r-blue-500"
                            >
                              <p>{windows[(index + 1) % 2].appName}</p>
                              <p>{windows[(index + 1) % 2].windowTitle}</p>
                            </div>
                          </div>
                        </div>
                      ) : layoutType === 'First Fourth + Last Three Fourth' ? (
                        <div>
                          <div className='top-0 left-0 w-1/4 h-full absolute bg-white text-center flex justify-center items-center border-blue-500 border-4'>
                            <div>{windows[index % 2].description}</div>
                          </div>
                          <div className='right-0 top-0 w-3/4 h-full absolute bg-white text-center flex justify-center items-center border-blue-500 border-4'>
                            <div>{windows[(index + 1) % 2].description}</div>
                          </div>
                        </div>
                      ) : layoutType === 'First Three Fourths + Last Fourth' ? (
                        <div>
                          <div className='top-0 left-0 w-3/4 h-full absolute bg-white text-center flex justify-center items-center border-blue-500 border-4'>
                            <div>{windows[index % 2].description}</div>
                          </div>
                          <div className='right-0 top-0 w-1/4 h-full absolute bg-white text-center flex justify-center items-center border-blue-500 border-4'>
                            <div>{windows[(index + 1) % 2].description}</div>
                          </div>
                        </div>
                      ) : null // TODO: add more layout types
                    }
                  </div>
                </div>
              );
            })}
          </div>
          <div onClick={clearLayouts}>x</div>
        </div>
      )}
      <div className='bg-gray-200 p-2 flex justify-between items-center'>
        <span className='text-sm text-gray-600'>Opt+Space</span>
        <button onClick={() => configShortcuts()}>Config Shortcuts</button>{' '}
        {/* Add a new Table for Shortcuts*/}
        <button onClick={() => navigate('/test')}>Go to Test</button>
        <button className='text-blue-500 hover:text-blue-600'>Settings</button>
      </div>
      <Loading isLoading={isLoading} loadingStage={loadingStage} />
    </div>
  );
};

export default Home;
