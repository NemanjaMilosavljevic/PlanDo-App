import styles from "./Modal.module.css";
import Button from "./Button";

const Modal = ({ children, onClose, type }) => {
  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles["modal"]}>
        <h2>{type === "error" ? "Error Occured!" : "Notification"}</h2>
        <p>{children}</p>
        <div className={styles["modal-actions"]}>
          <Button button={{ onClick: onClose }}>Close</Button>
        </div>
      </div>
    </>
  );
};

export default Modal;
