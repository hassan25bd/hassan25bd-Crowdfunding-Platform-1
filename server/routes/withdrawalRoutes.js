import express from 'express';
import {
  getWithdrawalSummary,
  createWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
} from '../controllers/withdrawalController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', verifyToken, verifyRole('creator'), getWithdrawalSummary);
router.get('/mine', verifyToken, verifyRole('creator'), getMyWithdrawals);
router.get('/pending', verifyToken, verifyRole('admin'), getPendingWithdrawals);
router.post('/', verifyToken, verifyRole('creator'), createWithdrawal);
router.patch('/:id/approve', verifyToken, verifyRole('admin'), approveWithdrawal);

export default router;
