import api from './api';

export const productService = {
  async getAllProducts(params) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getProductReviews(id) {
    const response = await api.get(`/products/${id}/reviews`);
    return response.data;
  },

  async addProductReview(id, reviewData) {
    const response = await api.post(`/products/${id}/reviews`, reviewData);
    return response.data;
  },

  async deleteProductReview(productId, reviewId) {
    const response = await api.delete(
      `/products/${productId}/reviews/${reviewId}`
    );
    return response.data;
  },
};
