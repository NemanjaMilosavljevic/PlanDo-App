import styles from "./Input.module.css";
import React from "react";

const Input = ({ label, input, inputRef, className }) => {
  let classes = `${styles.input} ${className}`;

  return (
    <>
      <label className={styles.label} htmlFor={input.id}>
        {label}
      </label>
      <input className={classes} {...input} ref={inputRef} />
    </>
  );
};

export default React.memo(Input);
