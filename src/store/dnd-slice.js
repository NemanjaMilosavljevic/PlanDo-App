import { createSlice } from "@reduxjs/toolkit";
import { tasksActions } from "./tasks-slice";
import { arrayMove } from "@dnd-kit/sortable";

const initialState = {
  activeItem: [],
  firstColId: [],
  secondColId: [],
  thirdColId: [],
};

const dndSlice = createSlice({
  name: "dnd",
  initialState,
  reducers: {
    setFirstColId(state, actions) {
      const initialTasks = actions.payload;
      state.firstColId = initialTasks
        .filter((task) => task.status === "To Do")
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

export const DragAction = (
  active,
  over,
  sendRequest,
  initialTasks,
  token,
  type
) => {
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

      if (type === "end") {
        const updatedInitialTasks = initialTasks.map((item) => {
          if (item.id === activeTask.id) {
            return { ...activeTask, status: overTask.status };
          } else {
            return { ...item };
          }
        });

        updatedArray = arrayMove(updatedInitialTasks, activeIndex, overIndex);
        const tasksWithOrderIndex = updatedArray.map((task, i) => {
          return { id: task.id, orderIndex: i };
        });

        dispatch(tasksActions.retrieveInitialTasks(updatedArray));

        dispatch(
          DndRequestHandler(
            sendRequest,
            tasksWithOrderIndex,
            token,
            activeTask,
            overTask.status
          )
        );
      }
    }

    //Dropping task over a column

    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveATask && isOverAColumn) {
      const activeIndex = initialTasks.findIndex(
        (item) => item.id === activeId
      );

      const task = initialTasks[activeIndex];

      if (type === "end") {
        const updatedInitialTasks = initialTasks.map((item) => {
          if (item.id === task.id) {
            return { ...task, status: overId };
          } else {
            return { ...item };
          }
        });
        updatedArray = arrayMove(updatedInitialTasks, activeIndex, activeIndex);

        const tasksWithOrderIndex = updatedArray.map((task, i) => {
          return { id: task.id, orderIndex: i };
        });

        dispatch(tasksActions.retrieveInitialTasks(updatedArray));

        dispatch(
          DndRequestHandler(
            sendRequest,
            tasksWithOrderIndex,
            token,
            task,
            overId
          )
        );
      }
    }
  };
};

export const DndRequestHandler = (
  sendRequest,
  tasksWithOrderIndex,
  token,
  updatedTask,
  updatedStatus
) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_RESTAPI_ORIGIN}/tasks`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { updatedTask, status: updatedStatus, tasksWithOrderIndex },
      },
      () => {}
    );
  };
};

export const dndActions = dndSlice.actions;

export default dndSlice.reducer;
