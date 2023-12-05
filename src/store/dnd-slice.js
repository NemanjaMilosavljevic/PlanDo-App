import { createSlice } from "@reduxjs/toolkit";
import { tasksActions } from "./tasks-slice";
import { arrayMove } from "@dnd-kit/sortable";

const initialState = {
  activeItem: [],
  firstColId: [],
  secondColId: [],
  thirdColId: [],
};

const userId = localStorage.getItem("localId");

const dndSlice = createSlice({
  name: "dnd",
  initialState,
  reducers: {
    setFirstColId(state, actions) {
      const initialTasks = actions.payload;
      state.firstColId = initialTasks
        .filter((task) => task.status === "To do")
        .map((task) => task.id);
    },
    setSecondColId(state, actions) {
      const initialTasks = actions.payload;
      state.secondColId = initialTasks
        .filter((task) => task.status === "In progress")
        .map((task) => task.id);
    },
    setThirdColId(state, actions) {
      const initialTasks = actions.payload;
      state.thirdColId = initialTasks
        .filter((task) => task.status === "Done")
        .map((task) => task.id);
    },
    setActiveItem(state, action) {
      state.activeItem = action.payload;
    },
  },
});

export const DragOver = (active, over, sendRequest, initialTasks) => {
  return (dispatch) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "item";
    const isOverATask = over.data.current?.type === "item";

    if (!isActiveATask) return;

    let updatedArray;

    //Dropping task over another task

    if (isActiveATask && isOverATask) {
      const activeIndex = initialTasks.findIndex(
        (item) => item.id === activeId
      );
      const overIndex = initialTasks.findIndex((item) => item.id === overId);

      const activeTask = initialTasks[activeIndex];
      const overTask = initialTasks[overIndex];

      const updatedInitialTasks = initialTasks.map((item) => {
        if (item.id === activeTask.id) {
          return { ...activeTask, status: overTask.status };
        } else {
          return { ...item };
        }
      });

      updatedArray = arrayMove(updatedInitialTasks, activeIndex, overIndex);

      dispatch(DndRequestHandler(sendRequest, updatedArray));
    }

    //Dropping task over a column

    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveATask && isOverAColumn) {
      const activeIndex = initialTasks.findIndex(
        (item) => item.id === activeId
      );

      const task = initialTasks[activeIndex];

      const updatedInitialTasks = initialTasks.map((item) => {
        if (item.id === task.id) {
          return { ...task, status: overId };
        } else {
          return { ...item };
        }
      });

      updatedArray = arrayMove(updatedInitialTasks, activeIndex, activeIndex);

      dispatch(DndRequestHandler(sendRequest, updatedArray));
    }
  };
};

export const DndRequestHandler = (sendRequest, updatedArray) => {
  return async (dispatch) => {
    dispatch(tasksActions.isTaskNotUpdated());

    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedArray,
      },
      dragAndDropUpdate.bind(null, dispatch)
    );
    dispatch(tasksActions.isTaskUpdated());
  };
};

const dragAndDropUpdate = (dispatch, data) => {
  // update firebaseID
  const latestData = data.map((task, index) => {
    return { ...task, firebaseId: index };
  });

  dispatch(tasksActions.retrieveInitialTasks(latestData));
};

export const dndActions = dndSlice.actions;

export default dndSlice.reducer;
