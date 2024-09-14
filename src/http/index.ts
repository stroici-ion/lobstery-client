import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const $api = axios.create({
  baseURL: apiUrl,
});

$api.interceptors.request.use((config) => {
  if (config.headers) config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const response = await axios.post(`${apiUrl}api/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return $api.request(originalRequest);
      } catch (e) {}
    }
    throw error;
  }
);

export default $api;
