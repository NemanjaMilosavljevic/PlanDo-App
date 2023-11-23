import styles from "./Input.module.css";

const Input = (props) => {
  let classes = `${styles.input} ${props.className}`;

  return (
    <>
      <label className={styles.label} htmlFor={props.input.id}>
        {props.label}
      </label>
      <input className={classes} {...props.input} ref={props.inputRef} />
    </>
  );
};

export default Input;
