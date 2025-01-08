interface OrderDetails {
  _id: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: string;
}

interface User {
  name: string;
  email: string;
}

export const emailTemplates = {
  orderConfirmation: (order: OrderDetails, user: User) => ({
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p>Hi ${user.name},</p>
        <p>We've received your order and it's being processed. Here are your order details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Order #${order._id}</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <th style="text-align: left; padding: 10px;">Item</th>
                <th style="text-align: right; padding: 10px;">Quantity</th>
                <th style="text-align: right; padding: 10px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 10px;">${item.product.name}</td>
                  <td style="text-align: right; padding: 10px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 10px;">$${(
                    item.product.price * item.quantity
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
              <tr>
                <td colspan="2" style="text-align: right; padding: 10px;"><strong>Total:</strong></td>
                <td style="text-align: right; padding: 10px;"><strong>$${order.total.toFixed(
                  2
                )}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Shipping Address</h3>
          <p style="margin-bottom: 0;">
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
      order.shippingAddress.zipCode
    }<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <p>We'll send you another email when your order ships.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            If you have any questions about your order, please contact our customer service team.
          </p>
        </div>
      </div>
    `,
  }),

  orderShipped: (order: OrderDetails, user: User, trackingNumber: string) => ({
    subject: `Your Order Has Shipped - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order Has Shipped!</h2>
        <p>Hi ${user.name},</p>
        <p>Great news! Your order is on its way to you.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Tracking Information</h3>
          <p>Tracking Number: <strong>${trackingNumber}</strong></p>
          <p>You can track your package using the link below:</p>
          <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Track Package</a>
        </div>

        <p>Expected delivery: 3-5 business days</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            If you have any questions about your delivery, please contact our customer service team.
          </p>
        </div>
      </div>
    `,
  }),

  orderDelivered: (order: OrderDetails, user: User) => ({
    subject: `Your Order Has Been Delivered - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order Has Been Delivered!</h2>
        <p>Hi ${user.name},</p>
        <p>Your order has been delivered. We hope you're enjoying your purchase!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p>Order Number: #${order._id}</p>
          <p>Delivery Address:</p>
          <p>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
      order.shippingAddress.zipCode
    }<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p>How was your experience?</p>
          <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px;">Write a Review</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            If you have any issues with your order, please contact our customer service team within 30 days.
          </p>
        </div>
      </div>
    `,
  }),

  passwordReset: (user: User, resetLink: string) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            This password reset link will expire in 24 hours.
          </p>
        </div>
      </div>
    `,
  }),

  welcomeEmail: (user: User) => ({
    subject: 'Welcome to Our Store!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Our Store!</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for creating an account with us. We're excited to have you as a customer!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">What's Next?</h3>
          <ul style="padding-left: 20px;">
            <li>Browse our latest products</li>
            <li>Complete your profile</li>
            <li>Add items to your wishlist</li>
            <li>Check out our current deals</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Start Shopping</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            If you have any questions, our customer service team is here to help!
          </p>
        </div>
      </div>
    `,
  }),
};
