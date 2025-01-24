// uploadRoutes.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import userService from '../services/api/userApiService';

// Настройка директории загрузки файлов
const uploadDir = path.join(__dirname, '../../uploads/images/profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Создаем директорию, если она не существует
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadRouter = express.Router();

// Новый маршрут для загрузки фото
uploadRouter.post('/upload-photo', upload.single('recfile'), async (req, res) => {
  const file = req.file;
  // @ts-ignore
  const userId = req.user.id;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Логика сохранения файла и возврата пути
  const { filename, mimetype } = file;

  // Проверки на валидность данных
  if (!filename || !mimetype) {
    return res.status(400).json({ error: 'File upload failed: invalid file data' });
  }

  const user = await userService.updateUser(userId, { photo: filename });
  // Возвращаем путь к файлу
  res.json({
    success: true,
    filePath: `/uploads/images/profile/${filename}`,
    filename,
    mimetype,
    user,
  });
});

// Новый маршрут для загрузки фото конкретного пользователя
uploadRouter.post('/upload-photo/:id', upload.single('recfile'), async (req, res) => {
  const file = req.file;
  const userId = Number(req.params.id); // Извлекаем ID из параметров маршрута

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Логика сохранения файла и возврата пути
  const { filename, mimetype } = file;

  // Проверки на валидность данных
  if (!filename || !mimetype) {
    return res.status(400).json({ error: 'File upload failed: invalid file data' });
  }

  try {
    // Обновляем данные пользователя
    const user = await userService.updateUser(userId, { photo: filename });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Возвращаем путь к файлу
    res.json({
      success: true,
      filePath: `/uploads/images/profile/${filename}`,
      filename,
      mimetype,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the user photo' });
  }
});

export default uploadRouter;
