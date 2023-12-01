import ColumnItem from "./ColumnItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import {
  faRectangleList,
  faSquareCheck,
} from "@fortawesome/free-regular-svg-icons";
import TasksContext from "../../contextAPI/tasks-context";
import React, { useContext } from "react";
import styles from "./KanbanColumn.module.css";
import { useDroppable } from "@dnd-kit/core";
import { useSelector } from "react-redux";

const KanbanColumn = (props) => {
  const ctxTasks = useContext(TasksContext);
  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  const { setNodeRef, listeners, attributes } = useDroppable({
    id: props.columnId,
    data: {
      type: "column",
    },
  });

  return (
    <div
      className={styles["kanban-column"]}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <h4 className={styles["heading"]}>
        {props.columnId === "To do" ? (
          <FontAwesomeIcon
            icon={faRectangleList}
            style={{
              color: `${isToggle === true ? "#c78437" : "#000"}`,
              padding: " 0px 20px 0px 10px",
            }}
          />
        ) : props.columnId === "In progress" ? (
          <FontAwesomeIcon
            icon={faListCheck}
            style={{
              color: `${isToggle === true ? "#c78437" : "#000"}`,
              padding: " 0px 20px 0px 10px",
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faSquareCheck}
            style={{
              color: `${isToggle === true ? "#c78437" : "#000"}`,
              padding: " 0px 20px 0px 10px",
            }}
          />
        )}
        {props.setHeadings}
      </h4>

      {ctxTasks.initialTasks.map((task) =>
        task.status === props.columnId ? (
          <ColumnItem
            task={task}
            key={task.id}
            id={task.id}
            title={task.title}
            priority={task.priority}
            due={task.due.toLocaleString("en-GB", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}
            status={task.status}
            description={task.description}
            visibleId={task.visibleId}
            firebaseId={task.firebaseId}
            showModal={() => props.showModal(task.id)}
          />
        ) : null
      )}
    </div>
  );
};

export default KanbanColumn;
