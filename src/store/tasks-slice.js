import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  initialTasks: [],
  isModifiedTask: false,
  didCreateTask: false,
  confirmModalIsActive: false,
};

const userId = localStorage.getItem("localId");

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
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
      let initialTasks = action.payload.initialTasks;
      const updatedTask = action.payload.updatedTask;

      for (const task of initialTasks) {
        if (updatedTask.firebaseId === task.firebaseId) {
          for (const prop in task) {
            if (!(task[prop] === updatedTask[prop])) {
              task[prop] = updatedTask[prop];
            }
          }

          state.initialTasks = initialTasks;
        }
      }
    },
    deleteTask(state, action) {
      const initialTasks = action.payload.initialTasks;
      const deletedTask = action.payload.deletedTask;

      let updatedTasks = initialTasks.filter(
        (item) => item.firebaseId !== deletedTask.firebaseId
      );

      state.initialTasks = updatedTasks;
    },
  },
});

// Sending http request for adding new task

export const closeConfirmModal = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(tasksActions.confirmModalIsNotActive());
    }, 1000);
    dispatch(tasksActions.isTaskNotCreated());
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

export const CreateTask = (taskData, sendRequest) => {
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

const fetchTasksOnModify = (updatedTask, dispatch, initialTasks) => {
  dispatch(tasksActions.isTaskUpdated());
  dispatch(tasksActions.updateTask({ initialTasks, updatedTask }));
};

export const UpdateTask = (updatedTask, sendRequest, initialTasks) => {
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
      fetchTasksOnModify.bind(null, updatedTask, dispatch, initialTasks)
    );
  };
};

// Sending http request for deleting task

const fetchTasksOnDelete = (deletedTask, dispatch, initialTasks) => {
  dispatch(tasksActions.deleteTask({ initialTasks, deletedTask }));
};

export const deleteTaskHandler = (deletedTask, sendRequest, initialTasks) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${deletedTask.firebaseId}/.json`,
        method: "DELETE",
      },
      fetchTasksOnDelete.bind(null, deletedTask, dispatch, initialTasks)
    );
  };
};

export const tasksActions = tasksSlice.actions;

export default tasksSlice.reducer;
