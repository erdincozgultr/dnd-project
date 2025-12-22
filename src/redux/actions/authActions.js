import { STORAGE_KEYS , clearAuthData } from '../../api/axiosClient';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const UPDATE_USER_SUMMARY = "UPDATE_USER_SUMMARY";
export const SET_USER_DATA = "SET_USER_DATA";

// Login başarılı - sadece token ve temel user bilgisi
export const loginSuccess = (data) => ({ 
  type: LOGIN_SUCCESS, 
  payload: data 
});

// Logout - localStorage'ı temizle
export const logout = () => {
  clearAuthData();
  return { type: LOGOUT };
};

// Kullanıcı özetini güncelle (API'den gelen güncel veriler)
export const updateUserSummary = (summaryData) => ({
  type: UPDATE_USER_SUMMARY,
  payload: summaryData,
});

// Kullanıcı verilerini ayarla (uygulama başlangıcında)
export const setUserData = (userData) => ({
  type: SET_USER_DATA,
  payload: userData,
});