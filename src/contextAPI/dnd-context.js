import React, { useContext, useState, useMemo, useCallback } from "react";
import TasksContext from "./tasks-context";
import useHttp from "../hooks/use-http";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import AuthContext from "./auth-context";

const DragAndDropContext = React.createContext({
  onDragStart: () => {},
  onDragOver: () => {},
  firstColId: "",
  secondColId: "",
  thirdColId: "",
  sensors: {},
  activeItem: [],
  error: null,
  clearError: () => {},
});

export const DragAndDropContextProvider = (props) => {
  const ctxTasks = useContext(TasksContext);
  const { initialTasks, setInitialTasks, setIsModifiedTask } = ctxTasks;
  const ctxAuth = useContext(AuthContext);
  const { userId } = ctxAuth;
  const { error, sendRequest, clearError } = useHttp();
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const firstColId = useMemo(() => {
    return initialTasks
      .filter((task) => task.status === "To do")
      .map((task) => task.firebaseId);
  }, [initialTasks]);

  const secondColId = useMemo(() => {
    return initialTasks
      .filter((task) => task.status === "In progress")
      .map((task) => task.firebaseId);
  }, [initialTasks]);

  const thirdColId = useMemo(() => {
    return initialTasks
      .filter((task) => task.status === "Done")
      .map((task) => task.firebaseId);
  }, [initialTasks]);

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "item") {
      setActiveItem(event.active.data.current.task);
      return;
    }
  };

  const onDragOver = (event) => {
    const { active, over } = event;

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

      initialTasks[activeIndex].status = initialTasks[overIndex].status;

      updatedArray = arrayMove(initialTasks, activeIndex, overIndex);

      dragAndDropHttpRequest(updatedArray);
    }

    //Dropping task over a column

    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveATask && isOverAColumn) {
      const activeIndex = initialTasks.findIndex(
        (item) => item.id === activeId
      );

      initialTasks[activeIndex].status = overId;

      updatedArray = arrayMove(initialTasks, activeIndex, activeIndex);

      dragAndDropHttpRequest(updatedArray);
    }
  };

  const dragAndDropUpdate = useCallback(
    async (data) => {
      // update firebaseID
      const latestData = data.map((task, index) => {
        task.firebaseId = index;
        return { ...task };
      });

      setInitialTasks(latestData);
    },
    [setInitialTasks]
  );

  const dragAndDropHttpRequest = useCallback(
    (updatedArray) => {
      setIsModifiedTask(false);
      setInitialTasks(updatedArray);

      sendRequest(
        {
          url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: updatedArray,
        },
        dragAndDropUpdate
      );
      setIsModifiedTask(true);
    },
    [sendRequest, userId, dragAndDropUpdate, setInitialTasks, setIsModifiedTask]
  );

  return (
    <DragAndDropContext.Provider
      value={{
        onDragStart,
        onDragOver,
        firstColId,
        secondColId,
        thirdColId,
        sensors,
        activeItem,
        error,
        clearError,
      }}
    >
      {props.children}
    </DragAndDropContext.Provider>
  );
};

export default DragAndDropContext;
