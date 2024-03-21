// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

const Home = () => {
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
        placeholder='Search for apps and commands...'
      />
      {/* list view */}
      <div className='p-4 overflow-y-scroll max-h-80'>
        <div className='mb-4'>{/* Map over your commands here */}</div>
        <div className='text-gray-600 text-sm mb-2'>Welcome to your AI window manager</div>
        <div className='flex items-center justify-between mb-4'>
          <div className='text-gray-600 text-sm'>Start supercharging your productivity</div>
          <div className='text-blue-500 text-sm'>9% completed</div>
          <button className='text-blue-500'>Walkthrough</button>
        </div>
        <div className='mb-4'>
          {['Left Half', 'Right Half', 'Top Last Fourth', 'Move Down', 'Window Manager'].map(
            (item, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-2 hover:bg-gray-100 rounded-md'
              >
                <div className='flex items-center'>
                  <span className='block w-3 h-3 bg-blue-500 rounded-full mr-2'></span>
                  <span>{item}</span>
                </div>
                <div className='text-sm text-gray-400'>Command</div>
              </div>
            )
          )}
        </div>
      </div>
      {/* bottom bar */}
      <div className='bg-gray-200 p-2 flex justify-between items-center'>
        <span className='text-sm text-gray-600'>Shortcuts</span>
        <button onClick={() => navigate('/test')}>Go to Test</button>
        <button className='text-blue-500 hover:text-blue-600'>Settings</button>
      </div>
    </div>
  );
};

export default Home;
