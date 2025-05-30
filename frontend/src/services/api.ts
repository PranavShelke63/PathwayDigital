import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Product interfaces
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  stock: number;
  specifications: {
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    display?: string;
    operatingSystem?: string;
    connectivity?: string[];
    ports?: string[];
    battery?: string;
    dimensions?: string;
    weight?: string;
  };
  features: string[];
  warranty: string;
  ratings: number;
  numReviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

// Products API
export const productsApi = {
  getAll: () => api.get<{ status: string; data: { data: Product[] } }>('/products'),
  getById: (id: string) => api.get<{ status: string; data: { data: Product } }>(`/products/${id}`),
  getByCategory: (category: string) => api.get<{ status: string; data: { data: Product[] } }>(`/products/category/${category}`),
  search: (query: string) => api.get<{ status: string; data: { data: Product[] } }>(`/products/search?q=${query}`),
  create: (product: Omit<Product, '_id'>) => api.post<{ status: string; data: { data: Product } }>('/products', product),
  update: (id: string, product: Partial<Product>) => api.patch<{ status: string; data: { data: Product } }>(`/products/${id}`, product),
  delete: (id: string) => api.delete<{ status: string; data: null }>(`/products/${id}`),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ status: string; data: { url: string } }>('/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Cart API
export const cartApi = {
  get: () => api.get<{ data: Cart }>('/cart'),
  addItem: (productId: string, quantity: number) => 
    api.post<{ data: Cart }>('/cart/items', { productId, quantity }),
  updateItem: (productId: string, quantity: number) => 
    api.patch<{ data: Cart }>('/cart/items', { productId, quantity }),
  removeItem: (productId: string) => 
    api.delete(`/cart/items/${productId}`),
  clear: () => api.delete('/cart')
};

// Add request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 