import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// PUBLIC AUTH ENDPOINTS
// These endpoints must NOT receive an Authorization header.
// ============================================================

const publicAuthEndpoints = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/google',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const requestUrl = config.url || '';

    const isPublicAuthEndpoint =
      publicAuthEndpoints.some((endpoint) =>
        requestUrl.includes(endpoint)
      );

    // ----------------------------------------------------------
    // Public authentication request
    // ----------------------------------------------------------

    if (isPublicAuthEndpoint) {
      config.skipAuthRedirect = true;

      if (config.headers) {
        delete config.headers.Authorization;
        delete config.headers.authorization;
      }

      return config;
    }

    // ----------------------------------------------------------
    // Protected request
    // ----------------------------------------------------------

    const token =
      localStorage.getItem('token');

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const response = error?.response;
    const config = error?.config;

    if (!response) {
      return Promise.reject(error);
    }

    const status = response.status;
    const url = config?.url || '';

    // ----------------------------------------------------------
    // Public authentication endpoints
    //
    // IMPORTANT:
    // A 401 here means login/authentication failed.
    // We MUST NOT clear the existing session automatically.
    // ----------------------------------------------------------

    const isPublicAuthEndpoint =
      publicAuthEndpoints.some((endpoint) =>
        url.includes(endpoint)
      );

    if (isPublicAuthEndpoint) {
      return Promise.reject(error);
    }

    // ----------------------------------------------------------
    // Background/data endpoints
    //
    // Don't force logout if these fail.
    // ----------------------------------------------------------

    const isExempt =
      url.includes('/api/plans') ||
      url.includes('/api/subscriptions') ||
      url.includes('/api/payments') ||
      url.includes('/api/notifications') ||
      url.includes('/api/auth/me') ||
      url.includes('/api/auth/profile') ||
      url.includes('/api/users') ||
      config?.skipAuthRedirect;

    // ----------------------------------------------------------
    // 401 from protected endpoint
    //
    // This means the stored JWT is no longer valid.
    // ----------------------------------------------------------

    if (
      status === 401 &&
      !isExempt
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (
        !window.location.pathname.includes('/login')
      ) {
        window.history.replaceState(
          {},
          '',
          '/login'
        );

        window.dispatchEvent(
          new PopStateEvent('popstate')
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;