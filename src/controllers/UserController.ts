import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import { UserModel } from '../models';
import { CustomError } from '../helpers';

const avatarDir = path.join(__dirname, '..', 'public', 'avatar');

class UserController {
    updateAvatar = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
            const user = await UserModel.findOneAndUpdate({ _id }, { avatar: avatarUrl }, { new: true });
            if (!user) {
                throw new CustomError('Unable to update avatar');
            }

            res.status(200).json({ code: 200, status: 'success', avatarUrl });
        } catch (error) {
            await fs.unlink(tempDir);
            throw error;
        }
    });
}

export default new UserController();
