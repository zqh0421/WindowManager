-- Create the User table
-- CREATE TABLE IF NOT EXISTS User (
--   UserID TEXT PRIMARY KEY,
--   Username TEXT NOT NULL,
--   Email TEXT NOT NULL,
--   RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
--   IsVip INTEGER DEFAULT 0,
--   VipTimeLimit DATETIME,
--   taskLimit INTEGER DEFAULT 5,
-- );

-- Create the Layout Selection History table
CREATE TABLE IF NOT EXISTS LayoutSelectionHistory (
  selectionID INTEGER PRIMARY KEY AUTOINCREMENT,
  -- userID TEXT NOT NULL,
  layoutID INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- FOREIGN KEY (userID) REFERENCES User(UserID),
  FOREIGN KEY (layoutID) REFERENCES Layout(layoutID)
);

-- Create the Command History table
CREATE TABLE IF NOT EXISTS CommandHistory (
  commandID INTEGER PRIMARY KEY AUTOINCREMENT,
  -- userID TEXT NOT NULL,
  commandText TEXT NOT NULL,
  executionTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  isSatisfied INTEGER
  -- FOREIGN KEY(userID) REFERENCES User(userID)
);

-- Create the App Activity table
CREATE TABLE IF NOT EXISTS AppActivity (
  usageID INTEGER PRIMARY KEY AUTOINCREMENT,
  -- userID TEXT NOT NULL,
  appName TEXT NOT NULL,
  windowTitle TEXT NOT NULL,
  windowSize TEXT NOT NULL, -- 'width, height'
  windowPosition TEXT NOT NULL, -- 'x, y'
  recordedTime INTEGER NOT NULL -- 可以存储为秒数
  -- FOREIGN KEY(userID) REFERENCES User(userID)
);

-- Create the Layout table
-- CREATE TABLE IF NOT EXISTS Layout (
--   layoutID INTEGER PRIMARY KEY AUTOINCREMENT,
--   layoutType TEXT NOT NULL,
--   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- Create the Layout Detail table
-- CREATE TABLE IF NOT EXISTS LayoutDetail (
--   detailID INTEGER PRIMARY KEY AUTOINCREMENT,
--   layoutID INTEGER,
--   position TEXT NOT NULL,
--   appName TEXT NOT NULL,
--   appPath TEXT NOT NULL,
--   windowName TEXT NOT NULL,
--   size TEXT NOT NULL,
--   FOREIGN KEY(layoutID) REFERENCES Layout(layoutID)
-- );

-- Create the Task table
CREATE TABLE IF NOT EXISTS Task (
  taskID INTEGER PRIMARY KEY AUTOINCREMENT,
  -- userID TEXT NOT NULL,
  taskName TEXT NOT NULL,
  taskDescription TEXT,
  taskType TEXT NOT NULL,
  taskStatus TEXT NOT NULL,
  taskPriority TEXT NOT NULL,
  taskDeadline DATETIME,
  taskCreationTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  taskCompletionTime DATETIME,
  taskCompletionDescription TEXT,
  taskCompletionStatus TEXT,
  taskCompletionRating INTEGER,
  taskCompletionFeedback TEXT
  -- FOREIGN KEY(userID) REFERENCES User(userID)
);

