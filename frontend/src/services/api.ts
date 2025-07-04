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
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  company?: string;
  lastLoginTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Query {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  createdAt: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface ApiDataResponse<T> {
  data: T;
}

// Products API
export const productsApi = {
  getAll: () => api.get<ApiResponse<ApiDataResponse<Product[]>>>('/products'),
  getById: (id: string) => api.get<ApiResponse<ApiDataResponse<Product>>>(`/products/${id}`),
  getByCategory: (category: string) => api.get<ApiResponse<ApiDataResponse<Product[]>>>(`/products/category/${category}`),
  search: (query: string) => api.get<ApiResponse<ApiDataResponse<Product[]>>>(`/products/search?q=${query}`),
  create: (product: Omit<Product, '_id'>) => api.post<ApiResponse<ApiDataResponse<Product>>>('/products', product),
  update: (id: string, product: Partial<Product>) => api.patch<ApiResponse<ApiDataResponse<Product>>>(`/products/${id}`, product),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/products/${id}`),
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

// Users API
export const usersApi = {
  getAll: () => api.get<ApiResponse<{ users: User[] }>>('/users'),
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

// Queries API
export const queriesApi = {
  getAll: () => api.get<ApiResponse<{ queries: Query[] }>>('/queries'),
  create: (query: Omit<Query, '_id' | 'timestamp' | 'createdAt'>) => 
    api.post<ApiResponse<{ query: Query }>>('/queries', query),
};

// Repair Job interfaces
export interface PartUsed {
  partName: string;
  partCost: number;
}

export interface RepairJob {
  _id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  deviceSerial: string;
  problemDescription: string;
  dropOffDate: string;
  expectedDeliveryDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  partsUsed: PartUsed[];
  laborCharges: number;
  taxes: number;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  physicalConditionImages: string[];
  physicalConditionDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

export const repairsApi = {
  create: (job: Omit<RepairJob, '_id' | 'createdAt' | 'updatedAt'>) => api.post<{ success: boolean; data: RepairJob }>('/repairs', job),
  getAll: (params?: any) => api.get<{ success: boolean; data: RepairJob[] }>('/repairs', { params }),
  getById: (id: string) => api.get<{ success: boolean; data: RepairJob }>(`/repairs/${id}`),
  update: (id: string, job: Partial<RepairJob>) => api.put<{ success: boolean; data: RepairJob }>(`/repairs/${id}`, job),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/repairs/${id}`),
  uploadConditionImages: (files: File[], jobId?: string, customerName?: string) => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    let url = '/repairs/upload-condition-images';
    if (jobId) {
      url += `?jobId=${encodeURIComponent(jobId)}`;
    } else if (customerName) {
      url += `?customerName=${encodeURIComponent(customerName)}`;
    }
    return api.post<{ success: boolean; urls: string[] }>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Quotation interfaces
export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  _id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: QuotationItem[];
  subtotal: number;
  taxes: number;
  totalAmount: number;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const quotationsApi = {
  create: (quotation: Omit<Quotation, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<{ success: boolean; data: Quotation }>('/quotations', quotation),
  getAll: (params?: any) =>
    api.get<{ success: boolean; data: Quotation[] }>('/quotations', { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Quotation }>(`/quotations/${id}`),
  update: (id: string, quotation: Partial<Quotation>) =>
    api.put<{ success: boolean; data: Quotation }>(`/quotations/${id}`, quotation),
  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/quotations/${id}`),
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