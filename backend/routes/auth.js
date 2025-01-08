const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validator');

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

module.exports = router;
