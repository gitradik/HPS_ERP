// src/models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/databaseService';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
  USER = 'USER',
}

class User extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email?: string;
  public phoneNumber?: string;
  public password!: string;
  public role!: UserRole;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public position?: string;
  public contactDetails?: string;
  public photo?: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name cannot be empty.',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name cannot be empty.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address.',
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        is: {
          args: /^\+\d{10,15}$/, // Регулярное выражение для номера телефона
          msg: 'Phone number must be in the format +1234567890.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty.',
        },
      },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Position must be between 0 and 100 characters.',
        },
      },
    },
    contactDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  },
);

export default User;
