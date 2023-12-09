import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredTasks: [],
  filteredMonth: "All",
  filteredPriority: "All",
};

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setFilterMonth(state, action) {
      state.filteredMonth = action.payload;
    },
    setFilterPriority(state, action) {
      state.filteredPriority = action.payload;
    },
    setFilteredTasks(state, action) {
      state.filteredTasks = action.payload;
    },
    filterTasks(state, action) {
      const { filteredMonth, filteredPriority, initialTasks } = action.payload;

      const tasksPerMonth = initialTasks.filter((task) => {
        if (filteredMonth === "All") {
          return initialTasks;
        }
        return filteredMonth === task.createdOn.slice(0, -9);
      });

      const tasksPerPriority = initialTasks.filter((task) => {
        if (filteredPriority === "All") {
          return initialTasks;
        }
        return filteredPriority === task.priority;
      });

      state.filteredTasks = tasksPerMonth.filter(
        (task) => true === tasksPerPriority.some((el) => el.id === task.id)
      );
    },
  },
});

export const chartActions = chartSlice.actions;

export default chartSlice.reducer;
