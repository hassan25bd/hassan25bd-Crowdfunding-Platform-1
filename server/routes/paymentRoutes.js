import express from 'express';
import {
  getCreditPackages,
  createPaymentIntent,
  confirmStripePayment,
  createDummyPayment,
  getMyPayments,
} from '../controllers/paymentController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/packages', getCreditPackages);
router.get('/mine', verifyToken, verifyRole('supporter'), getMyPayments);
router.post('/create-intent', verifyToken, verifyRole('supporter'), createPaymentIntent);
router.post('/confirm', verifyToken, verifyRole('supporter'), confirmStripePayment);
router.post('/dummy', verifyToken, verifyRole('supporter'), createDummyPayment);

export default router;
