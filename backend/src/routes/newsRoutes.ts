import { Router } from 'express';
import { getLatestNews } from '../controllers/newsController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/latest', verifyFirebaseToken, getLatestNews);

export default router;