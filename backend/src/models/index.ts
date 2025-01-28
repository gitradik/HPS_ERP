import sequelize from '../services/databaseService';
import User from './User';
import Client from './Client';
import Employee from './Employee';
import RefreshToken from './RefreshToken';
import Staff from './Staff';
import Schedule from './Schedule';

const models = {
  User,
  Client,
  Employee,
  RefreshToken,
  Staff,
  Schedule,
};

export { sequelize, models };
