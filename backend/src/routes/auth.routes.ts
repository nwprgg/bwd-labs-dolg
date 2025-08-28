import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '@controllers/auth.controller';
import { authenticateJwt } from '@config/passport';

const router = Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.get('/me', authenticateJwt, getCurrentUser as any);

export default router;
