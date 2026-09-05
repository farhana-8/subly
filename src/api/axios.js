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
  '/api/auth/google',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/auth/forgot-password',
  '/api/auth/reset-password'
];

    const isPublicAuthEndpoint =
      publicAuthEndpoints.some(
        endpoint =>
          config.url &&
          config.url.includes(endpoint)
      );

    if (isPublicAuthEndpoint) {

      config.skipAuthRedirect = true;

      if (config.headers) {

        delete config.headers.Authorization;
        delete config.headers.authorization;
      }
    }

    const token =
      localStorage.getItem('token');

    if (
      token &&
      !isPublicAuthEndpoint
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: NEVER force logout on background data fetches
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const url = error.config?.url || '';
      // Explicitly exempt all dashboard/user/subscription/payment/notification endpoints from automatic logout
      const isExempt = 
        url.includes('/api/plans') ||
        url.includes('/api/subscriptions') ||
        url.includes('/api/payments') ||
        url.includes('/api/notifications') ||
        url.includes('/api/auth/me') ||
        url.includes('/api/auth/profile') ||
        url.includes('/api/users') ||
        error.config?.skipAuthRedirect;

      if (error.response.status === 401 && !isExempt) {
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
