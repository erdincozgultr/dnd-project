import {
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_USER_SUMMARY,
} from "../actions/authActions";
// axiosClient'tan keyleri import edebiliriz veya string olarak yazabiliriz.
// Döngüsel bağımlılık olmaması için string kullanıyorum, ancak sabitler dosyası oluşturmak daha temiz olurdu.
const STORAGE_KEYS = { TOKEN: "zk_auth_token_v1", USER: "zk_user_data_v1" };

const getInitialState = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    if (token && user) return { token, user, isAuthenticated: true };
  } catch (e) {}
  return { token: null, user: null, isAuthenticated: false };
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
      return { ...state, token: null, user: null, isAuthenticated: false };
      
    case UPDATE_USER_SUMMARY:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload, // Mevcut user objesini yeni özet verilerle birleştirir
        },
      };
    default:
      return state;
  }
};
export default authReducer;
