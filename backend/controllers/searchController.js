import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

/**
 * Search Products
 * @route GET /api/search/products
 * @access Public
 */
export const searchProducts = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const searchConditions = {};

    // Text search
    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      searchConditions.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchConditions.price = {};
      if (minPrice) searchConditions.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchConditions.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(searchConditions)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(searchConditions);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

/**
 * Search Users (Admin Only)
 * @route GET /api/search/users
 * @access Admin
 */
export const searchUsers = async (req, res) => {
  try {
    const { query, role, page = 1, limit = 10 } = req.query;

    const searchConditions = {};

    // Text search
    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ];
    }

    // Role filter
    if (role) {
      searchConditions.role = role;
    }

    const users = await User.find(searchConditions)
      .select('-password')
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(searchConditions);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};

/**
 * Search Orders (Admin Only)
 * @route GET /api/search/orders
 * @access Admin
 */
export const searchOrders = async (req, res) => {
  try {
    const { 
      query, 
      status, 
      minTotal, 
      maxTotal, 
      page = 1, 
      limit = 10 
    } = req.query;

    const searchConditions = {};

    // Text search (by order ID or user email)
    if (query) {
      searchConditions.$or = [
        { _id: query },
        { 'user.email': { $regex: query, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      searchConditions.status = status;
    }

    // Total price range filter
    if (minTotal || maxTotal) {
      searchConditions.totalPrice = {};
      if (minTotal) searchConditions.totalPrice.$gte = parseFloat(minTotal);
      if (maxTotal) searchConditions.totalPrice.$lte = parseFloat(maxTotal);
    }

    const orders = await Order.find(searchConditions)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(searchConditions);

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching orders', error: error.message });
  }
};
