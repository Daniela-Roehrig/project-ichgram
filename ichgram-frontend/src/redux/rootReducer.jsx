import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/auth_slice";

const rootReducer = combineReducers({
    auth: authReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;