import { Document, Schema, model } from 'mongoose';
import gravatar from 'gravatar';
import { IRole } from './RoleModel';

export interface IUser {
    userName: string;
    userEmail: string;
    userPassword: string;
    token: string | null;
    roles: Array<IRole>;
    avatar: string;
}

interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema<IUser>(
    {
        userName: {
            type: String,
            default: 'User'
        },
        userEmail: {
            type: String,
            required: [true, 'DB: Email is required.']
        },
        userPassword: {
            type: String,
            required: [true, 'DB: Password is required.']
        },
        token: {
            type: String,
            default: null
        },
        roles: [
            {
                type: String,
                ref: 'Role'
            }
        ],
        avatar: {
            type: String,
            default: function () {
                return gravatar.url(this.userEmail, { s: '250' }, true);
            }
        }
    },
    { versionKey: false, timestamps: true }
);

export const UserModel = model<IUserModel>('User', UserSchema);
