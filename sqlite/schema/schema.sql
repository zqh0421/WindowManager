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
  SelectionID INTEGER PRIMARY KEY AUTOINCREMENT,
  -- UserID TEXT NOT NULL,
  LayoutID INTEGER,
  Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- FOREIGN KEY (UserID) REFERENCES User(UserID),
  FOREIGN KEY (LayoutID) REFERENCES Layout(LayoutID)
);

-- Create the Command History table
CREATE TABLE IF NOT EXISTS CommandHistory (
  CommandID INTEGER PRIMARY KEY AUTOINCREMENT,
  -- UserID TEXT NOT NULL,
  CommandText TEXT NOT NULL,
  ExecutionTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  IsSatisfied INTEGER
  -- FOREIGN KEY(UserID) REFERENCES User(UserID)
);

-- Create the App Activity table
CREATE TABLE IF NOT EXISTS AppActivity (
  UsageID INTEGER PRIMARY KEY AUTOINCREMENT,
  -- UserID TEXT NOT NULL,
  AppName TEXT NOT NULL,
  WindowTitle TEXT NOT NULL,
  WindowSize TEXT NOT NULL, -- 'width, height'
  WindowPosition TEXT NOT NULL, -- 'x, y'
  RecordedTime INTEGER NOT NULL -- 可以存储为秒数
  -- FOREIGN KEY(UserID) REFERENCES User(UserID)
);

-- Create the Layout table
CREATE TABLE IF NOT EXISTS Layout (
  LayoutID INTEGER PRIMARY KEY AUTOINCREMENT,
  LayoutType TEXT NOT NULL,
  Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the Layout Detail table
CREATE TABLE IF NOT EXISTS LayoutDetail (
  DetailID INTEGER PRIMARY KEY AUTOINCREMENT,
  LayoutID INTEGER,
  Position TEXT NOT NULL,
  AppName TEXT NOT NULL,
  AppPath TEXT NOT NULL,
  WindowName TEXT NOT NULL,
  Size TEXT NOT NULL,
  FOREIGN KEY(LayoutID) REFERENCES Layout(LayoutID)
);