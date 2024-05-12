import '@/App.css';
import { RouterProvider } from 'react-router-dom';
import router from '@/router/index';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apps = await window.electron.getAllApplications();
        if (!Array.isArray(apps)) {
          throw new Error('apps is not an array');
        }
        window.electron.dbQuery('addApplications', apps);
      } catch (error) {
        console.error('Error fetching or processing applications:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
