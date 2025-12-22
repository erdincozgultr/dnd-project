import {
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_USER_SUMMARY,
  SET_USER_DATA,
} from "../actions/authActions";
import { STORAGE_KEYS, isTokenValid, getUserFromToken } from '../../api/axiosClient';

// Initial state - sadece token'dan temel bilgiyi al
const getInitialState = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token && isTokenValid(token)) {
      // Token'dan sadece username'i al, diğer bilgiler API'den gelecek
      const basicUser = getUserFromToken(token);
      return { 
        token, 
        user: basicUser, // Sadece username içerir
        isAuthenticated: true,
        isLoading: true, // User data yüklenene kadar true
      };
    }
  } catch (e) {
    console.error('Auth state initialization error:', e);
  }
  
  return { 
    token: null, 
    user: null, 
    isAuthenticated: false,
    isLoading: false,
  };
};

const authReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      // Login'de token'ı localStorage'a kaydet
      if (action.payload.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      }
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };

    case LOGOUT:
      return { 
        token: null, 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
      };
      
    case UPDATE_USER_SUMMARY:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        isLoading: false,
      };

    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default authReducer;