interface ShortcutUtilityProps {
  itemType: string;
}

const ShortcutUtility: React.FC<ShortcutUtilityProps> = ({ itemType }) => {
  if (itemType === 'Application')
    return (
      <div>
        <span className='ml-2 p-1 text-white text-sm rounded-md bg-yellow-500 hover:bg-yellow-700 transition'>
          Refresh
        </span>
        <span className='ml-2 p-1 text-white text-sm rounded-md bg-green-500 hover:bg-green-700 transition'>
          Auto-generate
        </span>
      </div>
    );
};

export default ShortcutUtility;
