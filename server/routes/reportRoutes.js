import express from 'express';
import { createReport, getReports, resolveReport } from '../controllers/reportController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, verifyRole('supporter'), createReport);
router.get('/', verifyToken, verifyRole('admin'), getReports);
router.patch('/:id/resolve', verifyToken, verifyRole('admin'), resolveReport);

export default router;
