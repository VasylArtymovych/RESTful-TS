import Joi from 'joi';
import { IJoiUser } from '../interfaces/JoiUser';

export const UserSchema = Joi.object<IJoiUser>({
    userName: Joi.string().alphanum().min(3),
    userEmail: Joi.string().email(),
    userPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
});
