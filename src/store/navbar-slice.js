import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShown: true,
  navbarAndHeaderIsShown: true,
  showAccountBar: false,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState: initialState,
  reducers: {
    showNavbar(state) {
      state.isShown = true;
    },
    hideNavbar(state) {
      state.isShown = false;
    },
    toggleNavbar(state) {
      state.isShown = !state.isShown;
    },
    showNavbarAndHeader(state) {
      state.navbarAndHeaderIsShown = true;
    },
    hideNavbarAndHeader(state) {
      state.navbarAndHeaderIsShown = false;
    },
    showAccountSettings(state) {
      state.showAccountBar = true;
    },
    hideAccountSettings(state) {
      state.showAccountBar = false;
    },
  },
});

export const navbarActions = navbarSlice.actions;

export default navbarSlice.reducer;
