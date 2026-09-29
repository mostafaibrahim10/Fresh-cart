
import { createSlice } from "@reduxjs/toolkit";

const CartSlice = createSlice({
  name: "cart",

  initialState: {
    count: 0,
  },

  reducers: {
    setCart(state, action) {
      state.count = action.payload;
    },

    clearCart(state) {
      state.count = 0;
    },
  },
});

export const { setCart, clearCart } = CartSlice.actions;

export default CartSlice.reducer;
