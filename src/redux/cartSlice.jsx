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
      const price = Number(newItem.price);

      const existing = state.products.find((item) => item.id === newItem.id);

      if (existing) {
        existing.quantity += 1;
        existing.totalPrice += price;
      } else {
        state.products.push({
          id: newItem.id,
          name: newItem.title,
          price: price, // store as number
          quantity: 1,
          totalPrice: price, // store as number
          image: newItem.thumbnail,
        });
      }

      state.totalQuantity += 1;
      state.totalPrice += price; // ✅ use number
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const item = state.products.find((p) => p.id === id);
      if (!item) return;

      state.totalQuantity -= Number(item.quantity || 0);
      state.totalPrice -= Number(item.totalPrice || 0); // ✅ subtract full item total
      state.products = state.products.filter((p) => p.id !== id);

      // ✅ safety
      state.totalQuantity = Math.max(0, state.totalQuantity);
      state.totalPrice = Math.max(0, state.totalPrice);
    },

    increaseQuantity(state, action) {
      const id = action.payload;
      const item = state.products.find((p) => p.id === id);
      if (!item) return;

      const price = Number(item.price);
      item.quantity += 1;
      item.totalPrice += price;
      state.totalQuantity += 1;
      state.totalPrice += price;
    },

    decreaseQuantity(state, action) {
      const id = action.payload;
      const item = state.products.find((p) => p.id === id);
      if (!item) return;

      const price = Number(item.price);

      if (item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice -= price;
        state.totalQuantity -= 1;
        state.totalPrice -= price;
      } else {
        // remove item if quantity becomes 0
        state.totalQuantity -= 1;
        state.totalPrice -= price;
        state.products = state.products.filter((p) => p.id !== id);
      }

      // ✅ safety
      state.totalQuantity = Math.max(0, state.totalQuantity);
      state.totalPrice = Math.max(0, state.totalPrice);
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;

export const selectCartCount = (state) => state.cart.totalQuantity;
export const selectCartItems = (state) => state.cart.products;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartTotalQty = (state) => state.cart.totalQuantity;

export default cartSlice.reducer;
