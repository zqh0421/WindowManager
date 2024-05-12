import React from 'react';
import ShortcutItem from './shortcutItem';
import type { Shortcut } from '@/pages/config';
import ShortcutUtility from './shortcutUtility';

interface ShortcutListProps {
  items: Shortcut[];
  itemType?: string;
}

const ShortcutList: React.FC<ShortcutListProps> = ({ items, itemType }) => {
  return (
    <div>
      <div className='flex flex-row justify-between align-middle leading-[60px]'>
        <h4 className='text-lg font-bold mt-4'>{itemType}</h4>
        {itemType && <ShortcutUtility itemType={itemType} />}
      </div>
      <ul>
        {items.map((item) => {
          console.log(item);
          let tempTitle = '';
          if (itemType === 'Application' && item.applicationName) {
            tempTitle = item.applicationName;
          } else if (itemType === 'Website' && item.websiteUrl) {
            tempTitle = item.websiteUrl;
          } else if (itemType === 'Operation' && item.operationType) {
            tempTitle = item.operationType;
          }
          return (
            <ShortcutItem
              id={item.id}
              key={item.id}
              combination={item.combination}
              globe={item.globe}
              title={tempTitle || 'ERROR'}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ShortcutList;
