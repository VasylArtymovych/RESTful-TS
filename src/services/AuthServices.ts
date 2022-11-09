import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserModel } from '../models';
import { CustomError } from '../helpers';
import { IAuthData, TokenData, DataStoredInToken } from '../interfaces';
import { config } from '../config';

class AuthServices {
    register = async (body: IAuthData) => {
        const { userEmail, userPassword } = body as IAuthData;

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

        const user = await UserModel.create({ ...body, userPassword: hashPassword, roles: ['USER'] });
        if (!user) {
            throw new CustomError('Unable to save User in DB.');
        }

        user.userPassword = '';
        return user;
    };

    login = async (body: IAuthData) => {
        const { userEmail, userPassword } = body as IAuthData;

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
            throw new CustomError(`Unable to save token.`);
        }

        return token;
    };

    logout = async (id: string) => {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new CustomError(`Unable to logout.`, 400, 'Please try again.');
        }
        user.token = null;
        await user.save();

        if (user.token) {
            throw new CustomError(`Unable to update token in DB.`);
        }
        return true;
    };

    generateToken = (_id: string): TokenData => {
        const payload: DataStoredInToken = { _id };
        const expiresIn = 60 * 60;
        return {
            expiresIn,
            token: sign(payload, config.token.secret, { expiresIn })
        };
    };
}

export default new AuthServices();
