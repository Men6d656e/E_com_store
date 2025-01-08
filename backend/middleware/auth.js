import jwt from 'jsonwebtoken';
import User from '../models/User';

// Middleware to protect routes - verifies JWT token
export const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Please login to access this resource' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // 4. Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token, please login again' });
  }
};

// Middleware to restrict access to admin only
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};
