'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  async up(queryInterface, Sequelize) {
    // Получаем текущую дату для использования в создании записей
    const currentDate = new Date();

    // Добавление ролей
    const roles = await queryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'Super Admin',
          permissions: JSON.stringify({ manage_all: true }),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          name: 'Admin',
          permissions: JSON.stringify({
            manage_all: false,
            manage_users: true,
            view_reports: true,
          }),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        {
          name: 'Employee',
          permissions: JSON.stringify({ manage_all: false }),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ],
      { returning: true } // Возвращаем данные для использования
    );

    // Найдем роль "Super Admin"
    const superAdminRole = roles.find((role) => role.name === 'Super Admin');

    const hashedPassword = await bcrypt.hash('admin', saltRounds); // Замените на реальный пароль

    // Добавление пользователя с ролью Super Admin
    await queryInterface.bulkInsert('users', [
      {
        name: 'Hermann Baun',
        email: 'info@info.com',
        password: hashedPassword, // Замените на реальный хеш
        roleId: superAdminRole.id,
        position: 'Geschäftsführung', // Указываем должность
        'created_at': currentDate, // Указываем createdAt и updatedAt
        'updated_at': currentDate,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Удаление пользователя и ролей
    await queryInterface.bulkDelete('users', { email: 'info@info.com' }, {});
    await queryInterface.bulkDelete('roles', null, {});
  },
};
