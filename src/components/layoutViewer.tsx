import React, { Dispatch, SetStateAction, useState } from 'react';
import type { Layout, LayoutWindow } from '@/api/chat';

interface LayoutViewerProps {
  layouts: Layout[];
  currentCommand: string;
  clearLayouts: () => void;
}

const ReorganizeButton: React.FC<{ index: number; setIndex: Dispatch<SetStateAction<number>> }> = ({
  index,
  setIndex
}) => {
  const onReorganize = () => {
    setIndex(index + 1);
  };
  return (
    <div
      className='absolute top-[50%] -left-10 w-6 h-6 bg-blue-500 rounded-2xl'
      onClick={onReorganize}
    ></div>
  );
};

const LayoutItem: React.FC<{ windows: LayoutWindow[]; layoutType: string }> = ({
  windows,
  layoutType
}) => {
  const [index, setIndex] = useState(0);
  const executeLayout = (layoutType: string, windows: LayoutWindow[]) => {
    window.electron.executeLayout(layoutType, windows);
  };
  const classNameOutline = `
    absolute bg-white text-center flex justify-center items-center border-blue-500 border-4 group
  `;
  const classNameHoverItem = `
    window-info z-[99] absolute w-36 h-full
    after:content-[''] after:absolute after:top-[50%] after:left-[-0.6rem] after:w-0 after:h-0 after:border-t-[0.6rem] after:border-b-[0.6rem] after:border-r-[0.6rem] after:border-t-transparent after:border-b-transparent after:border-r-blue-500
    bg-white bg-opacity-90 group-hover:flex flex-col hidden justify-center items-center text-center border-4 border-blue-500
  `;
  switch (layoutType) {
    case 'Full Screen':
      return (
        <div>
          <div
            className={`top-0 left-0 w-full h-full ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[index % 1].description}</div>
            <div
              className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}
              onClick={() => executeLayout(layoutType, windows)}
            >
              <p>{windows[index % 1].appName}</p>
              <p>{windows[index % 1].windowTitle}</p>
            </div>
          </div>
        </div>
      );
    case 'Left Half + Right Half':
      return (
        <div>
          <ReorganizeButton index={index} setIndex={setIndex} />
          <div
            className={`top-0 left-0 w-[50%] h-full ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[index % 2].description}</div>
            <div className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}>
              <p>{windows[index % 2].appName}</p>
              <p>{windows[index % 2].windowTitle}</p>
            </div>
          </div>
          <div
            className={`top-0 right-0 w-[50%] h-full ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[(index + 1) % 2].description}</div>
            <div className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}>
              <p>{windows[(index + 1) % 2].appName}</p>
              <p>{windows[(index + 1) % 2].windowTitle}</p>
            </div>
          </div>
        </div>
      );
    case 'Top Half + Bottom Half':
      return (
        <div>
          <ReorganizeButton index={index} setIndex={setIndex} />
          <div
            className={`top-0 left-0 w-full h-1/2 ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[index % 2].description}</div>
            <div className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}>
              <p>{windows[index % 2].appName}</p>
              <p>{windows[index % 2].windowTitle}</p>
            </div>
          </div>
          <div
            className={`left-0 bottom-0 w-full h-1/2 ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[(index + 1) % 2].description}</div>
            <div className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}>
              <p>{windows[(index + 1) % 2].appName}</p>
              <p>{windows[(index + 1) % 2].windowTitle}</p>
            </div>
          </div>
        </div>
      );
    case 'First Fourth + Last Three Fourth':
      return (
        <div>
          <ReorganizeButton index={index} setIndex={setIndex} />
          <div
            className={`top-0 left-0 w-1/4 h-full ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[index % 2].description}</div>
            <div className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}>
              <p>{windows[index % 2].appName}</p>
              <p>{windows[index % 2].windowTitle}</p>
            </div>
          </div>
          <div
            className={`right-0 top-0 w-3/4 h-full ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[(index + 1) % 2].description}</div>
            <div className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}>
              <p>{windows[(index + 1) % 2].appName}</p>
              <p>{windows[(index + 1) % 2].windowTitle}</p>
            </div>
          </div>
        </div>
      );
    case 'First Three Fourths + Last Fourth':
      return (
        <div>
          <ReorganizeButton index={index} setIndex={setIndex} />
          <div
            className={`top-0 left-0 w-3/4 h-full ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[index % 2].description}</div>
            <div className={`left-[calc(230px+2rem)] ${classNameHoverItem}`}>
              <p>{windows[index % 2].appName}</p>
              <p>{windows[index % 2].windowTitle}</p>
            </div>
          </div>
          <div
            className={`right-0 top-0 w-1/4 h-full ${classNameOutline}`}
            onClick={() => executeLayout(layoutType, windows)}
          >
            <div>{windows[(index + 1) % 2].description}</div>
            <div className={`left-[calc(100%+2rem)] ${classNameHoverItem}`}>
              <p>{windows[(index + 1) % 2].appName}</p>
              <p>{windows[(index + 1) % 2].windowTitle}</p>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const LayoutViewer: React.FC<LayoutViewerProps> = ({ layouts, currentCommand, clearLayouts }) => {
  const clear = () => {
    clearLayouts();
  };

  return (
    <div className='bg-zinc-200 text-center w-[100vw] absolute top-14 left-[0vw] max-h-[calc(100vh-3.5rem)] overflow-y-scroll'>
      <div>Recommended Layouts {currentCommand ? 'for ' + currentCommand : ''}</div>
      <div className='bg-zinc-400 flex flex-col items-center w-[full]'>
        {layouts.map(({ windows, task, layoutType }, index) => {
          return (
            <ul className='mb-4  -translate-x-10' key={index}>
              <div>{task}</div>
              {/* TODO: organize layout */}
              <div className='bg-white w-[300px] h-[150px] relative'>
                <LayoutItem windows={windows} layoutType={layoutType} />
              </div>
            </ul>
          );
        })}
      </div>
      <div onClick={clear} className='p-4'>
        Close
      </div>
    </div>
  );
};

export default LayoutViewer;
