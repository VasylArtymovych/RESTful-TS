import Joi from 'joi';
import { IAuthData } from '../interfaces/AuthData';

export const UserSchema = Joi.object<IAuthData>({
    userName: Joi.string().alphanum().min(3),
    userEmail: Joi.string().email(),
    userPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
});
