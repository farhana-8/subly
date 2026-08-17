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
    const publicAuthEndpoints = [
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/verify-email',
      '/api/auth/resend-verification',
      '/api/auth/forgot-password',
      '/api/auth/reset-password'
    ];

    const isPublicAuthEndpoint = publicAuthEndpoints.some(endpoint => 
      config.url && config.url.includes(endpoint)
    );

    if (isPublicAuthEndpoint) {
      config.skipAuthRedirect = true;
      if (config.headers) {
        delete config.headers.Authorization;
        delete config.headers.authorization;
      }
    }

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
      // If endpoint is 404 for subscriptions/current, do not treat as auth failure
      if (error.response.status === 404 && error.config?.url?.includes('/api/subscriptions/current')) {
        return Promise.reject(error);
      }
      if (error.response.status === 401 && !error.config?.skipAuthRedirect) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.history.replaceState({}, '', '/login');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
