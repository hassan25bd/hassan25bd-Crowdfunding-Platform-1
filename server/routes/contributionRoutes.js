import express from 'express';
import {
  createContribution,
  getMyContributions,
  getPendingContributionsForCreator,
  approveContribution,
  rejectContribution,
} from '../controllers/contributionController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, verifyRole('supporter'), createContribution);
router.get('/mine', verifyToken, verifyRole('supporter'), getMyContributions);
router.get('/pending', verifyToken, verifyRole('creator'), getPendingContributionsForCreator);
router.patch('/:id/approve', verifyToken, verifyRole('creator'), approveContribution);
router.patch('/:id/reject', verifyToken, verifyRole('creator'), rejectContribution);

export default router;
