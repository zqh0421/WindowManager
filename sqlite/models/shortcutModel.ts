import db from '../db';
export async function getAllGlobalShortcuts() {
  const getAllGlobalShortcuts = db.prepare(`
    SELECT * FROM Shortcuts WHERE globe = 'Global'
  `);
  try {
    const shortcuts = getAllGlobalShortcuts.all();
    return shortcuts;
  } catch (error) {
    console.error(`Error getting all global shortcuts: ${error}`);
    throw error;
  }
}

export async function getAllInAppShortcuts() {
  const getAllInAppShortcuts = db.prepare(`
    SELECT * FROM Shortcuts WHERE globe = 'In-app'
  `);
  try {
    const shortcuts = getAllInAppShortcuts.all();
    return shortcuts;
  } catch (error) {
    console.error(`Error getting all in-app shortcuts: ${error}`);
    throw error;
  }
}

export async function getAllShortcuts() {
  const getAllShortcuts = db.prepare(`
    SELECT * FROM Shortcuts
  `);
  try {
    const shortcuts = getAllShortcuts.all();
    return shortcuts;
  } catch (error) {
    console.error(`Error getting all shortcuts: ${error}`);
    throw error;
  }
}

type AddShorcutProps = {
  combination: string;
  globe: 'Global' | 'In-app';
  type: string;
  applicationName?: string;
  websiteUrl?: string;
  filePath?: string;
  windowId?: number;
  operationType?: string;
};

export async function addShortcut({
  combination,
  globe,
  type,
  applicationName,
  websiteUrl,
  filePath,
  operationType
}: AddShorcutProps) {
  let addShortcut;
  let result = null;
  switch (type) {
    case 'Application':
      if (!applicationName) {
        throw new Error('Application name is required for application shortcuts');
      }
      addShortcut = db.prepare(`
        INSERT INTO Shortcut (combination, globe, type, applicationName) VALUES (?, ?, ?, ?)
      `);
      result = addShortcut.run(combination, globe, type, applicationName);
      break;
    case 'Website':
      if (!websiteUrl) {
        throw new Error('Website URL is required for website shortcuts');
      }
      addShortcut = db.prepare(`
        INSERT INTO Shortcut (combination, globe, type, websiteUrl) VALUES (?, ?, ?, ?)
      `);
      result = addShortcut.run(combination, globe, type, websiteUrl);
      break;
    case 'File':
      if (!filePath || !applicationName) {
        throw new Error('File path is required for file shortcuts');
      }
      addShortcut = db.prepare(`
        INSERT INTO Shortcut (combination, globe, type, applicationName, filePath) VALUES (?, ?, ?, ?, ?)
      `);
      result = addShortcut.run(combination, globe, type, filePath);
      break;
    case 'Operation':
      if (!operationType) {
        throw new Error('Operation type is required for operation shortcuts');
      }
      addShortcut = db.prepare(`
        INSERT INTO Shortcut (combination, globe, type, operationType) VALUES (?, ?, ?, ?)
      `);
      result = addShortcut.run(combination, globe, type, operationType);
      break;
    default:
      throw new Error('Invalid shortcut type');
  }
  return result?.lastInsertRowid;
}

export async function deleteShortcut(id: number) {
  const deleteShortcut = db.prepare(`
    DELETE FROM Shortcut WHERE id = ?
  `);
  try {
    const info = deleteShortcut.run(id);
    console.log(`Deleted Shortcuts with ID: ${id}`);
    return info.changes;
  } catch (error) {
    console.error(`Error deleting shortcut: ${error}`);
    throw error;
  }
}
