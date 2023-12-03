import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faThumbtack, faFlag } from "@fortawesome/free-solid-svg-icons";
import styles from "./ColumnItem.module.css";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useSelector } from "react-redux";

const ColumnItem = (props) => {
  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const initialTasks = useSelector((state) => state.tasks.initialTasks);

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: props.id,
    data: {
      type: "item",
      task: initialTasks.filter((task) => task.id === props.id),
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className={styles["drag-card"]}>
        <h4 className={styles["title-heading"]}>{props.title}</h4>
        <p className={styles["due-item"]}>
          <FontAwesomeIcon
            icon={faClock}
            style={{
              color: `${isToggle === true ? "#c78437" : "#222"}`,
              padding: "0px 5px 0px 0px",
            }}
          />
          {props.due}
        </p>
        <span className={styles["id-item"]}>
          <FontAwesomeIcon
            icon={faThumbtack}
            style={{ color: "#222", padding: "0px 5px 0px 2px" }}
          />
          {props.visibleId}
        </span>
        <span className={styles["flag"]}>
          <FontAwesomeIcon
            icon={faFlag}
            style={{
              color: `${props.priority === "Important" ? "#c78437" : "#ccc"}`,
            }}
          />
        </span>
      </div>
    );
  }

  return (
    <div
      className={styles["card"]}
      onClick={props.showModal}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <h4 className={styles["title-heading"]}>{props.title}</h4>
      <p className={styles["due-item"]}>
        <FontAwesomeIcon
          icon={faClock}
          style={{
            color: `${isToggle === true ? "#c78437" : "#222"}`,
            padding: "0px 5px 0px 0px",
          }}
        />
        {props.due}
      </p>
      <span className={styles["id-item"]}>
        <FontAwesomeIcon
          icon={faThumbtack}
          style={{ color: "#222", padding: "0px 5px 0px 2px" }}
        />
        {props.visibleId}
      </span>
      <span className={styles["flag"]}>
        <FontAwesomeIcon
          icon={faFlag}
          style={{
            color: `${props.priority === "Important" ? "#c78437" : "#ccc"}`,
          }}
        />
      </span>
    </div>
  );
};

export default ColumnItem;
