import { Router } from 'express';
import publicRoutes from './public.routes';
import userRoutes from './user.routes';
import eventRoutes from './event.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/public', publicRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/auth', authRoutes);
export default router;
