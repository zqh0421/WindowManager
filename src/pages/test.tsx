import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/electron-vite.animate.svg';
import { getAnswer } from '@/api/chat';

export interface IWindow {
  id: string;
  title: string;
  position: string;
  processName: string;
  size: string;
}

const Test = () => {
  const [windows, setWindows] = useState<Array<IWindow>>([]);

  useEffect(() => {
    console.log(windows);
  }, [windows]);

  const handleTestLangchainAPI = async () => {
    const answer = await getAnswer('Hello, nice to see you!');
    console.log(answer);
  };

  const handleOpenDevTools = () => {
    window.electron.send('open-dev-tools');
  };

  const getOpenWindows = () => {
    window.electron.getOpenWindows().then((openWindows) => setWindows(openWindows));
  };

  const getAllWindows = async () => {
    try {
      const allWindows = await window.electron.getAllWindows();
      setWindows(allWindows);
    } catch (error) {
      console.error('Failed to fetch windows:', error);
    }
  };

  const getAllWindowsDetail = async () => {
    try {
      const allWindows = await window.electron.getAllWindowsDetail();
      setWindows(allWindows);
    } catch (error) {
      console.error('Failed to fetch windows:', error);
    }
  };

  const openWebPage = () => {
    // Ensure the electron object is available before using it
    window.electron.send('open-external', 'https://google.com');
  };

  return (
    <React.Fragment>
      <Link to={'/'}>Back to Home</Link>
      <title>Next - Nextron (with-tailwindcss)</title>
      <div className='grid grid-col-1 text-2xl w-full text-center'>
        <div>
          <img className='ml-auto mr-auto' src={logo} alt='Logo image' width='96px' height='96px' />
        </div>
        <span>⚡ Test Page ⚡</span>
      </div>
      <div className='mt-1 w-full flex-wrap flex justify-center'></div>
      <button onClick={handleTestLangchainAPI}>Click to Test Langchain API</button>
      <button onClick={handleOpenDevTools}>Open Dev Tools</button>
      <button onClick={getOpenWindows}>Get Open Windows</button>
      <ul>
        {windows.map((window, index) => (
          <li key={index}>{window.title}</li>
        ))}
      </ul>
      <ul>
        {windows.map((window, index) => (
          <li key={index}>
            <p>{window.processName}</p>
            <p>{window.title}</p>
            <p>{window.position}</p>
            <p>{window.size}</p>
          </li>
        ))}
      </ul>
      <button onClick={getAllWindows}>Get All Windows</button>
      <button onClick={getAllWindowsDetail}>Get All Windows Details</button>
      <button onClick={openWebPage}>打开外部网页</button>
    </React.Fragment>
  );
};

export default Test;
