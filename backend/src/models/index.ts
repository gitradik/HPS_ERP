import sequelize from '../services/databaseService';
import User from './User';
import Client from './Client';
import Employee from './Employee';
import RefreshToken from './RefreshToken';
import Staff from './Staff';
import Schedule from './Schedule';
import ScheduleOvertime from './ScheduleOvertime';

ScheduleOvertime.belongsTo(Schedule, { foreignKey: 'scheduleId', as: 'schedule' });

const models = {
  User,
  Client,
  Employee,
  RefreshToken,
  Staff,
  Schedule,
  ScheduleOvertime,
};

export { sequelize, models };
