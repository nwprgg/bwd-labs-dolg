import { Router } from 'express';
import { getAllEvents } from '@controllers/event.controller';
const router = Router();

// Публичный маршрут для получения событий
router.get('/events', getAllEvents as any);
export default router;
