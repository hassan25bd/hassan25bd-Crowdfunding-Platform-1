import express from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminStats,
  getCreatorStats,
  getSupporterStats,
} from '../controllers/userController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, verifyRole('admin'), getUsers);
router.patch('/:id/role', verifyToken, verifyRole('admin'), updateUserRole);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteUser);

router.get('/stats/admin', verifyToken, verifyRole('admin'), getAdminStats);
router.get('/stats/creator', verifyToken, verifyRole('creator'), getCreatorStats);
router.get('/stats/supporter', verifyToken, verifyRole('supporter'), getSupporterStats);

export default router;
