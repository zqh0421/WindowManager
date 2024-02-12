import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/electron-vite.animate.svg';

const Test = () => {
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
      <button>Click to Test Langchain API</button>
    </React.Fragment>
  );
};

export default Test;
