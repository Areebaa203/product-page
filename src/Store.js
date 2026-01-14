import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./redux/cartSlice";
import wishlistReducer from "./redux/wishlistSlice";
import notificationsReducer from "./redux/notificationsSlice";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// root reducer
const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  notifications: notificationsReducer,
});

// persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist"], // persist cart + wishlist
  // whitelist: ["cart", "wishlist", "notifications"], // if you want bell persisted too
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
