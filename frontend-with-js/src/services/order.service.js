import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async getUserOrders() {
    const response = await api.get('/orders/me');
    return response.data;
  },

  async getAllOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  async createPaymentIntent(orderId) {
    const response = await api.post(`/orders/${orderId}/payment-intent`);
    return response.data;
  },

  async confirmPayment(orderId, paymentIntentId) {
    const response = await api.post(`/orders/${orderId}/confirm-payment`, {
      paymentIntentId,
    });
    return response.data;
  },
};
