import styles from "./ConfirmModal.module.css";
import CSSTransition from "react-transition-group/CSSTransition";

const ConfirmModal = ({ textField, children, animation, className }) => {
  let classes = `${styles.confirmModal} ${className}`;

  return (
    <CSSTransition
      timeout={600}
      in={animation}
      mountOnEnter
      unmountOnExit
      classNames={{
        enterActive: `${styles.showModal}`,
        enter: "",
        exit: "",
        exitActive: `${styles.closeModal}`,
      }}
    >
      <section className={classes}>
        {textField}
        {children}
      </section>
    </CSSTransition>
  );
};

export default ConfirmModal;
