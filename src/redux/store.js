import {
  applyMiddleware,
  legacy_createStore as createStore,
  combineReducers,
} from "redux";
import { thunk } from "redux-thunk";

import authReducer from "./reducers/authReducer";
import notificationReducer from "./reducers/notificationReducer";

const rootReducer = combineReducers({ 
  auth: authReducer,
  notifications: notificationReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;