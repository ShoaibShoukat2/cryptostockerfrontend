import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return API(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh/`, { refresh });
      localStorage.setItem('access_token', data.access);
      processQueue(null, data.access);
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return API(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;
