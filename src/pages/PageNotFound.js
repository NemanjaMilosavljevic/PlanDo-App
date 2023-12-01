import { useContext, useEffect } from "react";
import Button from "../components/UI/Button";
import styles from "./PageNotFound.module.css";
import { useNavigate } from "react-router-dom";
import NavbarContext from "../contextAPI/navbar-context";
import Ilustration from "../components/Ilustrations/Ilustration";
import classes from "../components/Ilustrations/IlustrationPageNotFound.module.css";
import { useSelector } from "react-redux";

const PageNotFound = () => {
  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const ctxNavbar = useContext(NavbarContext);
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
          isToggle === true ? classes["dark"] : ""
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
