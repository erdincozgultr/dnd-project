export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const UPDATE_USER_SUMMARY = "UPDATE_USER_SUMMARY";

export const loginSuccess = (data) => ({ type: LOGIN_SUCCESS, payload: data });

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { type: LOGOUT };
};

export const updateUserSummary = (summaryData) => ({
  type: UPDATE_USER_SUMMARY,
  payload: summaryData,
});
