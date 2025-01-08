const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const {
  getAnalytics,
  getTopProducts,
  getRecentOrders,
} = require('../controllers/analyticsController');

// User Management Routes
router.get('/users', isAdmin, getAllUsers);
router.patch('/users/:id/role', isAdmin, updateUserRole);
router.delete('/users/:id', isAdmin, deleteUser);

// Analytics Routes
router.get('/analytics', isAdmin, getAnalytics);
router.get('/analytics/top-products', isAdmin, getTopProducts);
router.get('/analytics/recent-orders', isAdmin, getRecentOrders);

module.exports = router;
