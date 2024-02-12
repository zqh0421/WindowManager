// 导入创建路由的函数
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
import Test from '../pages/test';

// 创建router路由实例对象，并配置路由对应关系（路由数组）
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/test',
    element: <Test />
  }
]);

export default router;
