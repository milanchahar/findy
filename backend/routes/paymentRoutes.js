import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/', getPayments);

export default router;
