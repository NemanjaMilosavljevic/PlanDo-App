import styles from "./Textarea.module.css";

const Textarea = (props) => {
  let classes = `${styles.textarea} ${props.className}`;
  return (
    <>
      <label className={styles.label} htmlFor={props.textarea.id}>
        {props.label}
      </label>
      <textarea className={classes} {...props.textarea}></textarea>
    </>
  );
};

export default Textarea;
