import {
  applyMiddleware,
  legacy_createStore as createStore,
  combineReducers,
} from "redux";
import { thunk } from "redux-thunk";

import authReducer from "./reducers/authReducer";
import notificationReducer from "./reducers/notificationReducer";
import wikiReducer from "./reducers/wikiReducer";

const rootReducer = combineReducers({ 
  auth: authReducer,
  notifications: notificationReducer,
  wiki: wikiReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
