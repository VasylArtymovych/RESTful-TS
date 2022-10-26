import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { config } from '../config/config';
import { CustomError } from '../helpers/customError';
import UserModel from '../models/UserModel';
import { IJoiUser } from '../interfaces/JoiUser';
import { TokenData, DataStoredInToken, RequestWithToken } from '../interfaces';

class AuthController {
    register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { userEmail, userPassword } = req.body as IJoiUser;
        if (!userEmail || !userPassword) {
            throw new CustomError('Email and Password are required', 400, 'Please provide them.');
        }

        const candidate = await UserModel.findOne({ userEmail });
        if (candidate) {
            throw new CustomError('User already exist.', 400, 'Please Login.');
        }

        const hashPassword = bcrypt.hashSync(userPassword, 10);
        if (!hashPassword) {
            throw new CustomError('Unable to hash password.');
        }

        const user = await UserModel.create({ ...req.body, userPassword: hashPassword });
        if (!user) {
            throw new CustomError('Unable to save User in DB.');
        }

        user.userPassword = '';
        res.status(201).json({ code: 201, status: 'success', user });
    });

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { userEmail, userPassword } = req.body;
        if (!userEmail || !userPassword) {
            throw new CustomError('Email and Password are required', 400, 'Please provide them.');
        }

        const user = await UserModel.findOne({ userEmail });
        if (!user) {
            throw new CustomError(`User with email: ${userEmail} not found.`, 400, 'Check your email and try again.');
        }
        const comparePass = bcrypt.compareSync(userPassword, user.userPassword);
        if (!comparePass) {
            throw new CustomError(`Invalid password.`, 400, 'Provide valid password.');
        }

        const { token } = this.generateToken(user._id);
        user.token = token;
        await user.save();
        if (!user.token) {
            throw new CustomError(`Unable to save token.`, 400, 'Token has not been saved.');
        }

        res.status(200).json({ code: 200, stutus: 'success', token });
    });

    logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});

    info = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});

    generateToken = (_id: string): TokenData => {
        const payload: DataStoredInToken = { _id };
        const expiresIn = 60 * 60;
        return {
            expiresIn,
            token: sign(payload, config.token.secret, { expiresIn })
        };
    };
}
export default new AuthController();
