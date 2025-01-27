import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/databaseService';
import Staff from './Staff';
import Client from './Client';

class Schedule extends Model {
  public id!: number;
  public title!: string;
  public allDay!: boolean;
  public start!: Date;
  public end!: Date;
  public color!: string;
  public staffId!: number;
  public clientId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public staff?: Staff;
  public client?: Staff;
}

Schedule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allDay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default',
    },
    staffId: {
      type: DataTypes.INTEGER,
      references: {
        model: Staff,
        key: 'id',
      },
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      references: {
        model: Client,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'schedules',
    timestamps: true,
  },
);

Schedule.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });
Schedule.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

export default Schedule;
