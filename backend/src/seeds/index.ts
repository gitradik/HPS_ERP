import sequelize from '../services/databaseService'; // Замените на ваш путь к настройке базы данных
import { userSeed, userSeed2 } from './userSeed'; // Импортируйте сиды, которые нужно выполнить

const runSeeds = async () => {
  console.log('Starting seed execution...');

  try {
    await sequelize.authenticate();
    console.log('Database connected');

    console.log('Running seed: User');
    await userSeed();
    await userSeed2();

    console.log('All seeds executed successfully');
  } catch (error) {
    console.error('Seed execution failed:', error);
  } finally {
    // Закрытие подключения к базе данных
    await sequelize.close();
    console.log('Database connection closed');
  }
};

runSeeds();
