// src/services/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error('Missing database environment variables');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
