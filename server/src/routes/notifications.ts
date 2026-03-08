import { Router } from 'express';
import { getNotifications, markRead } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markRead);

export default router;
