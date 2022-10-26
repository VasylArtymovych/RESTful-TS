import { Request, Response, NextFunction } from 'express';
import Logging from '../library/Logging';
import { CustomError } from './customError';

export const unknownRoute = (req: Request, res: Response, next: NextFunction) => {
    const customError = new CustomError('Not Found');
    Logging.error(customError);

    res.status(404).json({ message: (customError as CustomError).message });
};

export const errorHandler = (error: TypeError | CustomError, req: Request, res: Response, next: NextFunction) => {
    let customError = error;

    if (!(error instanceof CustomError)) {
        customError = new CustomError('Something went wrong, try again later');
    }
    Logging.error(customError);

    res.status((customError as CustomError).status).json({ error: (customError as CustomError).message, message: (customError as CustomError).additionalInfo });
};
