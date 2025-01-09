import express from 'express';
import {
  searchProducts,
  searchUsers,
  searchOrders
} from '../controllers/searchController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { 
  searchValidation, 
  paginationValidation 
} from '../middleware/validator.js';

const router = express.Router();

/**
 * Search Routes
 * 
 * Public Routes:
 * - GET /api/search/products - Search products
 * 
 * Protected Admin Routes:
 * - GET /api/search/users - Search users
 * - GET /api/search/orders - Search orders
 */

// Public product search
router.get('/products', paginationValidation, searchValidation, searchProducts);

// Protected admin routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', paginationValidation, searchValidation, searchUsers);
router.get('/orders', paginationValidation, searchValidation, searchOrders);

export default router;
