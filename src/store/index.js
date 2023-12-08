import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme-slice";
import navbarSlice from "./navbar-slice";
import authSlice from "./auth-slice";

const store = configureStore({
  reducer: { theme: themeSlice, navbar: navbarSlice, auth: authSlice },
});

export default store;
