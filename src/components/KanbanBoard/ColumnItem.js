import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faThumbtack, faFlag } from "@fortawesome/free-solid-svg-icons";
import styles from "./ColumnItem.module.css";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useSelector } from "react-redux";

const ColumnItem = ({ id, title, due, visibleId, priority, showModal }) => {
  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const initialTasks = useSelector((state) => state.tasks.initialTasks);

  const filteredTask = initialTasks.filter((task) => task.id === id);

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
      task: filteredTask,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className={styles["drag-card"]}>
        <h4 className={styles["title-heading"]}>{title}</h4>
        <p className={styles["due-item"]}>
          <FontAwesomeIcon
            icon={faClock}
            style={{
              color: `${isToggle ? "#c78437" : "#222"}`,
              padding: "0px 5px 0px 0px",
            }}
          />
          {due}
        </p>
        <span className={styles["id-item"]}>
          <FontAwesomeIcon
            icon={faThumbtack}
            style={{ color: "#222", padding: "0px 5px 0px 2px" }}
          />
          {visibleId}
        </span>
        <span className={styles["flag"]}>
          <FontAwesomeIcon
            icon={faFlag}
            style={{
              color: `${priority === "Important" ? "#c78437" : "#ccc"}`,
            }}
          />
        </span>
      </div>
    );
  }

  return (
    <div
      className={styles["card"]}
      onClick={showModal}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <h4 className={styles["title-heading"]}>{title}</h4>
      <p className={styles["due-item"]}>
        <FontAwesomeIcon
          icon={faClock}
          style={{
            color: `${isToggle ? "#c78437" : "#222"}`,
            padding: "0px 5px 0px 0px",
          }}
        />
        {due}
      </p>
      <span className={styles["id-item"]}>
        <FontAwesomeIcon
          icon={faThumbtack}
          style={{ color: "#222", padding: "0px 5px 0px 2px" }}
        />
        {visibleId}
      </span>
      <span className={styles["flag"]}>
        <FontAwesomeIcon
          icon={faFlag}
          style={{
            color: `${priority === "Important" ? "#c78437" : "#ccc"}`,
          }}
        />
      </span>
    </div>
  );
};

export default ColumnItem;
