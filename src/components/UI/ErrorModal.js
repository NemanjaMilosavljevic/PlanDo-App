import styles from "./ErrorModal.module.css";
import Button from "./Button";

const ErrorModal = ({ children, onClose }) => {
  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles["error-modal"]}>
        <h2>Error Occured!</h2>
        <p>{children}</p>
        <div className={styles["error-modal-actions"]}>
          <Button button={{ onClick: onClose }}>Close</Button>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
