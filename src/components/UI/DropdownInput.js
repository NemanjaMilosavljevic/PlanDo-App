import styles from "./DropdownInput.module.css";
import React from "react";

const DropdownInput = React.forwardRef((props, ref) => {
  let classes = `${styles.select} ${props.className}`;
  return (
    <>
      <label className={styles.label} htmlFor={props.dropdownInput.id}>
        {props.label}
      </label>
      <select className={classes} {...props.dropdownInput} ref={ref}>
        {props.children}
      </select>
    </>
  );
});

export default DropdownInput;
