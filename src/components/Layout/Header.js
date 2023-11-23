import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Switch from "../UI/Switch";
import ThemeModeContext from "../../contextAPI/theme-mode-context";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Header = (props) => {
  const ctxTheme = useContext(ThemeModeContext);

  return (
    <div className={styles["header"]}>
      <div className={styles["inner-container"]}>
        <FontAwesomeIcon
          icon={faEllipsis}
          style={{ color: "#ffffff", cursor: "pointer", fontSize: "1.25rem" }}
          onClick={props.onClick}
        />
        <Link to="/home" className={styles.link}>
          <img src="Images/plndo.png" alt="logo" />
        </Link>
      </div>
      <div className={styles["switch-container"]}>
        <div className={styles["switch-mode"]}>
          <FontAwesomeIcon
            icon={faSun}
            style={{ color: "#ccc", fontSize: "12px" }}
          />
          <Switch
            checked={ctxTheme.isToggle}
            onChange={ctxTheme.modeThemeHandler}
          ></Switch>
          <FontAwesomeIcon
            icon={faMoon}
            style={{ color: "#ccc", fontSize: "12px" }}
          />
        </div>
        <img
          src="Images/PlanDo.png"
          alt="plando icon"
          className={styles["icon-img"]}
        />
      </div>
    </div>
  );
};

export default Header;
