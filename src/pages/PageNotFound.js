import { useContext, useEffect } from "react";
import Button from "../components/UI/Button";
import styles from "./PageNotFound.module.css";
import { useNavigate } from "react-router-dom";
import NavbarContext from "../contextAPI/navbar-context";
import ThemeModeContext from "../contextAPI/theme-mode-context";
import Ilustration from "../components/Ilustrations/Ilustration";
import classes from "../components/Ilustrations/IlustrationPageNotFound.module.css";

const PageNotFound = () => {
  const ctxNavbar = useContext(NavbarContext);
  const ctxTheme = useContext(ThemeModeContext);
  const navigate = useNavigate();

  const { hideNabvarAndHeaderHandler, showNabvarAndHeaderHandler } = ctxNavbar;

  const redirectToHomePageHandler = () => {
    navigate({ pathname: "/home" });
    showNabvarAndHeaderHandler();
  };

  useEffect(() => {
    hideNabvarAndHeaderHandler();
  }, [hideNabvarAndHeaderHandler]);

  return (
    <div className={styles.wraper}>
      <p className={styles.text}>Page Not Found!</p>
      <Ilustration
        className={`${classes["ilustration-page-not-found"]}  ${
          ctxTheme.isToggle === true ? classes["dark"] : ""
        }`}
      ></Ilustration>
      <Button
        button={{ onClick: redirectToHomePageHandler }}
        className={styles["button-center"]}
      >
        Go to home page
      </Button>
    </div>
  );
};

export default PageNotFound;
