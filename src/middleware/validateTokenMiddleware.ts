import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { CustomError } from '../helpers/customError';
import { config } from '../config/config';
import Logging from '../library/Logging';
import { DataStoredInToken } from '../interfaces';

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    try {
        if (!req.headers.authorization) {
            throw new CustomError('Authorization header not provided.', 400, 'Provide token');
        }

        if (!req.headers.authorization.startsWith('Bearer')) {
            throw new CustomError('Invalid token type.', 400, 'Provide valid token');
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedData = verify(token, config.token.secret) as DataStoredInToken;
        Logging.log(decodedData);
        // req.token = decodedData;

        next();
    } catch (error: any) {
        next(error);
    }
};
