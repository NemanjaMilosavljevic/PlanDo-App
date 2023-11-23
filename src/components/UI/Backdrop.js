import styles from "./ModalOverlay.module.css";

const Backdrop = (props) => {
  let classes = `${props.showModal ? styles.backdrop : ""} ${props.className}`;
  return <div className={classes} onClick={props.removeModal}></div>;
};

export default Backdrop;
