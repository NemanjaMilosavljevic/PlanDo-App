import { useEffect } from "react";
import Button from "../components/UI/Button";
import styles from "./PageNotFound.module.css";
import { useNavigate } from "react-router-dom";
import Ilustration from "../components/Ilustrations/Ilustration";
import classes from "../components/Ilustrations/IlustrationPageNotFound.module.css";
import { useSelector, useDispatch } from "react-redux";
import { navbarActions } from "../store/navbar-slice";

const PageNotFound = () => {
  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const navbarAndHeaderIsShown = useSelector(
    (state) => state.navbar.navbarAndHeaderIsShown
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectToHomePageHandler = () => {
    navigate({ pathname: "/home" });
    dispatch(navbarActions.showNavbarAndHeader());
  };

  useEffect(() => {
    dispatch(navbarActions.hideNavbarAndHeader());
  }, [navbarAndHeaderIsShown, dispatch]);

  return (
    <div className={styles.wraper}>
      <p className={styles.text}>Page Not Found!</p>
      <Ilustration
        className={`${classes["ilustration-page-not-found"]}  ${
          isToggle ? classes["dark"] : ""
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
