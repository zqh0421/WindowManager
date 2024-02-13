/* eslint-disable @typescript-eslint/no-explicit-any */
import { IWindow } from '@/pages/test';

export {}; // 确保这个文件被当作一个模块处理

declare global {
  interface Window {
    electron: {
      send: (channel: string, data?: any) => void;
      // 根据需要在这里添加其他方法的声明
      getOpenWindows: () => Promise<Array<IWindow>>;
      getAllWindows: () => Promise<Array<any>>;
    };
  }
}
