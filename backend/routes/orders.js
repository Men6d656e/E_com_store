import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { 
  orderValidation, 
  paginationValidation, 
  objectIdValidation 
} from '../middleware/validator.js';

const router = express.Router();

/**
 * Order Routes
 * 
 * Protected User Routes:
 * - POST /api/orders - Create new order
 * - GET /api/orders - Get user's orders
 * - GET /api/orders/:id - Get single order by ID
 * 
 * Protected Admin Routes:
 * - GET /api/orders/all - Get all orders (admin)
 * - PUT /api/orders/:id/status - Update order status
 * - DELETE /api/orders/:id - Delete order
 */

// Protected user routes
router.use(protect);

router.post('/', orderValidation, createOrder);
router.get('/', paginationValidation, getMyOrders);
router.get('/:id', objectIdValidation, getOrderById);

// Protected admin routes
router.use(restrictTo('admin'));

router.get('/all', paginationValidation, getAllOrders);
router.put('/:id/status', [objectIdValidation, orderValidation], updateOrderStatus);
router.delete('/:id', objectIdValidation, deleteOrder);

export default router;
