import styles from "./ErrorModal.module.css";
import React from "react";
import Button from "./Button";

const ErrorModal = React.memo((props) => {
  return (
    <>
      <div className={styles.backdrop} onClick={props.onClose}></div>
      <div className={styles["error-modal"]}>
        <h2>Error Occured!</h2>
        <p>{props.children}</p>
        <div className={styles["error-modal-actions"]}>
          <Button button={{ onClick: props.onClose }}>Close</Button>
        </div>
      </div>
    </>
  );
});

export default ErrorModal;
