import { Document, Schema, model } from 'mongoose';

export interface IRole {
    value: string;
}
interface IRoleModel extends IRole, Document {}

const RoleSchema = new Schema(
    {
        value: {
            type: String,
            unique: true,
            default: 'USER'
        }
    },
    { versionKey: false, timestamps: true }
);

export const RoleModel = model<IRoleModel>('Role', RoleSchema);

// "ADMIN"
// "USER"
// "EDITOR"
// "MODERATOR"
