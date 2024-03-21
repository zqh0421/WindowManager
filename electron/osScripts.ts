// Define the OSScript interface
export interface OSScript {
  appleScript?: string;
  linuxCommand?: string;
  windowsCommand?: string;
}

// Export each script individually
export const getAllWindows = {
  appleScript: `osascript -e 'tell application "System Events" to get the title of every window of every process'`
};

export const getAllWindowsName = {
  appleScript: `
    osascript -e 'tell application "System Events"
    set processList to every process
    set output to ""
    repeat with aProcess in processList
        set theProcessName to name of aProcess
        try
            set theWindows to every window of aProcess
            if theWindows is not {} then
                repeat with aWindow in theWindows
                  set theTitle to title of aWindow
                  set output to output & theProcessName & ", " & theTitle & "\n"
                end repeat
            end if
        on error errMsg
            -- 错误处理，比如记录无窗口的进程或跳过
        end try
    end repeat
    output
    end tell'
  `
};

export const getAllWindowsDetail = {
  appleScript: `
    osascript -e 'tell application "System Events"
    set processList to every process
    set output to ""
    repeat with aProcess in processList
        set theProcessName to name of aProcess
        try
            set theWindows to every window of aProcess
            if theWindows is not {} then
                repeat with aWindow in theWindows
                  set theTitle to title of aWindow
                  set thePosition to position of aWindow
                  set theSize to size of aWindow
                  set output to output & theProcessName & ", " & theTitle & ", " & thePosition & ", " & theSize & "\n"
                end repeat
            end if
        on error errMsg
            -- 错误处理，比如记录无窗口的进程或跳过
        end try
    end repeat
    output
    end tell'
  `
};

export const recordAppActivity = {
  appleScript: `
    osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' -e 'tell application "System Events" to get name of every window of first application process whose frontmost is true'
  `
};

export const getWindowsInDock = {
  appleScript: `
    osascript -e '
    set windowsInDock to {}
    tell application "System Events"
      repeat with thisApp in (get processes) --get applications with 1+ window
        set windowsInDock to windowsInDock & (get windows of thisApp)
      end repeat
    end tell
    return windowsInDock
    '
  `
};

export const getWindowsFrontmost = {
  appleScript: `
  osascript -e '
  tell application "System Events"
    set frontAppName to name of first application process whose frontmost is true
    set frontWindow to first window of (first application process whose frontmost is true)
    set windowTitle to name of frontWindow
    set windowPosition to position of frontWindow
    set windowSize to size of frontWindow
    return {frontAppName, windowTitle, windowPosition, windowSize}
  end tell
  '`
};
