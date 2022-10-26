import { Document, Schema, model } from 'mongoose';

export interface IRole {
    value: string;
    [key: string]: any;
}
export interface IUser {
    name: string;
    userEmail: string;
    userPassword: string;
    token: string;
    roles: Array<IRole>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        userName: {
            type: String,
            default: 'John Doe'
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
        ]
    },
    { versionKey: false, timestamps: true }
);

export default model<IUserModel>('User', UserSchema);
