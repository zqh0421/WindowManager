/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer));

// 新增暴露给渲染进程的API
contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data?: any) => {
    // 定义允许的频道列表
    const validChannels = ['open-dev-tools', 'get-open-windows', 'open-external'];
    // 检查频道名是否在列表中
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, listener);
  },
  getOpenWindows: () => ipcRenderer.invoke('get-open-windows'),
  getAllWindows: () => ipcRenderer.invoke('get-all-windows'),
  getAllWindowsName: () => ipcRenderer.invoke('get-all-windows-name'),
  getAllWindowsDetail: () => ipcRenderer.invoke('get-all-windows-detail'),
  recordAppActivity: () => ipcRenderer.invoke('record-app-activity'),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
  executeLayout: (layoutType: string, windows: { appName: string; windowName: string }[]) =>
    ipcRenderer.invoke('execute-layout', layoutType, windows),
  getAllApplications: () => ipcRenderer.invoke('get-all-applications'),
  dbQuery: (operation: string, args: any[] = []) => {
    // 定义允许的频道列表
    const validOperations = [
      'getAllTasks',
      'addTask',
      'deleteTask',
      'addCommand',
      'addAppActivity',
      'getLastAppActivity',
      'updateActiveTime',
      'getAllShortcuts',
      'addShortcut',
      'deleteShortcut',
      'getAllApplications',
      'addApplication',
      'addApplications'
    ];
    // 检查频道名是否在列表中
    if (validOperations.includes(operation)) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send('db-query', { operation, args });
        ipcRenderer.once(`${operation}-response`, (_, { success, data, error }) => {
          if (success) {
            resolve(data);
          } else {
            reject(new Error(error));
          }
        });
      });
    }
  }

  // 可以在此处添加更多方法，例如接收主进程消息的方法
});

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj);

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child);
    }
  }
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
