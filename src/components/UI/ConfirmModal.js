import Button from "./Button";
import styles from "./ConfirmModal.module.css";
import CSSTransition from "react-transition-group/CSSTransition";
import { useSelector, useDispatch } from "react-redux";
import { closeConfirmModal } from "../../store/tasks-slice";

const ConfirmModal = () => {
  const dispatch = useDispatch();
  const didCreateTask = useSelector((state) => state.tasks.didCreateTask);

  const closeModal = () => {
    dispatch(closeConfirmModal());
  };

  return (
    <CSSTransition
      timeout={600}
      in={didCreateTask}
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
        <Button className={styles.button} button={{ onClick: closeModal }}>
          Cancel
        </Button>
      </section>
    </CSSTransition>
  );
};

export default ConfirmModal;
