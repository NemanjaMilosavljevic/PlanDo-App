import { createSlice } from "@reduxjs/toolkit";
import { usersActions } from "./users-slice";

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
      state.initialTasks = action.payload;
    },
    addTask(state, action) {
      state.initialTasks.push(action.payload);
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
        (item) => item.id !== deletedTask.id
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
        dispatch(usersActions.closeConfirmingModalForDeletingUser());
      }, 1000);
      dispatch(tasksActions.isTaskNotDeleted());
      dispatch(usersActions.isUserNotDeleted());
    }
  };
};

const fetchTasksOnCreate = (taskData, dispatch, data) => {
  // add id to created task
  const id = data.taskId;
  const newTask = { ...taskData, id };

  dispatch(tasksActions.addTask(newTask));
  dispatch(tasksActions.confirmModalIsActive());

  setTimeout(() => {
    dispatch(closeConfirmModal({ type: "taskForm" }));
  }, 3000);
};

export const CreateTask = (taskData, sendRequest, token) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `http://localhost:5000/create-task`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
  onRemoveModal,
  token
) => {
  return async (dispatch) => {
    dispatch(tasksActions.isTaskNotUpdated());
    sendRequest(
      {
        url: `http://localhost:5000/tasks/edit/${updatedTask.id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  onRemoveModal,
  token
) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `http://localhost:5000/tasks/edit/${deletedTask.id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
