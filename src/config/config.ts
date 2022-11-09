import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@db.rezcmsh.mongodb.net`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1717;
const NODE_ENV = process.env.NODE_ENV || 'production';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';

const transporterOptions = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVICE_LOGIN, // generated ethereal user
        pass: process.env.EMAIL_SERVICE_PASS // generated ethereal password
    }
};

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT,
        env: NODE_ENV
    },
    token: {
        secret: JWT_SECRET_KEY
    },

    nodemailer: {
        transporterOptions
    }
};
