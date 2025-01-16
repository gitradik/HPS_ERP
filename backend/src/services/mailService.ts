import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Чтение client secret JSON
const credentialsPath = path.join(__dirname, '../../config', 'client_secret_241990712023-ut0199i4vdtiieh8u638vmud5bjs7gf0.apps.googleusercontent.com.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Путь к файлу с токенами
const tokenPath = path.join(__dirname, '../../config', 'token.json');

// Настройки OAuth2
const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Функция для обновления токенов
const refreshAccessToken = async () => {
    let tokenData: any;

    // Проверяем, если файл с токеном существует
    try {
        tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    } catch (error) {
        console.log('Token file not found. Please authorize the app first.');
        return null;
    }

    // Устанавливаем refresh token и обновляем access token
    oAuth2Client.setCredentials(tokenData);

    try {
        // Обновляем токен
        const { credentials } = await oAuth2Client.refreshAccessToken();
        fs.writeFileSync(tokenPath, JSON.stringify(credentials));
        console.log('Access token refreshed successfully');
        return credentials;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
};

// Функция для отправки email с использованием OAuth2
const sendEmail = async (toEmail: string, subject: string, text: string) => {
    let tokenData: any;

    // Проверяем, если файл с токеном существует
    try {
        tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    } catch (error) {
        console.log('Token file not found. Please authorize the app first.');
        return;
    }

    // Если токен истек, обновляем его
    if (Date.now() > tokenData.expiry_date) {
        console.log('Token expired, refreshing...');
        tokenData = await refreshAccessToken();
        if (!tokenData) {
            return;
        }
    }

    console.log(">>>>>>>>>>>>>>>>>> ")
    // Устанавливаем токен в oAuth2Client
    oAuth2Client.setCredentials(tokenData);
    console.log(">>>>>>>>>>>>>>>>>> 1")

    // Настройка транспортера для отправки email через Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER, // Ваш Gmail
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: tokenData.refresh_token,
            accessToken: tokenData.access_token,
        },
    });
    console.log(">>>>>>>>>>>>>>>>>> 2")

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        text: text,
    };

    console.log(">>>>>>>>>>>>>>>>>> 3")

    // Отправка письма
    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

export { sendEmail };
