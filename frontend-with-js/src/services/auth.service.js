import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/update-profile', userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async changePassword(passwords) {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.put(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },
};
