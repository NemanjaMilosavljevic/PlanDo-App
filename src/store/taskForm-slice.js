import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enteredTitle: "",
  enteredDescription: "",
  chosenFlag: "Not-important",
  enteredDueDate: "",
  enteredStatus: "To Do",
};

const taskFormSlice = createSlice({
  name: "taskForm",
  initialState,
  reducers: {
    setEnteredTitle(state, action) {
      state.enteredTitle = action.payload;
    },
    setEnteredDescription(state, action) {
      state.enteredDescription = action.payload;
    },
    setChosenFlag(state, action) {
      state.chosenFlag = action.payload;
    },
    setEnteredDueDate(state, action) {
      state.enteredDueDate = action.payload;
    },
    setEnteredStatus(state, action) {
      state.enteredStatus = action.payload;
    },
    setToInitialState(state, action) {
      const {
        enteredTitle,
        enteredDescription,
        chosenFlag,
        enteredDueDate,
        enteredStatus,
      } = action.payload;
      state.enteredTitle = enteredTitle;
      state.enteredDescription = enteredDescription;
      state.chosenFlag = chosenFlag;
      state.enteredDueDate = enteredDueDate;
      state.enteredStatus = enteredStatus;
    },
  },
});

export const taskFormActions = taskFormSlice.actions;

export default taskFormSlice.reducer;
