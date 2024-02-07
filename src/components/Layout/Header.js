import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Switch from "../UI/Switch";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setDarkMode,
  setLightMode,
  themeActions,
} from "../../store/theme-slice";
import { navbarActions } from "../../store/navbar-slice";

let initialRender = true;

const Header = () => {
  const userId = localStorage.getItem("localId");
  const theme = useSelector((state) => state.theme);
  const { switchIsToggle, usersModePreference } = theme;
  const dispatch = useDispatch();

  const existingUser = document.cookie.includes(`userModePreference-${userId}`);

  if (initialRender && !existingUser) {
    initialRender = false;
    dispatch(themeActions.setInitialPreferenceMode(userId));
    dispatch(themeActions.isCheckedLightMode());
    dispatch(setLightMode());
  } else if (initialRender && existingUser) {
    initialRender = false;

    const userPreferedMode = JSON.parse(
      document.cookie
        .split(";")
        .map((i) => i.trim())
        .find((item) => item.startsWith(`userModePreference-${userId}=`))
        ?.split("=")[1]
    );

    const mode = userPreferedMode[0].preferedMode;

    if (mode === "dark") {
      dispatch(themeActions.isCheckedDarkMode());
      dispatch(setDarkMode());
    } else {
      dispatch(themeActions.isCheckedLightMode());
      dispatch(setLightMode());
    }
  }

  const changeThemeModeHandler = (event) => {
    const userPreference = {
      user: userId,
      preferedMode: event.target.checked ? "dark" : "light",
    };

    if (event.target.checked) {
      dispatch(themeActions.isCheckedDarkMode());
      dispatch(setDarkMode());
      dispatch(
        themeActions.setUserPreferenceMode({
          userPreference,
          usersModePreference,
        })
      );
    } else {
      dispatch(themeActions.isCheckedLightMode());
      dispatch(setLightMode());
      dispatch(
        themeActions.setUserPreferenceMode({
          userPreference,
          usersModePreference,
        })
      );
    }
  };

  const toggleNavbarHandler = () => {
    dispatch(navbarActions.toggleNavbar());
  };

  const showLandingPage = () => {
    dispatch(navbarActions.hideNavbarAndHeader());
  };

  return (
    <div className={styles["header"]}>
      <div className={styles["inner-container"]}>
        <FontAwesomeIcon
          icon={faEllipsis}
          className={styles.icon}
          onClick={toggleNavbarHandler}
        />
        <Link to="/home" className={styles.link}>
          <img
            src="Images/plndo.png"
            alt="logo"
            title="Go to home page"
            className={styles["icon-img"]}
          />
        </Link>
      </div>
      <div className={styles["switch-container"]}>
        <div className={styles["switch-mode"]}>
          <FontAwesomeIcon
            icon={faSun}
            style={{ color: "#ccc", fontSize: "12px" }}
          />
          <Switch
            checked={switchIsToggle}
            onChange={changeThemeModeHandler}
          ></Switch>
          <FontAwesomeIcon
            icon={faMoon}
            style={{ color: "#ccc", fontSize: "12px" }}
          />
        </div>
        <div className={styles["image-container"]}>
          <Link
            to="/landing-page"
            className={styles.link}
            onClick={showLandingPage}
          >
            <img
              src="Images/PlanDo.png"
              alt="plando icon"
              title="Go to landing page"
              className={styles["icon-img"]}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
