import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme-slice";
import navbarSlice from "./navbar-slice";
import authSlice from "./auth-slice";
import tasksSlice from "./tasks-slice";
import chartSlice from "./chart-slice";
import dndSlice from "./dnd-slice";

const store = configureStore({
  reducer: {
    theme: themeSlice,
    navbar: navbarSlice,
    auth: authSlice,
    tasks: tasksSlice,
    chart: chartSlice,
    dnd: dndSlice,
  },
});

export default store;
