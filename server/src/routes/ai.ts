import { Router } from 'express';
import { suggest } from '../controllers/aiController';

const router = Router();
router.get('/suggest', suggest);

export default router;
