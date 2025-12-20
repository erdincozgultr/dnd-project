import axios from 'axios';
import { toast } from 'react-toastify';

// Heryerde bu sabitleri kullanacağız
export const STORAGE_KEYS = {
  TOKEN: 'zk_auth_token_v1',
  USER: 'zk_user_data_v1'
};

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
      toast.error("Oturum süresi doldu.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;