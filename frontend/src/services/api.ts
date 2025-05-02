import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 