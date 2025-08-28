import { Router } from 'express';
import { getAllEvents } from '@controllers/event.controller';
const router = Router();

router.get('/events', getAllEvents as any);
export default router;
