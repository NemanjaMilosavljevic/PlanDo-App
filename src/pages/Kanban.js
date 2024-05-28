import React, { useCallback, useEffect, useMemo } from "react";
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
import Modal from "../components/UI/Modal";
import { useSelector, useDispatch } from "react-redux";
import { dndActions, DragAction } from "../store/dnd-slice";
import useHttp from "../hooks/use-http";
import { modalSliceActions } from "../store/modal-slice";
import { useNavigate } from "react-router-dom";

const Kanban = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { error, clearError, sendRequest } = useHttp();
  const dispatch = useDispatch();
  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  const tasks = useSelector((state) => state.tasks);
  const { initialTasks } = tasks;

  const dnd = useSelector((state) => state.dnd);
  const { firstColId, secondColId, thirdColId, activeItem } = dnd;

  const modal = useSelector((state) => state.modal);
  const { isModalShown } = modal;

  const columnInfo = useMemo(
    () => [
      { heading: "TO DO", columnId: "To Do" },
      { heading: "IN PROGRESS", columnId: "In progress" },
      { heading: "DONE", columnId: "Done" },
    ],
    []
  );

  const showScroll = useCallback(() => {
    document.body.style.overflow = "visible";
  }, []);

  const hideScroll = useCallback(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const removeModalHandler = useCallback(() => {
    dispatch(modalSliceActions.setModalToNotActive());
    setTimeout(() => {
      dispatch(modalSliceActions.hideModal());
    }, 1000);
  }, [dispatch]);

  const showModalHandler = (taskId) => {
    dispatch(modalSliceActions.getSelectedTask({ initialTasks, taskId }));
    dispatch(modalSliceActions.toggleModal());

    navigate({ pathname: `/tasks/edit/${taskId}` });
  };

  useEffect(() => {
    if (isModalShown) {
      dispatch(modalSliceActions.setModalToActive());
    } else {
      navigate({ pathname: `/tasks` });
    }
  }, [isModalShown, dispatch, navigate]);

  //Drag and Drop

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "item") {
      dispatch(dndActions.setActiveItem(event.active.data.current.task));
      return;
    }
  };

  const onDragAction = (type, { active, over }) => {
    dispatch(DragAction(active, over, sendRequest, initialTasks, token, type));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div
      className={`${styles.kanban} ${
        isModalShown ? hideScroll() : showScroll()
      } ${isToggle ? styles.dark : ""}`}
    >
      <div className={styles["kanban-heading"]}>
        <h1 className={styles["main-heading"]}>Board </h1>
        <h4 className={styles["sub-heading"]}>- A place for your tasks</h4>
      </div>
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragAction.bind(null, "over")}
        onDragEnd={onDragAction.bind(null, "end")}
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
                due={new Date(activeItem[0]?.due).toLocaleString("en-US", {
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
      {!isModalShown && error && (
        <Modal onClose={clearError} type="error">
          {error}
        </Modal>
      )}
      {isModalShown && <ModalItem onRemoveModal={removeModalHandler} />}
    </div>
  );
};

export default Kanban;
