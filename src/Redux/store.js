
import { configureStore } from "@reduxjs/toolkit";

import CartReducer from "./CartSlice";
import AuthenticationReducer from "./AuthenticationSlice";

export const store = configureStore({
  reducer: {
    cart: CartReducer,

    authentication: AuthenticationReducer,
  },
});
