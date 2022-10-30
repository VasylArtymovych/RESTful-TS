import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthServices } from '../services';
import { DataStoredInToken } from '../interfaces';

class AuthController {
    register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = await AuthServices.register(req.body);

        res.status(201).json({ code: 201, status: 'success', user });
    });

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const token = await AuthServices.login(req.body);

        res.status(200).json({ code: 200, stutus: 'success', token });
    });

    logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { _id } = req.user as DataStoredInToken;

        await AuthServices.logout(_id);

        res.status(200).json({ code: 200, stutus: 'success', message: 'Logout success.' });
    });

    info = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});
}
export default new AuthController();
