// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/products.js');
const orderRoutes = require('./routes/orders.js');
const adminRoutes = require('./routes/admin.js');

// Initialize express app
const app = express();
dotenv.config();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  
  res.status(statusCode).json({
    status: err.status || 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
