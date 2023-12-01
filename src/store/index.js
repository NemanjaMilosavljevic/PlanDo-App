import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme-slice";
import navbarSlice from "./navbar-slice";

const store = configureStore({
  reducer: { theme: themeSlice, navbar: navbarSlice },
});

export default store;
