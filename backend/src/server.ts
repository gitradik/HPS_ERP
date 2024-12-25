import express, { Application } from 'express';
import dotenv from 'dotenv';
import './config/db_connect';
// import userRoutes from './routes/userRoutes';

// Загрузка переменных окружения
dotenv.config();

const PORT = process.env.PORT || 3000;

// Создание Express-приложения
const app: Application = express();

// Middleware
app.use(express.json());

// Routes
// app.use('/api/users', userRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
