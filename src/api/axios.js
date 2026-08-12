import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching JWT
api.interceptors.request.use(
  (config) => {
    // List of public authentication endpoints that should NOT have the Authorization header
    const publicAuthEndpoints = [
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/verify-email',
      '/api/auth/forgot-password',
      '/api/auth/reset-password'
    ];

    // Check if the current request URL is in the public list
    const isPublicAuthEndpoint = publicAuthEndpoints.some(endpoint => 
      config.url && config.url.includes(endpoint)
    );

    const token = localStorage.getItem('token');
    if (token && !isPublicAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear auth state and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Avoid redirect loop if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      // 403 errors are handled by components or protected routes
    }
    return Promise.reject(error);
  }
);

export default api;
