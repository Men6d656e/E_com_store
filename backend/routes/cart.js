import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
import { 
  cartValidation, 
  objectIdValidation 
} from '../middleware/validator.js';

const router = express.Router();

/**
 * Cart Routes
 * 
 * Protected User Routes:
 * - POST /api/cart - Add item to cart
 * - GET /api/cart - Get user's cart
 * - PUT /api/cart/:id - Update cart item quantity
 * - DELETE /api/cart/:id - Remove item from cart
 * - DELETE /api/cart/clear - Clear entire cart
 */

// Protect all cart routes
router.use(protect);

router.post('/', cartValidation, addToCart);
router.get('/', getCart);
router.put('/:id', [...objectIdValidation, cartValidation], updateCartItem);
router.delete('/:id', objectIdValidation, removeCartItem);
router.delete('/clear', clearCart);

export default router;
