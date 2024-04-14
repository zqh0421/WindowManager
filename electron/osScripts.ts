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
      set aProcessName to name of aProcess
      try
          set windowList to every window of aProcess
          if windowList is not {} then
              repeat with aWindow in windowList
                set aWindowTitle to title of aWindow
                set theSize to size of aWindow
                set windowInfo to (theProcessName & ", " & theTitle & ", " & {"Position: ", thePosition, "Size: ", theSize} as string)
                log windowInfo -- 打印诊断信息
                set output to output & windowInfo & "\n"
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
    set aProcessName to name of aProcess
    try
      set windowList to every window of aProcess
      if windowList is not {} then
        try
          -- set windowId to 1 -- 初始化窗口编号
          repeat with aWindow in windowList
            set aWindowTitle to title of aWindow
            set aWindowPosition to position of aWindow
            set aWindowSize to size of aWindow
            set output to output & aProcessName & ", " & aWindowTitle & ", " & aWindowPosition & ", " & aWindowSize & "\n"
            -- set windowId to windowId + 1 -- 更新窗口编号
          end repeat
          on error errMsg
            -- 错误处理，比如记录无窗口的进程或跳过
        end try
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
    osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true'
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
