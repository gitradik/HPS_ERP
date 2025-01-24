import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import combinedSchema from './schemas';
import resolvers from './resolvers';
import { sequelize } from './models';
import { normalizeEmailMiddleware } from './middlewares/normalizeEmailMiddleware';
import * as uploadUserRoutes from './routes/uploadUserRoutes';
import { authMiddlewareExpress } from './middlewares/authMiddleware';

dotenv.config();

const app = express();

// if (process.env.NODE_ENV === 'development') {
//   // CORS
//   const allowedOrigins = [
//     'https://herba-solution.com',
//     'http://herba-solution.com',
//     'http://localhost:5173',
//   ];
  
//   const corsOptions = {
//     origin: allowedOrigins,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders: [
//       'Accept-Version',
//       'Authorization',
//       'Credentials',
//       'Content-Type',
//       'X-Requested-With',
//     ],
//   };
  
//   app.use(cors(corsOptions));
//   app.options('*', cors(corsOptions));
// }
const corsOptions = {
  origin: 'http://herba-solution.com', // Укажите точное значение для разрешенного домена
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));


// Apollo Server
const server = new ApolloServer({
  typeDefs: combinedSchema,
  resolvers,
  context: ({ req }: any) => ({
    req,
    user: req.user,
  }),
  plugins: [normalizeEmailMiddleware],
  formatError: (error) => {
    console.error(error);
    return error;
  },
});

app.use('/user', authMiddlewareExpress, uploadUserRoutes.default);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Запуск сервера
const PORT = process.env.PORT;
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    await server.start();
    // @ts-ignore
    server.applyMiddleware({ app, cors: corsOptions });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
