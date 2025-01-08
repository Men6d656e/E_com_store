import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 * @body    {
 *   orderItems: Array of {productId, quantity},
 *   shippingAddress: {street, city, state, postalCode, country},
 *   paymentMethod: string
 * }
 */
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Get full product details and calculate prices
    const populatedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        
        // Check stock availability
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        return {
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          imageUrl: product.imageUrl
        };
      })
    );

    // Calculate prices
    const itemsPrice = populatedOrderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    
    // Calculate shipping price (example: free shipping over $100)
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    
    // Calculate tax (example: 15%)
    const taxPrice = itemsPrice * 0.15;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: populatedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice: itemsPrice + shippingPrice + taxPrice
    });

    // Update product stock
    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
      })
    );

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 * @params  id: Order ID
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 * @query   {
 *   page: number,
 *   limit: number,
 *   status: string
 * }
 */
export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;

    // Build filter
    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'id name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 * @params  id: Order ID
 * @body    {
 *   status: string (pending, processing, shipped, delivered, cancelled)
 * }
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = req.body.status;
    
    // If order is delivered, set deliveredAt
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
