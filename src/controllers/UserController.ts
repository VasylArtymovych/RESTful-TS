import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import { UserServices } from '../services';

const avatarDir = path.join(__dirname, '..', 'public', 'avatar');

class UserController {
    updateAvatar = asyncHandler(async (req: Request, res: Response) => {
        const { _id } = req.user;
        const { path: tempDir, filename } = req.file!;

        try {
            const resizeImg = await Jimp.read(tempDir);
            await resizeImg
                .autocrop()
                .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE)
                .write(tempDir);

            const saveImgDir = path.join(avatarDir, filename);
            await fs.rename(tempDir, saveImgDir);

            const avatarUrl = path.join('avatar', filename);
            await UserServices.updateAvatar(_id, avatarUrl);

            res.status(200).json({ code: 200, status: 'success', avatarUrl });
        } catch (error) {
            await fs.unlink(tempDir);
            throw error;
        }
    });

    about = asyncHandler(async (req: Request, res: Response) => {
        const user = await res.render('about', {});
    });

    sendMsg = asyncHandler(async (req: Request, res: Response) => {
        res.render('send');
    });
}

export default new UserController();
