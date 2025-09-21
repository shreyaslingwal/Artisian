// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // Add timeout for better error handling
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    console.error('Error details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const saveProduct = (productData) => api.post('/products', productData);
export const uploadImages = (productId, formData) => api.post(`/products/${productId}/upload-images`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const fetchProducts = () => api.get('/products');
export const enhanceDescription = (description) => api.post('/products/enhance-description', { description });

export default api;