import { Request } from 'express';

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface DataStoredInToken {
    _id: string;
}

export interface RequestWithToken extends Request {
    token: DataStoredInToken;
}
