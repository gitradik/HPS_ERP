// src/models/Employee.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/databaseService';
import User from './User';

class Employee extends Model {
  public id!: number;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'employees',
    timestamps: true,
  },
);

Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Employee;
