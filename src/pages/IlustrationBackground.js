import styles from "./IlustrationBackground.module.css";
import ThemeModeContext from "../contextAPI/theme-mode-context";
import { useContext } from "react";

const IlustrationBackground = (props) => {
  const ctxTheme = useContext(ThemeModeContext);
  return (
    <div
      className={`${styles["ilustration-bgc"]} ${
        ctxTheme.isToggle === true ? styles["dark"] : ""
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
