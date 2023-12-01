import styles from "./IlustrationBackground.module.css";
import { useSelector } from "react-redux";

const IlustrationBackground = (props) => {
  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  return (
    <div
      className={`${styles["ilustration-bgc"]} ${
        isToggle === true ? styles["dark"] : ""
      }`}
    >
      <div>
        <h2>Organize your everyday</h2>
        <h4>Keep tracking your progress</h4>
      </div>
    </div>
  );
};

export default IlustrationBackground;
