import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // [{id, title, price, thumbnail}]
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const p = action.payload;
      const exists = state.items.some((x) => x.id === p.id);

      if (exists) {
        state.items = state.items.filter((x) => x.id !== p.id);
      } else {
        state.items.push({
          id: p.id,
          title: p.title,
          price: p.price,
          thumbnail: p.thumbnail ?? p.images?.[0] ?? "",
        });
      }
    },
    removeFromWishlist(state, action) {
      const id = action.payload;
      state.items = state.items.filter((x) => x.id !== id);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistHas = (id) => (state) =>
  state.wishlist.items.some((x) => x.id === id);

export default wishlistSlice.reducer;
