import express from 'express';
import { getMyNotifications } from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/mine', verifyToken, getMyNotifications);

export default router;
