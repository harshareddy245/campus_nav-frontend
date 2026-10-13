import axios from 'axios';

/**
 * Custom Axios client with JWT interceptor and automatic retry logic.
 * Matches Week 1 (Axios Basics), Week 6 (Token Storage, Axios Interceptor, Authorization Header),
 * and Week 9-10 (Retry Logic).
 */
const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if present
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusnav_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-logout on 401 & retry logic on transient errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry once for transient 503 or network failure (Week 9-10 retry logic)
    if (
      (!error.response || error.response.status === 503) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return axiosClient(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('campusnav_token');
      localStorage.removeItem('campusnav_user');
      // If not on login page, let app know
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new Event('campusnav_auth_expired'));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
