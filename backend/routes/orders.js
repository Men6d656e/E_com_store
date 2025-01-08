import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { 
  orderValidation, 
  paginationValidation, 
  objectIdValidation 
} from '../middleware/validator.js';
import { body, validateRequest } from 'express-validator';

const router = express.Router();

/**
 * Order Routes
 * 
 * Protected User Routes:
 * - POST /api/orders - Create new order
 * - GET /api/orders/myorders - Get user's orders
 * - GET /api/orders/:id - Get order by ID
 * 
 * Protected Admin Routes:
 * - GET /api/orders - Get all orders (admin)
 * - PUT /api/orders/:id/status - Update order status
 */

// Protect all order routes
router.use(protect);

// User routes
router.post('/', orderValidation, createOrder);
router.get('/myorders', paginationValidation, getMyOrders);
router.get('/:id', objectIdValidation, getOrderById);

// Admin routes
router.use(restrictTo('admin'));
router.get('/', paginationValidation, getAllOrders);
router.put('/:id/status', [
  objectIdValidation,
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  validateRequest
], updateOrderStatus);

export default router;
