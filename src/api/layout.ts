import { answerLayoutBasedOnCommand } from '@/api/chat';
import { Dispatch, SetStateAction } from 'react';

export const getLayoutBasedOnCommand = async (
  command: string,
  setStage: Dispatch<SetStateAction<string>>
) => {
  setStage('Getting window details...');
  const startTime = Date.now();
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
  console.log(`Runtime: ${(Date.now() - startTime) / 1000} seconds`);

  setStage('Planning layout...');
  const answer = await answerLayoutBasedOnCommand(`
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
  const endTime = Date.now();
  setStage('');
  console.log(answer);

  // Calculate and log the runtime
  const runtime = endTime - startTime;
  console.log(`Runtime: ${runtime / 1000} seconds`);
  return answer;
};
