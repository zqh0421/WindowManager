import { exec } from 'child_process';

// macOS AppleScript 示例
const script = `
tell application "System Events"
    set listOfProcesses to (name of every process where background only is false)
end tell
return listOfProcesses
`;

exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  if (stderr) {
    console.log(`stderr: ${stderr}`);
  }
});
