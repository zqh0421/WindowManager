import { DataTypes } from 'sequelize';
import sequelize from '../index.js';

const Task = sequelize.define('Task', {
  // Define your model attributes here
  TaskName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Tags: {
    type: DataTypes.STRING // Store tags as a comma-separated string
  },
  ScheduledTime: {
    type: DataTypes.DATE // Use the DATE data type
  },
  IsOpen: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  UsedBefore: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

module.exports = Task;
