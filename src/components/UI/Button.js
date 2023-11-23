import styles from "./Button.module.css";

const Button = (props) => {
  let classes = `${styles.button} ${props.className}`;

  return (
    <button className={classes} {...props.button} disabled={props.disabled}>
      {props.children}
    </button>
  );
};

export default Button;
