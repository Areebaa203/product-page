import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;

      const existing = state.products.find((item) => item.id === newItem.id);

      if (existing) {
        existing.quantity += 1;
        existing.totalPrice += newItem.price;
      } else {
        state.products.push({
          id: newItem.id,
          name: newItem.title, // ✅ title
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          image: newItem.thumbnail, // ✅ thumbnail
        });
      }

      state.totalQuantity += 1;
      state.totalPrice += newItem.price;
    },

    removeFromCart(state, action) {
      const id = action.payload;
      const item = state.products.find((p) => p.id === id);

      if (!item) return;

      state.totalQuantity -= item.quantity;
      state.totalPrice -= item.totalPrice;
      state.products = state.products.filter((p) => p.id !== id);
    },

    increaseQuantity(state, action) {
      const id = action.payload;
      const item = state.products.find((p) => p.id === id);
      if (!item) return;

      item.quantity += 1;
      item.totalPrice += item.price;
      state.totalQuantity += 1;
      state.totalPrice += item.price;
    },

    decreaseQuantity(state, action) {
      const id = action.payload;
      const item = state.products.find((p) => p.id === id);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice -= item.price;
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;
      } else {
        // optional: remove item if quantity becomes 0
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;
        state.products = state.products.filter((p) => p.id !== id);
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;

export const selectCartCount = (state) => state.cart.totalQuantity;

export default cartSlice.reducer;
