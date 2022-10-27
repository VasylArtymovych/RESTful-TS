import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import shortId from 'shortid';

const tempDir = path.join(__dirname, '..', 'temp');

type destinationCallback = (err: Error | null, destination: string) => void;
type filenameCallback = (err: Error | null, filename: string) => void;

const configStore = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: destinationCallback) => {
        cb(null, tempDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: filenameCallback) => {
        cb(null, shortId.generate() + '_' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file?.mimetype?.includes('image')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export default multer({ storage: configStore, fileFilter });
