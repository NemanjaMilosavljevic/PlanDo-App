import { createSlice } from "@reduxjs/toolkit";

const initialState = { switchIsToggle: false };

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    darkMode(state) {
      state.switchIsToggle = true;
    },
    lightMode(state) {
      state.switchIsToggle = false;
    },
  },
});

export const setDarkMode = () => {
  return () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("mode", "dark");
  };
};

export const setLightMode = () => {
  return () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("mode", "light");
  };
};

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
