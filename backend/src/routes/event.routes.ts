import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@controllers/event.controller';
import { authenticateJWT } from '@middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getAllEvents as any);
router.get('/:id', getEventById as any);
router.post('/', createEvent as any);
router.put('/:id', updateEvent as any);
router.delete('/:id', deleteEvent as any);

export default router;
