import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import ticketReducer from "./reducers/ticketReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  tickets: ticketReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
