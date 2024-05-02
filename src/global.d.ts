/* eslint-disable @typescript-eslint/no-explicit-any */
import { IWindow } from '@/pages/test';
import { LayoutWindow } from './api/chat';

export {}; // 确保这个文件被当作一个模块处理

declare global {
  interface Window {
    electron: {
      send: (channel: string, data?: any) => void;
      dbQuery: (operation: string, data?: any) => Promise<any>;
      receive: (channel: string, listener: (...args: any[]) => void) => void;
      // 根据需要在这里添加其他方法的声明
      getOpenWindows: () => Promise<Array<IWindow>>;
      getAllWindows: () => Promise<Array<any>>;
      getAllWindowsName: () => Promise<Array<any>>;
      getAllWindowsDetail: () => Promise<Array<any>>;
      getAllApplications: () => Promise<Array<any>>;
      recordAppActivity: () => Promise<Array<any>>;
      executeLayout: (layoutType: string, windows: LayoutWindow[]) => Promise<Array<any>>;
    };
    dbQuery: {
      addAppActivity: (
        appName: string,
        windowTitle: string,
        windowSize: string,
        windowPosition: string
      ) => Promise<any>;
      getLastAppActivity: () => Promise<any>;
      updateActiveTime: (id: number) => Promise<any>;
      addTask: (
        taskName: string,
        taskType: string,
        taskStatus: string,
        taskPriority: number,
        taskDeadline?: string,
        taskDescription?: string
      ) => Promise<any>;
      getAllTasks: () => Promise<any>;
      deleteTask: (id: number) => Promise<any>;
      addCommand: (command: string, layouts: Layout[]) => Promise<any>;
    };
  }
}
