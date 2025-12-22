import {
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_USER_SUMMARY,
} from "../actions/authActions";

const STORAGE_KEYS = { 
  TOKEN: "zk_auth_token_v1"
  // USER artık localStorage'da tutulmayacak, sadece Redux'ta olacak
};

const getInitialState = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    // Token varsa user bilgisini backend'den çekeceğiz
    // Şimdilik sadece token'ın varlığını kontrol ediyoruz
    if (token) {
      return { 
        token, 
        user: null, // User bilgisi App mount'ta fetch edilecek
        isAuthenticated: true 
      };
    }
  } catch (e) {
    console.error('Token okuma hatası:', e);
  }
  
  return { 
    token: null, 
    user: null, 
    isAuthenticated: false 
  };
};

const authReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };

    case LOGOUT:
      // Token'ı localStorage'dan sil
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      
      return { 
        ...state, 
        token: null, 
        user: null, 
        isAuthenticated: false 
      };
      
    case UPDATE_USER_SUMMARY:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
      
    default:
      return state;
  }
};

export default authReducer;