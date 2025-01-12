// server.ts
import { ApolloServer } from "apollo-server-express";
import express from "express";
import combinedSchema from "./schemas";
import resolvers from "./resolvers";
import { sequelize } from "./models";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = new ApolloServer({
    typeDefs: combinedSchema,
    resolvers,
    context: ({ req }: any) => {
      // Attach the request object to the context
      return {
        req,  // Pass the express `req` object to the context for access in resolvers and middlewares
        user: req.user, // You can also add other things to context, like `user` if it's authenticated
      };
    },
  });

const PORT = process.env.PORT || 4000;


async function startServer() {
    try {
        // Подключение к базе данных
        await sequelize.authenticate();
        console.log(
            "Connection to the database has been established successfully."
        );

        // Синхронизация моделей с базой данных
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");

        // Запуск Apollo сервера
        await server.start();
        // @ts-ignore
        server.applyMiddleware({ app });

        // Запуск приложения
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/graphql`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();
