import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { getLayoutBasedOnCommand } from '@/api/layout';
import type { Layout } from '@/api/chat';

// import { useApps } from '@/context/appsContext';

interface CommandInputBarProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setLayouts: Dispatch<SetStateAction<Layout[]>>;
  setLoadingStage: Dispatch<SetStateAction<string>>;
  setCurrentCommand: Dispatch<SetStateAction<string>>;
}

const CommandInputBar: React.FC<CommandInputBarProps> = ({
  setIsLoading,
  setLayouts,
  setLoadingStage,
  setCurrentCommand
}) => {
  // TODO: Get apps from context
  const apps: string[] = [];
  // const appsProvider = useApps();
  // const apps = appsProvider?.apps || [];
  const executeCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
      console.log(e.currentTarget.value);
      setIsLoading(true);
      setLayouts([]);
      setCurrentCommand(e.currentTarget.value);
      const res = await getLayoutBasedOnCommand(e.currentTarget.value, apps, setLoadingStage);
      setLayouts(res || null);
      setIsLoading(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(e);
    }
  };

  return (
    <input
      className='w-full h-14 bg-gray-200 p-4 text-gray-800 focus:outline-none border-[1px] border-gray-300'
      type='text'
      placeholder='Create your aiming task...'
      onKeyUp={handleKeyUp}
    />
  );
};

export default CommandInputBar;
