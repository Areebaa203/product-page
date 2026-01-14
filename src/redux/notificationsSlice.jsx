import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action) {
      state.items.unshift({
        id: Date.now(),
        text: action.payload,
        createdAt: Date.now(),
      });
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const { addNotification, clearNotifications } =
  notificationsSlice.actions;
export const selectNotificationsCount = (state) =>
  state.notifications.items.length;
export default notificationsSlice.reducer;
