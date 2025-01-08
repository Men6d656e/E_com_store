import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../middleware/validator.js';

const router = express.Router();

/**
 * Auth Routes
 * Public routes:
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/login - Login user
 * 
 * Protected routes:
 * - GET /api/auth/profile - Get user profile
 */

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);

export default router;
