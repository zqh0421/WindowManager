import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShortcutList from '@/components/shortcutList';

export type Shortcut = {
  id: number | string;
  combination: string;
  globe: string;
  type: string;
  applicationName?: string;
  websiteUrl?: string;
  filePath?: string;
  windowId?: number;
  operationType?: string;
  initialTime?: string; // or Date if you prefer
};

export type ApplicationInDB = {
  id: number;
  name: string;
};

const Config = () => {
  const [applications, setApplications] = useState<ApplicationInDB[]>([]);
  const [shortcutList, setShortcutList] = useState<Shortcut[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.electron
      .dbQuery('getAllShortcuts')
      .then((shortcuts) => {
        setShortcutList(shortcuts);
      })
      .catch(console.error);

    window.electron
      .dbQuery('getAllApplications')
      .then((apps) => {
        setApplications(apps);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    console.log(shortcutList);
  }, [shortcutList.length]);

  return (
    <div className='container mx-auto p-4 text-gray-800'>
      <div className='sticky top-0 bg-white flex justify-between items-center pt-6 pb-4 border-b-[1px]'>
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition'
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h3 className='text-lg font-semibold'>Configure Shortcuts</h3>
        <button
          type='submit'
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition'
        >
          Save
        </button>
      </div>
      <ShortcutList
        items={shortcutList.filter((item) => item.type === 'Application')}
        itemType='Application'
      />
      <hr />
      <ShortcutList
        items={applications
          .filter(
            (application) =>
              !shortcutList.some((shortcut) => shortcut.applicationName === application.name)
          )
          .map(
            (application) =>
              ({
                id: application.id,
                combination: '<Empty>',
                globe: '',
                type: 'Application',
                applicationName: application.name
              }) as Shortcut
          )}
      />
      <ShortcutList
        items={shortcutList.filter((item) => item.type === 'Operation')}
        itemType='Operation'
      />
      <ShortcutList
        items={shortcutList.filter((item) => item.type === 'Website')}
        itemType='Website'
      />
    </div>
  );
};

export default Config;
