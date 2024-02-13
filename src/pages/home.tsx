import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/electron-vite.animate.svg';

const Home = () => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  return (
    <>
      <div className='flex flex-row justify-center'>
        <a href='https://electron-vite.github.io' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1 className='text-4xl'>Window Manager</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
      </div>
      <button onClick={() => navigate('/test')}>Go to Test</button>
    </>
  );
};

export default Home;
