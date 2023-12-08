import styles from "./ModalOverlay.module.css";
import { useSelector } from "react-redux";

const Backdrop = (props) => {
  const isModalShown = useSelector((state) => state.modal.isModalShown);

  let classes = `${isModalShown ? styles.backdrop : ""} ${props.className}`;
  return <div className={classes} onClick={props.removeModal}></div>;
};

export default Backdrop;
