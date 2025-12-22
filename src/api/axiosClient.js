import axios from 'axios';
import { toast } from 'react-toastify';

// Sadece token'ı saklayacağız
export const STORAGE_KEYS = {
  TOKEN: 'zk_auth_token_v1'
};

// Auth data temizleme fonksiyonu (export edildi)
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - Token'ı ekle
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - 401 durumunda logout
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token'ı temizle
      clearAuthData();
      
      // Login sayfasına yönlendir
      window.location.href = '/login';
      
      toast.error("Oturum süresi doldu. Lütfen tekrar giriş yap.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;