-- Create the User table
-- CREATE TABLE IF NOT EXISTS User (
--   userId TEXT PRIMARY KEY,
--   username TEXT NOT NULL,
--   Email TEXT NOT NULL,
--   RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
--   IsVip INTEGER DEFAULT 0,
--   VipTimeLimit DATETIME,
--   taskLimit INTEGER DEFAULT 5,
-- );

CREATE TABLE IF NOT EXISTS Shortcuts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  combination TEXT UNIQUE,  -- 'Ctrl+Shift+A',
  globe TEXT NOT NULL,  -- 'Global', 'In App'
  type TEXT NOT NULL, -- 'Application', 'Website', 'File', 'Opening Window', 'Layout', 'Operation'
  applicationName TEXT,
  websiteUrl TEXT,
  filePath TEXT,
  windowId INTEGER,
  operationType TEXT,
  initialTime DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS AppActivity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  appName TEXT NOT NULL,
  windowTitle TEXT NOT NULL,
  windowPath TEXT,
  initialTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  latestTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  windowPosition TEXT NOT NULL, -- 'x, y'
  windowSize TEXT NOT NULL -- 'width, height'
  -- userId TEXT NOT NULL,
  -- FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS LayoutWindow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  appName TEXT NOT NULL,
  windowTitle TEXT,
  layoutId INTEGER NOT NULL,
  description TEXT,
  windowPath TEXT,
  initialTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  latestTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (layoutId) REFERENCES Layout(layoutId) ON DELETE CASCADE
);


-- 创建 Layouts 表
CREATE TABLE IF NOT EXISTS Layout (
  layoutId INTEGER PRIMARY KEY AUTOINCREMENT,
  taskId INTEGER,
  commandId INTEGER,
  layoutType TEXT NOT NULL, -- 'Left Half + Right Half', 'Top Half + Bottom Half', 'Left Third + Middle Third + Right Third', 'Top Third + Middle Third + Bottom Third', 'Left Two Third + Right Third', 'Top Two Third + Bottom Third', 'Full Screen'
  description TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  isSelected INTEGER DEFAULT 0,  -- 0表示未选择，1表示已选择
  FOREIGN KEY (taskId) REFERENCES Task(id),
  FOREIGN KEY (commandId) REFERENCES CommandHistory(id)
);

-- Create the Task table
CREATE TABLE IF NOT EXISTS Task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- userId TEXT NOT NULL,
  taskName TEXT NOT NULL,
  taskDescription TEXT,
  taskType TEXT NOT NULL, -- 'Productivity', 'Entertainment', 'Learning', 'Others'
  taskStatus TEXT NOT NULL, -- 'In Progress', 'Completed', 'Abandoned'
  taskPriority TEXT NOT NULL, -- 'High', 'Medium', 'Low', 'None'
  taskDeadline DATETIME,
  lastExecutionTime DATETIME,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  completeTime DATETIME, -- NULL表示未完成
  isSatisfied INTEGER DEFAULT -1 -- -1表示未采集，0表示未满意，1表示满意
  -- FOREIGN KEY(userId) REFERENCES User(userId)
);

-- Create the CommandHistory table
CREATE TABLE IF NOT EXISTS CommandHistory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  command TEXT NOT NULL,
  commandTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  midTime number, -- 任务执行的中间时间
  totalTime number, -- 任务执行的总时间
  isSatisfied INTEGER DEFAULT -1 -- -1表示未采集，0表示未满意，1表示满意
);

-- Insert some sample data into Task table
INSERT INTO Task (taskName, taskType, taskStatus, taskPriority)
SELECT 'Coding', 'Productivity', 'In Progress', 'High'
WHERE NOT EXISTS (SELECT * FROM Task)
UNION ALL
SELECT 'Data Analysis', 'Productivity', 'In Progress', 'Low'
WHERE NOT EXISTS (SELECT * FROM Task)
UNION ALL
SELECT 'Browsing', 'Browsing', 'In Progress', 'Medium'
WHERE NOT EXISTS (SELECT * FROM Task)
UNION ALL
SELECT 'Entertaining, surfing the Internet', 'Entertainment', 'In Progress', 'Medium'
WHERE NOT EXISTS (SELECT * FROM Task);

INSERT OR IGNORE INTO Shortcuts (combination, globe, type, applicationName, websiteUrl)
SELECT 'Option+S+G', 'In-app', 'Website', 'Safari', 'https://www.google.com'
UNION ALL
SELECT 'Option+S+Y', 'In-app', 'Website', 'Safari', 'https://www.youtube.com'
UNION ALL
SELECT 'Option+S+B', 'In-app', 'Website', 'Safari', 'https://www.bing.com';

INSERT OR IGNORE INTO Shortcuts (combination, globe, type, applicationName)
SELECT 'Ctrl+Option+S', 'Global', 'Application', 'Safari'
UNION ALL
SELECT 'Ctrl+Option+C', 'Global', 'Application', 'Visual Studio Code'
UNION ALL
SELECT 'Ctrl+Option+W', 'Global', 'Application', 'WeChat';

INSERT OR IGNORE INTO Shortcuts (combination, globe, type, operationType)
SELECT 'Ctrl+Option+Left', 'Global', 'Operation', 'Left Half'
UNION ALL
SELECT 'Ctrl+Option+Right', 'Global', 'Operation', 'Right Half'
UNION ALL
SELECT 'Ctrl+Option+Left+Right', 'Global', 'Operation', 'Full Screen';