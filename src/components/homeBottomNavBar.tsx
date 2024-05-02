import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='absolute w-screen bottom-0 h-16 bg-gray-200 p-2 flex justify-between items-center'>
      <span className='text-sm text-gray-600'>Opt+Space</span>
      <button onClick={() => navigate('/config')}>Config Shortcuts</button>
      <button onClick={() => navigate('/test')}>Go to Test</button>
      <button className='text-blue-500 hover:text-blue-600'>Settings</button>
    </div>
  );
};

export default NavigationBar;
