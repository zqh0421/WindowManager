import React from 'react';

interface LoadingProps {
  isLoading: boolean; // 控制加载动画的显示
  loadingStage: string; // 控制加载动画的文字显示
}

const Loading: React.FC<LoadingProps> = ({ isLoading, loadingStage }) => {
  return (
    isLoading && (
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-opacity-50 bg-neutral-600 p-4 rounded-xl'>
        <p>{loadingStage ? loadingStage : 'Loading...'}</p>
      </div>
    )
  );
};

export default Loading;
