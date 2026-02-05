import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Listings API
export const listingsAPI = {
  // Get all listings with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.pureVeg) params.append('pureVeg', 'true');
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.maxDistance) params.append('maxDistance', filters.maxDistance);
    if (filters.earlyBird) params.append('earlyBird', 'true');
    if (filters.nightOwl) params.append('nightOwl', 'true');
    if (filters.q) params.append('q', filters.q);

    const response = await api.get(`/listings?${params.toString()}`);
    return response.data;
  },

  // Get single listing by ID
  getById: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  // Create new listing
  create: async (listingData) => {
    const response = await api.post('/listings', listingData);
    return response.data;
  },

  // Update listing
  update: async (id, listingData) => {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },

  // Delete listing
  delete: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },
};

// Search API
export const searchAPI = {
  // Simple search
  search: async (query) => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Advanced search with filters
  advancedSearch: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.q) params.append('q', filters.q);
    if (filters.pureVeg) params.append('pureVeg', 'true');
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.maxDistance) params.append('maxDistance', filters.maxDistance);
    if (filters.earlyBird) params.append('earlyBird', 'true');
    if (filters.nightOwl) params.append('nightOwl', 'true');

    const response = await api.get(`/search/advanced?${params.toString()}`);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  register: async (name, email, password, phone) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      phone,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateProfile: async (data) => {
    const token = localStorage.getItem('token');
    const response = await api.put('/auth/profile', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  add: async (listingId) => {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/favorites',
      { listingId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  remove: async (listingId) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/favorites/${listingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  check: async (listingId) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/favorites/check/${listingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  create: async (listingId, rating, comment) => {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/reviews',
      { listingId, rating, comment },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getByListing: async (listingId) => {
    const response = await api.get(`/reviews/listing/${listingId}`);
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getConversations: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/messages/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMessages: async (conversationId) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/messages/conversation/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createConversation: async (receiverId, listingId) => {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/messages/conversation',
      { receiverId, listingId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  sendMessage: async (conversationId, receiverId, content, listingId) => {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/messages',
      { conversationId, receiverId, content, listingId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createIntent: async (listingId, amount) => {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/payments/create-intent',
      { listingId, amount },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  confirm: async (paymentId, paymentIntentId) => {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/payments/confirm',
      { paymentId, paymentIntentId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/payments', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadSingle: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/single', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultiple: async (files) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('❌ Backend server is not running!');
      console.error('Please start the backend server:');
      console.error('  cd backend && npm start');
      error.message = 'Backend server is not running. Please start it with: cd backend && npm start';
    }
    return Promise.reject(error);
  }
);

export default api;
