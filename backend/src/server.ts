// server.ts
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors"; // Импортируем cors
import path from "path";
import fs from 'fs';
import { google } from 'googleapis';
import combinedSchema from "./schemas";
import resolvers from "./resolvers";
import { sequelize } from "./models";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Настраиваем CORS
const allowedOrigins = [
    "http://herba-solution.com",
    "https://herba-solution.com",
    /^http:\/\/localhost:\d+$/
];
app.use(
    cors({
        origin: allowedOrigins, // Разрешённые домены
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Разрешённые методы
        credentials: true, // Разрешить использование cookies
    })
);

// // Чтение client secret JSON
// const credentialsPath = path.join(__dirname, '../config', 'client_secret_241990712023-ut0199i4vdtiieh8u638vmud5bjs7gf0.apps.googleusercontent.com.json');
// const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
// const { client_id, client_secret, redirect_uris } = credentials.web;

// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',  // Чтобы получить refresh token
//     scope: ['https://www.googleapis.com/auth/gmail.send'],  // Доступ к Gmail
// });
// console.log('Authorize this app by visiting this url:', authUrl);
// // Эндпоинт для обработки кода авторизации
// app.get('/auth/callback', async (req, res) => {
//     const code = req.query.code as string;

//     console.log('/auth/callback', code)

//     if (!code) {
//         return res.status(400).send('No code provided');
//     }

//     try {
//         // Обменяем код на токены
//         const { tokens } = await oAuth2Client.getToken(code);
//         oAuth2Client.setCredentials(tokens);
//         // Сохраняем токены в файл для последующего использования
//         fs.writeFileSync('token.json', JSON.stringify(tokens));

//         res.send('Authorization successful! Tokens saved.');
//     } catch (error) {
//         // @ts-ignore
//         res.status(500).send('Error exchanging code for tokens: ' + error.message);
//     }
// });

const server = new ApolloServer({
    typeDefs: combinedSchema,
    resolvers,
    context: ({ req }: any) => {
        // Attach the request object to the context
        return {
            req, // Pass the express `req` object to the context for access in resolvers and middlewares
            user: req.user, // You can also add other things to context, like `user` if it's authenticated
        };
    },
});

const PORT = process.env.PORT;

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
