import { answerLayoutBasedOnCommand } from '@/api/chat';
import { Dispatch, SetStateAction } from 'react';
import type { Layout } from '@/api/chat';

export const getLayoutBasedOnCommand = async (
  command: string,
  setStage: Dispatch<SetStateAction<string>>
): Promise<Layout[]> => {
  setStage('Getting window details...');
  const startTime = Date.now();
  try {
    const temp = await window.electron.getAllWindowsDetail();
    console.log(temp);
    const allWindows = temp.filter(
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
    const runTime1 = (Date.now() - startTime) / 1000;

    setStage('Planning layout...');

    const layouts = await answerLayoutBasedOnCommand(`
      You are a window management assistant.
      Please filter the currently open windows according to their relevance for operating specific tasks based on User's Command.
      Each layout is a list of windows that should be displayed together in a whole screen for a specific task.
      If necessary, please provide at least three ways of layouts even for the same task since different users have their own preference.
      Windows in the same layout should not overlap.
      
      User's Command: ${command}
      Currently open windows are as follows: 
      title:
      appName, windowTitle
      items:
      ${allWindows.map((window) => `${window.processName}, ${window.title}`).join('\n')}
      Example Layouts:
        [{
          "Write my research paper": [
            {
              "appName": "Safari",
              "windowTitle": "XXX (arxiv)",
              "windowManagement": "left half",
              "description": "reference",
            }, 
            {
              "appName": "Microsoft Word",
              "windowTitle": "XXX (paper draft)",
              "windowManagement": "right half",
              "description": "paper writing",
            }
          ]
        }, {
          "Write my research paper": [
            {
              "appName": "Microsoft Word",
              "windowTitle": "XXX (paper draft)",
              "windowManagement": "left half",
              "description": "paper writing",
            },
            {
              "appName": "Safari",
              "windowTitle": "XXX (arxiv)",
              "windowManagement": "right half",
              "description": "reference",
            },
          ]
        }
      ]
    `);
    const runTime2 = (Date.now() - startTime) / 1000;
    setStage('');
    console.log(layouts);
    window.electron.dbQuery('addCommand', [command, layouts, runTime1, runTime2]);
    return layouts;
  } catch (error) {
    console.error('Error in executing layout command:', error);
    setStage('');
    return [];
  }
};
