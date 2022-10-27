import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import { unknownRoute, errorHandler } from './helpers';
import Logging from './library/Logging';
import { AuthRouter, RolesRouter, UserRouter } from './routes';

const app = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { dbName: 'db_auth', retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to mongoDB');
        StartServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect');
        Logging.error(error);
    });

/** Only start the server if Mongo connects */
const StartServer = () => {
    app.use((req, res, next) => {
        /** Log the Requset */
        Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the Response */
            Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static('src/public'));

    /** Rules of our API */
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
    app.use('/api/auth', AuthRouter);
    app.use('/api/roles', RolesRouter);
    app.use('/api/user', UserRouter);

    /** Error handling */
    app.use(unknownRoute);
    app.use(errorHandler);

    http.createServer(app).listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
