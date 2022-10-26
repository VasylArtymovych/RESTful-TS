import e, { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export default (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        next();
    };
};
