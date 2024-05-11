import { configureStore, createReducer } from "@reduxjs/toolkit";
import { productApi } from "./api/productapi";
import { authApi } from "./api/authapi";
import { userApi } from "./api/userapi";
import userReducer from "./features/userSlice"; 
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    auth: userReducer, 
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
    ]),
});
