/**
 * API service for handling all backend requests
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base fetch function with error handling
 */
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  console.log(`Fetching API: ${API_URL}${endpoint}`, options);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        message: data.message || 'Something went wrong'
      });
      throw new ApiError(response.status, data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('Fetch API Error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error or invalid response');
  }
}

/**
 * Authentication API calls
 */
export const authApi = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log('Registering user:', userData);

    try {
      // Validate input
      if (!userData.name || !userData.email || !userData.password) {
        console.error('Missing registration fields');
        throw new ApiError(400, 'All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        console.error('Invalid email format');
        throw new ApiError(400, 'Invalid email format');
      }

      // Password strength validation
      if (userData.password.length < 6) {
        console.error('Password too short');
        throw new ApiError(400, 'Password must be at least 6 characters long');
      }

      return fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Registration API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Registration failed. Please try again.');
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    console.log('Logging in user:', credentials);

    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        console.error('Missing login fields');
        throw new ApiError(400, 'Email and password are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        console.error('Invalid email format');
        throw new ApiError(400, 'Invalid email format');
      }

      return fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error('Login API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Login failed. Please try again.');
    }
  },

  getProfile: async (token: string) => {
    console.log('Getting user profile:', token);

    try {
      return fetchApi('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Get profile API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to get user profile.');
    }
  },
};

/**
 * Products API calls
 */
export const productsApi = {
  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  } = {}) => {
    console.log('Getting products:', params);

    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
      return fetchApi(`/products?${searchParams.toString()}`);
    } catch (error) {
      console.error('Get products API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to get products.');
    }
  },

  getProduct: async (id: string) => {
    console.log('Getting product:', id);

    try {
      return fetchApi(`/products/${id}`);
    } catch (error) {
      console.error('Get product API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to get product.');
    }
  },

  createProduct: async (productData: any, token: string) => {
    console.log('Creating product:', productData);

    try {
      return fetchApi('/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Create product API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to create product.');
    }
  },

  updateProduct: async (id: string, productData: any, token: string) => {
    console.log('Updating product:', id, productData);

    try {
      return fetchApi(`/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Update product API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to update product.');
    }
  },

  deleteProduct: async (id: string, token: string) => {
    console.log('Deleting product:', id);

    try {
      return fetchApi(`/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Delete product API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to delete product.');
    }
  },
};

/**
 * Orders API calls
 */
export const ordersApi = {
  createOrder: async (orderData: any, token: string) => {
    console.log('Creating order:', orderData);

    try {
      return fetchApi('/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      console.error('Create order API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to create order.');
    }
  },

  getMyOrders: async (token: string) => {
    console.log('Getting my orders:', token);

    try {
      return fetchApi('/orders/myorders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Get my orders API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to get my orders.');
    }
  },

  getOrder: async (id: string, token: string) => {
    console.log('Getting order:', id);

    try {
      return fetchApi(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Get order API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to get order.');
    }
  },

  // Admin endpoints
  getAllOrders: async (token: string) => {
    console.log('Getting all orders:', token);

    try {
      return fetchApi('/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Get all orders API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to get all orders.');
    }
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    token: string
  ) => {
    console.log('Updating order status:', id, status);

    try {
      return fetchApi(`/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Update order status API error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to update order status.');
    }
  },
};
