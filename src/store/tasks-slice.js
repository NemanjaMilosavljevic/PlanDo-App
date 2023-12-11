import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  initialTasks: [],
  isModifiedTask: false,
  didCreateTask: false,
  confirmModalIsActive: false,
  modalToConfirmDeletingTaskIsActive: false,
  didDeleteTask: false,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    openConfirmingModalForDeletingTask(state) {
      state.modalToConfirmDeletingTaskIsActive = true;
    },
    closeConfirmingModalForDeletingTask(state) {
      state.modalToConfirmDeletingTaskIsActive = false;
    },
    isTaskDeleted(state) {
      state.didDeleteTask = true;
    },
    isTaskNotDeleted(state) {
      state.didDeleteTask = false;
    },
    confirmModalIsActive(state) {
      state.confirmModalIsActive = true;
    },
    confirmModalIsNotActive(state) {
      state.confirmModalIsActive = false;
    },
    isTaskCreated(state) {
      state.didCreateTask = true;
    },
    isTaskNotCreated(state) {
      state.didCreateTask = false;
    },
    isTaskUpdated(state) {
      state.isModifiedTask = true;
    },
    isTaskNotUpdated(state) {
      state.isModifiedTask = false;
    },
    retrieveInitialTasks(state, action) {
      const tasks = action.payload;
      state.initialTasks = tasks;
    },
    addTask(state, action) {
      const newTask = action.payload;
      state.initialTasks.push(newTask);
    },
    updateTask(state, action) {
      const { initialTasks, updatedTask } = action.payload;

      state.initialTasks = initialTasks.map((task) => {
        if (task.id === updatedTask.id) {
          return { ...updatedTask };
        } else {
          return { ...task };
        }
      });
    },
    deleteTask(state, action) {
      const { initialTasks, deletedTask } = action.payload;

      let updatedTasks = initialTasks.filter(
        (item) => item.firebaseId !== deletedTask.firebaseId
      );

      state.initialTasks = updatedTasks;
    },
  },
});

// Sending http request for adding new task

export const closeConfirmModal = (payload) => {
  return (dispatch) => {
    if (payload?.type === "taskForm") {
      setTimeout(() => {
        dispatch(tasksActions.confirmModalIsNotActive());
      }, 1000);
      dispatch(tasksActions.isTaskNotCreated());
    } else if (payload?.type === "modal") {
      setTimeout(() => {
        dispatch(tasksActions.closeConfirmingModalForDeletingTask());
      }, 1000);
      dispatch(tasksActions.isTaskNotDeleted());
    }
  };
};

const fetchTasksOnCreate = (taskData, dispatch, taskObj) => {
  const generatedId = taskObj.name;
  const createdTask = { ...taskData, firebaseId: generatedId };
  dispatch(tasksActions.addTask(createdTask));

  dispatch(tasksActions.confirmModalIsActive());

  setTimeout(() => {
    dispatch(closeConfirmModal());
  }, 3000);
};

export const CreateTask = (taskData, sendRequest, userId) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: taskData,
      },
      fetchTasksOnCreate.bind(null, taskData, dispatch)
    );
  };
};

// Sending http request for updating task

const fetchTasksOnModify = (
  updatedTask,
  dispatch,
  initialTasks,
  onRemoveModal
) => {
  onRemoveModal();
  dispatch(tasksActions.isTaskUpdated());
  dispatch(tasksActions.updateTask({ initialTasks, updatedTask }));
};

export const UpdateTask = (
  updatedTask,
  sendRequest,
  initialTasks,
  userId,
  onRemoveModal
) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${updatedTask.firebaseId}/.json`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedTask,
      },
      fetchTasksOnModify.bind(
        null,
        updatedTask,
        dispatch,
        initialTasks,
        onRemoveModal
      )
    );
  };
};

// Sending http request for deleting task

const fetchTasksOnDelete = (
  deletedTask,
  dispatch,
  initialTasks,
  onRemoveModal
) => {
  onRemoveModal();
  dispatch(tasksActions.deleteTask({ initialTasks, deletedTask }));
};

export const deleteTaskHandler = (
  deletedTask,
  sendRequest,
  initialTasks,
  userId,
  onRemoveModal
) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${deletedTask.firebaseId}/.json`,
        method: "DELETE",
      },
      fetchTasksOnDelete.bind(
        null,
        deletedTask,
        dispatch,
        initialTasks,
        onRemoveModal
      )
    );
  };
};

export const tasksActions = tasksSlice.actions;

export default tasksSlice.reducer;
