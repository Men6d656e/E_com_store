import Stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe Checkout Session
 * @route POST /api/checkout/session
 * @access Private
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock before checkout
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (item.quantity > product.stockQuantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.FRONTEND_URL}/checkout/success`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      client_reference_id: req.user._id.toString(),
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
};

/**
 * Process Payment and Create Order
 * @route POST /api/checkout/process
 * @access Private
 */
export const processPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    // Create order
    const order = new Order({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalPrice: cart.items.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0),
      paymentMethod: 'Stripe',
      paymentResult: {
        id: session.id,
        status: session.payment_status,
        update_time: new Date(),
        email_address: session.customer_details?.email
      }
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    await order.save();

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

/**
 * Confirm Order (optional additional step)
 * @route POST /api/checkout/confirm
 * @access Private
 */
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Additional order confirmation logic
    order.isConfirmed = true;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error confirming order', error: error.message });
  }
};
