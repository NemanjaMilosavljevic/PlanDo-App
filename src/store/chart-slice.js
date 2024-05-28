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
  },
});

const filterTasksHandler = (dispatch, data) => {
  dispatch(chartActions.setFilteredTasks(data.filteredTasks));
};

export const FilterTasks = (sendRequest, token, month, priority) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `http://localhost:5000/analitycs?month=${month}&priority=${priority}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
      filterTasksHandler.bind(null, dispatch)
    );
  };
};

export const chartActions = chartSlice.actions;

export default chartSlice.reducer;
