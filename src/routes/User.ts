import { Router } from 'express';
import { UserController } from '../controllers';
import { uploadFiles, validateTokenMiddleware } from '../middleware';

const router = Router();
router.patch('/avatar', validateTokenMiddleware, uploadFiles.single('avatar'), UserController.updateAvatar);

export default router;
