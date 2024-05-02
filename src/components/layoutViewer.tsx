import React from 'react';
import type { Layout, LayoutWindow } from '@/api/chat';

interface LayoutViewerProps {
  layouts: Layout[];
  currentCommand: string;
  clearLayouts: () => void;
}

const LayoutViewer: React.FC<LayoutViewerProps> = ({ layouts, currentCommand, clearLayouts }) => {
  const executeLayout = (layoutType: string, windows: LayoutWindow[]) => {
    window.electron.executeLayout(layoutType, windows);
  };

  return (
    <div className='bg-zinc-200 text-center w-[100vw] absolute top-14 left-[0vw] max-h-[calc(100vh-3.5rem)] overflow-y-scroll'>
      <div>Recommended Layouts {currentCommand ? 'for ' + currentCommand : ''}</div>
      <div
        className='sticky top-[40%] left-3 w-6 h-6 bg-black rounded-2xl'
        // onClick={() => setIndex(index + 1)}
      >
        -Re-Organize
      </div>
      <div className='bg-zinc-400 flex flex-col items-center w-[full]'>
        {layouts.map(({ windows, task, layoutType }, index) => {
          return (
            <div className='mb-4' key={index} onClick={() => executeLayout(layoutType, windows)}>
              <div>{task}</div>
              {/* TODO: organize layout */}
              <div className='bg-white w-[50vw] h-[40vh] relative'>
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
      <div onClick={clearLayouts} className='p-10'>
        x
      </div>
    </div>
  );
};

export default LayoutViewer;
