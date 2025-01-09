import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import {
  getAnalytics,
  getTopProducts,
  getRecentOrders,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Protect and restrict all admin routes
router.use(protect, restrictTo('admin'));

// User Management Routes
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Analytics Routes
router.get('/analytics', getAnalytics);
router.get('/analytics/top-products', getTopProducts);
router.get('/analytics/recent-orders', getRecentOrders);

export default router;
