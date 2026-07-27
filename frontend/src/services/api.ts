import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          return null;
        }

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          const token = response.data.access_token as string;
          localStorage.setItem('accessToken', token);
          return token;
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const newToken = await refreshPromise;
    if (!newToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = 'Bearer ' + newToken;
    return api(originalRequest);
  }
);

export default api;
