import React, { useState, useEffect } from "react";
import styles from "./Kanban.module.css";
import KanbanColumn from "../components/KanbanBoard/KanbanColumn";
import ModalItem from "../components/KanbanBoard/ModalItem";
import ColumnItem from "../components/KanbanBoard/ColumnItem";
import { SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ReactDOM from "react-dom";
import ErrorModal from "../components/UI/ErrorModal";
import { useSelector, useDispatch } from "react-redux";
import { dndActions, DragOver } from "../store/dnd-slice";
import useHttp from "../hooks/use-http";

const Kanban = React.memo(() => {
  const { error, clearError, sendRequest } = useHttp();
  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const { initialTasks, isModifiedTask } = tasks;
  const dnd = useSelector((state) => state.dnd);
  const { firstColId, secondColId, thirdColId, activeItem } = dnd;

  const columnInfo = [
    { heading: "TO DO", columnId: "To do" },
    { heading: "IN PROGRESS", columnId: "In progress" },
    { heading: "DONE", columnId: "Done" },
  ];

  const showScroll = () => {
    document.body.style.overflow = "visible";
  };

  const hideScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const [toggleModal, setToggleModal] = useState({
    showModal: false,
    choosenTask: null,
  });

  const [modalIsActive, setModalIsActive] = useState(false);

  const removeModalHandler = () => {
    setModalIsActive(false);
    setTimeout(() => {
      setToggleModal({
        showModal: false,
        choosenTask: null,
      });
    }, 1000);
  };

  const showModalHandler = (taskId) => {
    let filteredItem = {};
    for (const task of initialTasks) {
      if (taskId === task.id) {
        filteredItem = task;
      }
    }
    setToggleModal((prevState) => {
      return {
        ...prevState,
        showModal: !prevState.showModal,
        choosenTask: filteredItem,
      };
    });
  };

  const { showModal, choosenTask } = toggleModal;

  useEffect(() => {
    if (showModal) {
      setModalIsActive(true);
    }
  }, [showModal]);

  //DND

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "item") {
      dispatch(dndActions.setActiveItem(event.active.data.current.task));
      return;
    }
  };

  const onDragOver = ({ active, over }) => {
    dispatch(DragOver(active, over, sendRequest, initialTasks));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useEffect(() => {
    if (isModifiedTask) {
      dispatch(dndActions.setFirstColId(initialTasks));
      dispatch(dndActions.setSecondColId(initialTasks));
      dispatch(dndActions.setThirdColId(initialTasks));
    }
    dispatch(dndActions.setFirstColId(initialTasks));
    dispatch(dndActions.setSecondColId(initialTasks));
    dispatch(dndActions.setThirdColId(initialTasks));
  }, [dispatch, initialTasks, isModifiedTask]);

  return (
    <div
      className={`${styles.kanban} ${
        showModal === true ? hideScroll() : showScroll()
      } ${isToggle === true ? styles.dark : ""}`}
    >
      <div className={styles["kanban-heading"]}>
        <h1 className={styles["main-heading"]}>Board </h1>
        <h4 className={styles["sub-heading"]}>- A place for your tasks</h4>
      </div>
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        sensors={sensors}
      >
        <SortableContext items={firstColId}>
          <SortableContext items={secondColId}>
            <SortableContext items={thirdColId}>
              <KanbanColumn
                setHeadings={columnInfo[0].heading}
                key={columnInfo[0].columnId}
                columnId={columnInfo[0].columnId}
                showModal={showModalHandler}
              ></KanbanColumn>

              <KanbanColumn
                setHeadings={columnInfo[1].heading}
                key={columnInfo[1].columnId}
                columnId={columnInfo[1].columnId}
                showModal={showModalHandler}
              ></KanbanColumn>

              <KanbanColumn
                setHeadings={columnInfo[2].heading}
                key={columnInfo[2].columnId}
                columnId={columnInfo[2].columnId}
                showModal={showModalHandler}
              ></KanbanColumn>
            </SortableContext>
          </SortableContext>
        </SortableContext>
        {ReactDOM.createPortal(
          <DragOverlay>
            {activeItem && (
              <ColumnItem
                key={activeItem[0]?.id}
                id={activeItem[0]?.id}
                title={activeItem[0]?.title}
                priority={activeItem[0]?.priority}
                due={activeItem[0]?.due.toLocaleString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })}
                status={activeItem[0]?.status}
                description={activeItem[0]?.description}
                visibleId={activeItem[0]?.visibleId}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      {!showModal && error && (
        <ErrorModal onClose={clearError}>{error}</ErrorModal>
      )}
      {showModal && (
        <ModalItem
          onFilter={choosenTask}
          onRemoveModal={removeModalHandler}
          showModal={showModal}
          modalIsActive={modalIsActive}
        />
      )}
    </div>
  );
});

export default Kanban;
