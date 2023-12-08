import styles from "./Textarea.module.css";
import React from "react";

const Textarea = ({ label, className, textarea }) => {
  let classes = `${styles.textarea} ${className}`;

  return (
    <>
      <label className={styles.label} htmlFor={textarea.id}>
        {label}
      </label>
      <textarea className={classes} {...textarea}></textarea>
    </>
  );
};

export default React.memo(Textarea);
