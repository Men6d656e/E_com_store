import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { 
  productValidation, 
  paginationValidation, 
  objectIdValidation 
} from '../middleware/validator.js';

const router = express.Router();

/**
 * Product Routes
 * 
 * Public Routes:
 * - GET /api/products - Get all products with filtering and pagination
 * - GET /api/products/:id - Get single product by ID
 * 
 * Protected Admin Routes:
 * - POST /api/products - Create new product
 * - PUT /api/products/:id - Update product
 * - DELETE /api/products/:id - Delete product
 */

// Public routes
router.get('/', paginationValidation, getProducts);
router.get('/:id', objectIdValidation, getProductById);

// Protected admin routes
router.use(protect); // All routes below this middleware require authentication
router.use(restrictTo('admin')); // All routes below this middleware require admin role

router.post('/', productValidation, createProduct);
router.put('/:id', [...objectIdValidation, ...productValidation], updateProduct);
router.delete('/:id', objectIdValidation, deleteProduct);

export default router;
