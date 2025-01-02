'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Связь Role -> User (1 ко многим)
      Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
    }
  }

  // Определение модели
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Обязательное поле
        unique: true, // Значение должно быть уникальным
        validate: {
          notEmpty: true, // Проверка на пустую строку
        },
      },
      permissions: {
        type: DataTypes.JSONB, // Хранение прав в формате JSON
        allowNull: false, // Обязательное поле
        defaultValue: {}, // По умолчанию пустой объект
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at', // Используем snake_case для поля
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at', // Используем snake_case для поля
      },
    },
    {
      sequelize, // Объект подключения Sequelize
      modelName: 'Role', // Имя модели
      tableName: 'roles', // Имя таблицы в базе данных
      timestamps: true, // Автоматическое добавление createdAt и updatedAt
      underscored: true, // Использование snake_case для названий колонок
    }
  );

  return Role;
};
