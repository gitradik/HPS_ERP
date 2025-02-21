import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/databaseService';
import Schedule from './Schedule';

export enum OvertimeType {
  HOLIDAY = 'HOLIDAY',
  WEEKEND = 'WEEKEND',
  OVERTIME = 'OVERTIME',
}

class ScheduleOvertime extends Model {
  public id!: number;
  public scheduleId!: number;
  public date!: Date;
  public hours!: number;
  public type!: OvertimeType;
  public createdAt!: Date;
  public updatedAt!: Date;
  public schedule?: Schedule;
}

ScheduleOvertime.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Schedule,
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(OvertimeType)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'schedule_overtimes',
    timestamps: true,
  },
);

export default ScheduleOvertime;
