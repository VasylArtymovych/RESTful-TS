import { Router } from 'express';
import { AuthController } from '../controllers';
import { validateBody, validateTokenMiddleware } from '../middleware/';
import { UserSchema } from '../schemas';

const router = Router();

router.post('/register', validateBody(UserSchema), AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout', validateTokenMiddleware, AuthController.logout);
router.post('/info', AuthController.info);

export default router;
