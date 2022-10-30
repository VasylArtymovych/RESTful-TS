import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { CustomError } from '../helpers';
import { config } from '../config';
import { DataStoredInToken } from '../interfaces';

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) {
            throw new CustomError('Authorization header not provided.', 400, 'Provide token');
        }

        if (!req.headers.authorization.startsWith('Bearer')) {
            throw new CustomError('Invalid token type.', 400, 'Provide valid token');
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedData = verify(token, config.token.secret) as DataStoredInToken;

        req.user = decodedData;

        next();
    } catch (error: any) {
        if (error instanceof CustomError) {
            next(error);
        }
        next(new CustomError('Unable to decode token', 400, 'Provide valid token'));
    }
};
