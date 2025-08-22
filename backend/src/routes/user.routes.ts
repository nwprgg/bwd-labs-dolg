import { Router } from 'express';
import { createUser, getUserById } from '@controllers/user.controller';

const router = Router();

router.post('/', createUser as any);
router.get('/:id', getUserById as any);

export default router;
