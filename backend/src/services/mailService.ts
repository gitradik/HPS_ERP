import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Функция для отправки email с использованием OAuth2
const sendEmail = async (toEmail: string, subject: string, text: string) => {
  // Настройка транспортера для отправки email через Gmail
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SMTP_SERVICE,
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SMTP_USER,
    to: toEmail,
    subject: subject,
    text: text,
  };

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
