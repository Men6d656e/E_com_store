const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get analytics overview
// @route   GET /api/admin/analytics
// @access  Admin
exports.getAnalytics = asyncHandler(async (req, res) => {
  // Get total revenue
  const orders = await Order.find({ status: { $ne: 'cancelled' } });
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  // Get total orders
  const totalOrders = orders.length;

  // Get total customers
  const totalCustomers = await User.countDocuments({ role: 'user' });

  // Calculate average order value
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name');

  // Get top products
  const topProducts = await Order.aggregate([
    // Unwind the items array to create a document for each item
    { $unwind: '$items' },
    // Group by product and calculate total quantity and revenue
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    // Sort by total quantity in descending order
    { $sort: { totalQuantity: -1 } },
    // Limit to top 5 products
    { $limit: 5 },
    // Lookup product details
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    // Unwind the product array
    { $unwind: '$product' },
    // Project the final fields
    {
      $project: {
        _id: 1,
        name: '$product.name',
        image: { $arrayElemAt: ['$product.images', 0] },
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ]);

  res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    recentOrders,
    topProducts,
  });
});

// @desc    Get top selling products
// @route   GET /api/admin/analytics/top-products
// @access  Admin
exports.getTopProducts = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // Default to last 30 days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  const topProducts = await Order.aggregate([
    // Match orders within the specified period
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: 'cancelled' },
      },
    },
    // Unwind the items array
    { $unwind: '$items' },
    // Group by product
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $addToSet: '$_id' },
      },
    },
    // Add orders count
    {
      $addFields: {
        ordersCount: { $size: '$orders' },
      },
    },
    // Sort by total quantity
    { $sort: { totalQuantity: -1 } },
    // Limit to top 10
    { $limit: 10 },
    // Lookup product details
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    // Unwind the product array
    { $unwind: '$product' },
    // Project final fields
    {
      $project: {
        _id: 1,
        name: '$product.name',
        image: { $arrayElemAt: ['$product.images', 0] },
        totalQuantity: 1,
        totalRevenue: 1,
        ordersCount: 1,
      },
    },
  ]);

  res.json(topProducts);
});

// @desc    Get recent orders
// @route   GET /api/admin/analytics/recent-orders
// @access  Admin
exports.getRecentOrders = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('user', 'name email')
    .populate('items.product', 'name images');

  res.json(recentOrders);
});
