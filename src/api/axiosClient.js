import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

// Storage key sabitleri
export const STORAGE_KEYS = {
  TOKEN: 'zk_auth_token_v1',
};

// Token'ın geçerliliğini kontrol et
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Token süresi dolmuş mu? (5 dakika öncesinden kontrol et - buffer)
    if (decoded.exp < currentTime + 300) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Token decode hatası:', error);
    return false;
  }
};

// Token'dan kullanıcı bilgisi çıkar (sadece temel bilgiler)
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.sub, // JWT subject genelde username
      // Diğer claim'ler varsa buraya eklenebilir
    };
  } catch (error) {
    return null;
  }
};

// Logout işlemi (merkezi)
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Auth state'i kontrol et ve gerekirse temizle
export const checkAuthState = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  if (token && !isTokenValid(token)) {
    clearAuthData();
    return false;
  }
  
  return !!token;
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 saniye timeout
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    // Token varsa ve geçerliyse ekle
    if (token) {
      if (isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Token geçersiz, temizle
        clearAuthData();
        // Auth gerektiren endpoint ise hata fırlat
        if (!config.url.includes('/auth/') && !config.url.includes('/public')) {
          return Promise.reject(new Error('Token expired'));
        }
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network hatası
    if (!error.response) {
      toast.error('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - token geçersiz veya süresi dolmuş
        clearAuthData();
        
        // Sadece login sayfasında değilsek yönlendir
        if (!window.location.pathname.includes('/giris') && 
            !window.location.pathname.includes('/login')) {
          toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
          window.location.href = '/giris';
        }
        break;

      case 403:
        toast.error('Bu işlem için yetkiniz yok.');
        break;

      case 404:
        // 404 hatalarını sessizce geç, component handle etsin
        break;

      case 500:
        toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        break;

      default:
        // Diğer hatalar için backend mesajını göster
        if (data?.message) {
          // Bu hata toast'ı useAxios'ta gösteriliyor, burada gösterme
        }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;