import styles from "./Button.module.css";
import React from "react";

const Button = ({ children, className, disabled, button }) => {
  let classes = `${styles.button} ${className}`;

  return (
    <button className={classes} {...button} disabled={disabled}>
      {children}
    </button>
  );
};

export default React.memo(Button);
