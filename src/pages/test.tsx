import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/electron-vite.animate.svg';
import { getAnswer, getAnswerAssistant } from '@/api/chat';

export interface IWindow {
  title: string;
  position: string;
  processName: string;
  size: string;
}

const Test = () => {
  const [windows, setWindows] = useState<Array<IWindow>>([]);
  const [command, setCommand] = useState<string>('');

  useEffect(() => {
    console.log(windows);
  }, [windows]);

  const handleTestLangchainAPI = async () => {
    const answer = await getAnswer('Hello, nice to see you!');
    console.log(answer);
  };

  const handleTestOpenAiAPI = async () => {
    const answer = await getAnswerAssistant('Hello, nice to see you!');
    console.log(answer);
  };

  const handleOpenDevTools = () => {
    window.electron.send('open-dev-tools');
  };

  const getOpenWindows = () => {
    window.electron.getOpenWindows().then((openWindows) => setWindows(openWindows));
  };

  const getAllWindows = async () => {
    try {
      const allWindows = await window.electron.getAllWindows();
      setWindows(allWindows);
    } catch (error) {
      console.error('Failed to fetch windows:', error);
    }
  };

  const getAllWindowsDetail = async () => {
    try {
      const allWindows = await window.electron.getAllWindowsDetail();
      const temp = allWindows.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.position === value.position &&
              t.size === value.size &&
              t.title === value.title &&
              t.processName === value.processName
          )
      );
      setWindows(temp);
    } catch (error) {
      console.error('Failed to fetch windows:', error);
    }
  };

  const openWebPage = () => {
    // Ensure the electron object is available before using it
    window.electron.send('open-external', 'https://google.com');
  };

  const getRecommendedLayout = async () => {
    const startTime = Date.now();
    // 1st: get (Available app list) & (Currently Open Window List)
    // 2nd: Interact with LangChain to get the recommended layout
    const allWindows = await window.electron.getAllWindowsName();
    console.log(`Runtime: ${(Date.now() - startTime) / 1000} seconds`);
    const answer = await getAnswer(`
      You are a window management assistant.
      Please group the currently open windows according to their relevance for operating specific tasks.
      For each task, plan the layout of each window. If not relevant, please leave a single window alone.
      For example:
        Group Safari, Tabs.do：以任务为中心的浏览器选项卡管理-Joseph Chee Chang and wpsoffice, WPS Office together, for writing a paper draft.
      Currently open windows are as follows: 
        title:
        appName, windowTitle
        items:
        ${allWindows.map((window) => `${window.processName}, ${window.title}`).join('\n')}
      ONLY return the recommended layout for the windows in the format as follows:
        {
          "layout": [
            {
              "task": "task1",
              "windows": [
                {
                  "appName": "app1",
                  "windowTitle": "window1",
                  "windowManagement": "management method1", // e.g. left half, right half, top half, bottom half, whole screen
                  "description": "description1" // e.g. writing, reading, browsing, coding, etc.
                },
              ]
            },
          ]
        }
      DO NOT RETURN ANYTHING ELSE.
      `);
    const endTime = Date.now();
    console.log(answer);

    // Calculate and log the runtime
    const runtime = endTime - startTime;
    console.log(`Runtime: ${runtime / 1000} seconds`);
  };

  const getLayoutBasedOnCommand = async () => {
    const startTime = Date.now();
    const allWindows = await window.electron.getAllWindowsDetail();
    console.log(`Runtime: ${(Date.now() - startTime) / 1000} seconds`);
    const ans = await getAnswer(`
      You are a window management assistant.
      Please filter the currently open windows according to their relevance for operating specific tasks based on User's Command.
      User's Command: ${command}
      Currently open windows are as follows: 
      title:
      appName, windowTitle
      items:
      ${allWindows.map((window) => `${window.processName}, ${window.title}`).join('\n')}
      ONLY return the relevant windows in the format as follows:
      {
        "windows": [
          {
            "appName": "app1",
            "windowTitle": "window1",
          },
        ]
        },
      DO NOT RETURN ANYTHING ELSE.
    `);
    console.log(`Runtime: ${(Date.now() - startTime) / 1000} seconds`);

    const [desc, layout] = await Promise.all([
      // 生成描述的任务
      await getAnswer(`
        You are a window management assistant.
        Give me the description (e.g. writing, reading, browsing, coding, etc.) of each Relevant Window based on User's Command.
        User's Command: ${command}
        Relevant Windows are as follows:
          ${ans}
        ONLY return the description for each window in the format as follows:
        {
          "desc": ["description for window1" , ...]
        }
        DO NOT RETURN ANYTHING ELSE.
      `),
      // 生成布局的任务
      await getAnswer(`
        You are a window management assistant.
        Based on Relevant Windows, plan their layout ONLY based on User's Command and Relevant Windows to execute specific tasks.
        For example:
        Group Safari, Tabs.do：以任务为中心的浏览器选项卡管理-Joseph Chee Chang and wpsoffice, WPS Office together, for writing a paper draft.
        User's Command: ${command}
        Relevant Windows are as follows:
          ${ans}
        ONLY return the recommended layout for the windows in the format as follows:
        {
          "layout":
            {
              "task": "task1",
              "windows": [
                {
                  "windowManagement": "management method1", // e.g. left half, right half, top half, bottom half, whole screen
                },
                {
                  "appName": "app1",
                  "windowTitle": "window1",
                  "windowManagement": "management method2",
                }
              ]
            },
            {
              "task": "task2",
              "windows": [
                {
                  "appName": "app3",
                  "windowTitle": "window3",
                  "windowManagement": "management method3",
                }
              ]
            }
          ]
        }
        DO NOT RETURN ANYTHING ELSE.
      `)
    ]);
    // const answer = await getAnswer(`
    //   You are a window management assistant.
    //   Based on Relevant Windows, plan their layout ONLY based on User's Command and Relevant Windows to execute specific tasks.
    //   For example:
    //   Group Safari, Tabs.do：以任务为中心的浏览器选项卡管理-Joseph Chee Chang and wpsoffice, WPS Office together, for writing a paper draft.
    //   User's Command: ${command}
    //   Relevant Windows are as follows:
    //     ${ans}
    //   ONLY return the recommended layout for the windows in the format as follows:
    //   {
    //     "layout": ["layout for task1", "layout for task2", ...]
    //       {
    //         "task": "task1",
    //         "windows": [
    //           {
    //             "appName": "app1",
    //             "windowTitle": "window1",
    //             "windowManagement": "management method1", // e.g. left half, right half, top half, bottom half, whole screen
    //             "description": "description1" // e.g. writing, reading, browsing, coding, etc.
    //           },
    //           {
    //             "appName": "app1",
    //             "windowTitle": "window1",
    //             "windowManagement": "management method2",
    //             "description": "description2"
    //           }
    //         ]
    //       },
    //       {
    //         "task": "task2",
    //         "windows": [
    //           {
    //             "appName": "app3",
    //             "windowTitle": "window3",
    //             "windowManagement": "management method3",
    //             "description": "description3"
    //           }
    //         ]
    //       }
    //     ]
    //   }
    //   DO NOT RETURN ANYTHING ELSE.
    //   `);
    const endTime = Date.now();
    // console.log(answer);

    console.log(desc, layout);

    // Calculate and log the runtime
    const runtime = endTime - startTime;
    console.log(`Runtime: ${runtime / 1000} seconds`);
  };

  return (
    <React.Fragment>
      <Link to={'/'}>Back to Home</Link>
      <title>Next - Nextron (with-tailwindcss)</title>
      <div className='grid grid-col-1 text-2xl w-full text-center'>
        <div>
          <img className='ml-auto mr-auto' src={logo} alt='Logo image' width='96px' height='96px' />
        </div>
        <span>⚡ Test Page ⚡</span>
      </div>
      <div className='mt-1 w-full flex-wrap flex justify-center'></div>
      <button onClick={handleTestLangchainAPI}>Click to Test Langchain API</button>
      <button onClick={handleTestOpenAiAPI}>Click to Test OpenAI API</button>
      <button onClick={handleOpenDevTools}>Open Dev Tools</button>
      <button onClick={getOpenWindows}>Get Open Windows</button>
      <ul>
        {windows.map((window, index) => (
          <li key={index}>{window.title}</li>
        ))}
      </ul>
      <ul>
        {windows.map((window, index) => (
          <li key={index}>
            <p>{window.processName}</p>
            <p>{window.title}</p>
            <p>{window.position}</p>
            <p>{window.size}</p>
          </li>
        ))}
      </ul>
      <button onClick={getAllWindows}>Get All Windows</button>
      <button onClick={getAllWindowsDetail}>Get All Windows Details</button>
      <button onClick={openWebPage}>Open External Webpage (Google)</button>
      <button onClick={getRecommendedLayout}>Get Recommended Layout</button>
      <button onClick={getLayoutBasedOnCommand}>Get Layout Based On Command</button>
      <input type='text' value={command} onChange={(e) => setCommand(e.target.value)} />
    </React.Fragment>
  );
};

export default Test;
