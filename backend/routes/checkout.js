import express from 'express';
import {
  createCheckoutSession,
  processPayment,
  confirmOrder
} from '../controllers/checkoutController.js';
import { protect } from '../middleware/auth.js';
import { 
  checkoutValidation, 
  objectIdValidation 
} from '../middleware/validator.js';

const router = express.Router();

/**
 * Checkout Routes
 * 
 * Protected User Routes:
 * - POST /api/checkout/session - Create checkout session
 * - POST /api/checkout/process - Process payment
 * - POST /api/checkout/confirm - Confirm order
 */

// Protect all checkout routes
router.use(protect);

router.post('/session', checkoutValidation, createCheckoutSession);
router.post('/process', checkoutValidation, processPayment);
router.post('/confirm', checkoutValidation, confirmOrder);

export default router;
