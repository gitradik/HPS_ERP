// src/models/Client.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/databaseService';
import User from './User';

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLACKLIST = 'BLACKLIST',
}

class Client extends Model {
  public id!: number;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public companyName!: string;
  public status!: ClientStatus;
}

Client.init(
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
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Сompany name must be between 0 and 100 characters.',
        },
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ClientStatus)),
      allowNull: false,
      defaultValue: ClientStatus.INACTIVE,
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true,
  },
);

Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Client;
