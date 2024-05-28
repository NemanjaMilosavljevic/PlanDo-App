import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enteredTitle: "",
  enteredDescription: "",
  chosenPriority: "",
  enteredDueDate: "",
  enteredStatus: "",
  visibleId: "",
  id: "",
  isChecked: false,
  createdOn: "",
  selectedTask: null,
  isModalShown: false,
  modalIsActive: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    getSelectedTask(state, action) {
      const { initialTasks, taskId } = action.payload;
      const [selectedTask] = initialTasks.filter((task) => task.id === taskId);

      const createUTCdateToISO = (dateString) => {
        const offset = new Date().getTimezoneOffset();
        const myDate = Date.parse(dateString) - offset * 60 * 1000;
        return new Date(myDate).toISOString().slice(0, 10);
      };

      state.selectedTask = selectedTask;
      state.enteredTitle = selectedTask.title;
      state.enteredDescription = selectedTask.description;
      state.chosenPriority = selectedTask.priority;
      state.enteredDueDate = createUTCdateToISO(selectedTask.due);
      state.enteredStatus = selectedTask.status;
      state.visibleId = selectedTask.visibleId;
      state.id = selectedTask.id;
      state.isChecked = selectedTask.priority === "Important" ? true : false;
      state.createdOn = new Date(selectedTask.created_on).toLocaleString(
        "en-US",
        {
          month: "long",
          day: "2-digit",
          year: "numeric",
        }
      );
    },
    toggleModal(state) {
      state.isModalShown = !state.isModalShown;
    },
    hideModal(state) {
      state.isModalShown = false;
    },
    setModalToActive(state) {
      state.modalIsActive = true;
    },
    setModalToNotActive(state) {
      state.modalIsActive = false;
    },
    getTitle(state, action) {
      state.enteredTitle = action.payload;
    },
    getDescription(state, action) {
      state.enteredDescription = action.payload;
    },
    getPriority(state, action) {
      state.chosenPriority = action.payload;
    },
    getDueDate(state, action) {
      state.enteredDueDate = action.payload;
    },
    getStatus(state, action) {
      state.enteredStatus = action.payload;
    },
    getIsChecked(state, action) {
      if (action.payload === "Important") {
        state.isChecked = true;
      } else {
        state.isChecked = false;
      }
    },
  },
});

export const modalSliceActions = modalSlice.actions;

export default modalSlice.reducer;
