import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Switch from "../UI/Switch";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { themeActions } from "../../store/theme-slice";
import { setDarkMode } from "../../store/theme-slice";
import { setLightMode } from "../../store/theme-slice";

const Header = (props) => {
  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const dispatch = useDispatch();

  const changeThemeModeHandler = (event) => {
    if (event.target.checked) {
      dispatch(themeActions.darkMode());
      dispatch(setDarkMode());
    } else {
      dispatch(themeActions.lightMode());
      dispatch(setLightMode());
    }
  };

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode === "dark") {
      dispatch(themeActions.darkMode());
      dispatch(setDarkMode());
      return;
    }
    dispatch(themeActions.lightMode());
    dispatch(setLightMode());
  }, [dispatch]);

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
          <Switch checked={isToggle} onChange={changeThemeModeHandler}></Switch>
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
