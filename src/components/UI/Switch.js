import styles from "./Switch.module.css";

const Switch = (props) => {
  return (
    <label className={styles["switch"]}>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      <span className={styles["slider"]} />
    </label>
  );
};

export default Switch;
