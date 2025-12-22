import axiosClient, { STORAGE_KEYS, isTokenValid, clearAuthData } from '../../api/axiosClient';
import { setUserData, logout } from '../actions/authActions';

// Uygulama başlangıcında kullanıcı bilgisini yükle
export const initializeAuth = () => async (dispatch, getState) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  if (!token || !isTokenValid(token)) {
    // Token yok veya geçersiz
    clearAuthData();
    dispatch(logout());
    return false;
  }

  try {
    // Kullanıcı bilgisini API'den al
    const response = await axiosClient.get('/profile/me');
    dispatch(setUserData(response.data));
    return true;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    // API hatası durumunda logout
    clearAuthData();
    dispatch(logout());
    return false;
  }
};

// Token geçerliliğini periyodik kontrol et
export const checkTokenValidity = () => (dispatch) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  if (token && !isTokenValid(token)) {
    clearAuthData();
    dispatch(logout());
    return false;
  }
  
  return true;
};

// Token yenileme (eğer backend destekliyorsa)
export const refreshToken = () => async (dispatch) => {
  try {
    const response = await axiosClient.post('/auth/refresh');
    const { accessToken, user } = response.data;
    
    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      dispatch(setUserData(user));
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthData();
    dispatch(logout());
  }
  
  return false;
};