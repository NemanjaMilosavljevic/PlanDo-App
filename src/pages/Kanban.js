import React, { useState, useContext, useEffect } from "react";
import styles from "./Kanban.module.css";
import KanbanColumn from "../components/KanbanBoard/KanbanColumn";
import ModalItem from "../components/KanbanBoard/ModalItem";
import TasksContext from "../contextAPI/tasks-context";
import ColumnItem from "../components/KanbanBoard/ColumnItem";
import DragAndDropContext from "../contextAPI/dnd-context";

import { SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import ReactDOM from "react-dom";
import ErrorModal from "../components/UI/ErrorModal";
import { useSelector } from "react-redux";

const Kanban = React.memo((props) => {
  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  const columnInfo = [
    { heading: "TO DO", columnId: "To do" },
    { heading: "IN PROGRESS", columnId: "In progress" },
    { heading: "DONE", columnId: "Done" },
  ];

  const ctxTasks = useContext(TasksContext);
  const ctxDnd = useContext(DragAndDropContext);

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
    for (const task of ctxTasks.initialTasks) {
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
        onDragStart={ctxDnd.onDragStart}
        onDragOver={ctxDnd.onDragOver}
        sensors={ctxDnd.sensors}
      >
        <SortableContext items={ctxDnd.firstColId}>
          <SortableContext items={ctxDnd.thirdColId}>
            <SortableContext items={ctxDnd.secondColId}>
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
            {ctxDnd.activeItem && (
              <ColumnItem
                key={ctxDnd.activeItem[0].id}
                id={ctxDnd.activeItem[0].id}
                title={ctxDnd.activeItem[0].title}
                priority={ctxDnd.activeItem[0].priority}
                due={ctxDnd.activeItem[0].due.toLocaleString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })}
                status={ctxDnd.activeItem[0].status}
                description={ctxDnd.activeItem[0].description}
                visibleId={ctxDnd.activeItem[0].visibleId}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      {!showModal && ctxTasks.error && (
        <ErrorModal onClose={ctxTasks.clearError}>{ctxTasks.error}</ErrorModal>
      )}
      {!showModal && ctxDnd.error && (
        <ErrorModal onClose={ctxDnd.clearError}>{ctxDnd.error}</ErrorModal>
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
