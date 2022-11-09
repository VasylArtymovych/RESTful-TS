import { Router } from 'express';
import { UserController } from '../controllers';
import { uploadFiles, validateTokenMiddleware } from '../middleware';

const router = Router();
router.get('/send', UserController.sendMsg);
router.get('/about', UserController.about);
router.patch('/avatar', validateTokenMiddleware, uploadFiles.single('avatar'), UserController.updateAvatar);

export default router;
