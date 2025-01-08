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
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'Something went wrong');
  }

  return data;
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
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (token: string) => {
    return fetchApi('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    return fetchApi(`/products?${searchParams.toString()}`);
  },

  getProduct: async (id: string) => {
    return fetchApi(`/products/${id}`);
  },

  createProduct: async (productData: any, token: string) => {
    return fetchApi('/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id: string, productData: any, token: string) => {
    return fetchApi(`/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id: string, token: string) => {
    return fetchApi(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

/**
 * Orders API calls
 */
export const ordersApi = {
  createOrder: async (orderData: any, token: string) => {
    return fetchApi('/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async (token: string) => {
    return fetchApi('/orders/myorders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getOrder: async (id: string, token: string) => {
    return fetchApi(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Admin endpoints
  getAllOrders: async (token: string) => {
    return fetchApi('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    token: string
  ) => {
    return fetchApi(`/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },
};
