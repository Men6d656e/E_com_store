const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/auth');
const { 
  productValidation, 
  paginationValidation, 
  objectIdValidation 
} = require('../middleware/validator');

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

module.exports = router;
