import ColumnItem from "./ColumnItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import {
  faRectangleList,
  faSquareCheck,
} from "@fortawesome/free-regular-svg-icons";
import React from "react";
import styles from "./KanbanColumn.module.css";
import { useDroppable } from "@dnd-kit/core";
import { useSelector } from "react-redux";

const KanbanColumn = ({ columnId, setHeadings, showModal }) => {
  const initialTasks = useSelector((state) => state.tasks.initialTasks);
  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  const { setNodeRef, listeners, attributes } = useDroppable({
    id: columnId,
    data: {
      type: "column",
    },
  });

  const renderedTasks = initialTasks.map((task) =>
    task.status === columnId ? (
      <ColumnItem
        task={task.id}
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
        showModal={() => showModal(task.id)}
      />
    ) : null
  );

  return (
    <div
      className={styles["kanban-column"]}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <h4 className={styles["heading"]}>
        {columnId === "To do" ? (
          <FontAwesomeIcon
            icon={faRectangleList}
            style={{
              color: `${isToggle ? "#c78437" : "#000"}`,
              padding: " 0px 20px 0px 0px",
            }}
          />
        ) : columnId === "In progress" ? (
          <FontAwesomeIcon
            icon={faListCheck}
            style={{
              color: `${isToggle ? "#c78437" : "#000"}`,
              padding: " 0px 20px 0px 0px",
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faSquareCheck}
            style={{
              color: `${isToggle ? "#c78437" : "#000"}`,
              padding: " 0px 20px 0px 0px",
            }}
          />
        )}
        {setHeadings}
      </h4>

      {renderedTasks}
    </div>
  );
};

export default KanbanColumn;
