import Button from "./Button";
import TasksContext from "../../contextAPI/tasks-context";
import { useContext } from "react";
import styles from "./ConfirmModal.module.css";

import CSSTransition from "react-transition-group/CSSTransition";

const ConfirmModal = () => {
  const ctxTasks = useContext(TasksContext);

  return (
    <CSSTransition
      timeout={600}
      in={ctxTasks.didCreateTask}
      mountOnEnter
      unmountOnExit
      classNames={{
        enterActive: `${styles.showModal}`,
        enter: "",
        exit: "",
        exitActive: `${styles.closeModal}`,
      }}
    >
      <section className={styles.confirmModal}>
        <p>Task was succesfully created!</p>
        <Button
          className={styles.button}
          button={{ onClick: ctxTasks.closeConfirmModal }}
        >
          Cancel
        </Button>
      </section>
    </CSSTransition>
  );
};

export default ConfirmModal;
