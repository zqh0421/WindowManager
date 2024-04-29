// 导入创建路由的函数
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/home';
import Test from '@/pages/test';
import Config from '@/pages/config';
import NotFound from '@/pages/NotFound';

// 创建router路由实例对象，并配置路由对应关系（路由数组）
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/test',
    element: <Test />
  },
  {
    path: '/config',
    element: <Config />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
