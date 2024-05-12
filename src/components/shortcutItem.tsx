import { useSwipeable } from 'react-swipeable';
import React, { useState } from 'react';

interface ShortcutItemProps {
  id: number | string;
  combination: string;
  globe: string;
  title: string;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ id, combination, globe, title }) => {
  const [showActions, setShowActions] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowActions(true),
    onSwipedRight: () => setShowActions(false),
    trackMouse: true
  });

  return (
    <li
      key={combination || id}
      {...handlers}
      className={`relative overflow-hidden p-2 bg-white hover:bg-gray-100 rounded-md ${showActions ? 'bg-gray-100' : ''}`}
    >
      <div className='flex justify-between items-center'>
        <div>
          <span>{title}</span>
          <button className='ml-2 p-1 text-white text-sm bg-blue-500 rounded-md hover:bg-blue-700 transition'>
            {combination}
          </button>
        </div>
        <span className='text-gray-500'>{globe}</span>
      </div>
      {showActions && (
        <div className='absolute inset-y-0 right-0 flex justify-end transition-transform duration-300'>
          <div className='w-40 flex items-center justify-evenly rounded bg-white'>
            <button className='p-1 text-white bg-red-500 rounded'>Delete</button>
          </div>
        </div>
      )}
    </li>
  );
};

export default ShortcutItem;
