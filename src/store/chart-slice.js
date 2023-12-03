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
      const monthValue = action.payload.monthRef.current.value;
      const priorityValue = action.payload.priorityRef.current.value;
      const initialTasks = action.payload.initialTasks;

      const tasksPerMonth = initialTasks.filter((task) => {
        if (monthValue === "All") {
          return initialTasks;
        }
        return monthValue === task.createdOn.slice(0, -9);
      });

      const tasksPerPriority = initialTasks.filter((task) => {
        if (priorityValue === "All") {
          return initialTasks;
        }
        return priorityValue === task.priority;
      });

      state.filteredTasks = tasksPerMonth.filter(
        (task) => true === tasksPerPriority.some((el) => el.id === task.id)
      );
    },
  },
});

export const chartActions = chartSlice.actions;

export default chartSlice.reducer;
