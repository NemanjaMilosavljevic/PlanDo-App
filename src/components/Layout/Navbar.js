import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faChartLine,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { faClipboard, faCircleUser } from "@fortawesome/free-regular-svg-icons";
import styles from "./Navbar.module.css";
import NavbarCard from "../UI/NavbarCard";
import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { navbarActions } from "../../store/navbar-slice";
import { authActions, logoutHandler } from "../../store/auth-slice";

let userEmail;

const Navbar = () => {
  if (!userEmail) {
    userEmail = localStorage.getItem("userEmail");
  }

  const dispatch = useDispatch();
  const navbar = useSelector((state) => state.navbar);
  const { isShown, showAccountBar } = navbar;
  const navigate = useNavigate();
  const accountRef = useRef();

  const changeAccountHandler = () => {
    dispatch(logoutHandler());
    dispatch(authActions.resetInputState());
    dispatch(authActions.switchAuthMode());
    navigate({ pathname: "/login" });
  };

  const openAdminPanelHandler = () => {
    navigate({ pathname: "/admin" });
  };

  const signOutHandler = () => {
    dispatch(logoutHandler());
    dispatch(authActions.resetInputState());
  };

  const setNewPasswordHandler = (event) => {
    event.stopPropagation();
    dispatch(navbarActions.hideAccountSettings());
    navigate({ pathname: "/change-password" });
  };

  const onMouseEnterHandler = () => {
    dispatch(navbarActions.showNavbar());
  };
  const onMouseLeaveHandler = () => {
    dispatch(navbarActions.hideNavbar());
  };

  const showAccountHandler = () => {
    dispatch(navbarActions.showAccountSettings());
  };

  useEffect(() => {
    const onCloseOutsideClickHandler = (event) => {
      if (!accountRef.current?.contains(event.target)) {
        dispatch(navbarActions.hideAccountSettings());
      }
    };

    document.addEventListener("click", onCloseOutsideClickHandler, true);
  }, [dispatch]);

  return (
    <>
      <NavbarCard
        className={`${styles["nav-wrapper"]} ${isShown ? styles.show : ""}`}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        <Link to="/create-task" className={styles.link}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon icon={faClipboard} style={{ color: "#000" }} />
          </div>
          {isShown && (
            <span className={styles["first-list-item"]}>Create New Task</span>
          )}
        </Link>

        <Link to="/tasks" className={styles.link}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon icon={faTableColumns} style={{ color: "#000" }} />
          </div>
          {isShown && <span className={styles["span-text"]}>Kanban Board</span>}
        </Link>
        <Link to="/analitycs" className={styles.link}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon
              icon={faChartLine}
              style={{
                color: "#000",
              }}
            />
          </div>
          {isShown && <span className={styles["span-text"]}>Analytics</span>}
        </Link>

        <div onClick={showAccountHandler} className={styles.link}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon icon={faCircleUser} style={{ color: "#000" }} />
          </div>
          {isShown && <span className={styles["span-text"]}>Account</span>}

          <div
            className={`${styles.container} ${
              showAccountBar ? styles.visible : ""
            }`}
            ref={accountRef}
          >
            <ul className={styles.list}>
              <li>
                <p className={styles["no-padding"]}>Account</p>
                <p className={`${styles["no-padding"]} ${styles["bold"]}`}>
                  {userEmail}
                </p>
              </li>
              <li onClick={setNewPasswordHandler}>Change password</li>
              <li onClick={changeAccountHandler}>Change account</li>
              <li onClick={openAdminPanelHandler}>Admin panel</li>
            </ul>
          </div>
        </div>

        <Link to="/register" className={styles.link} onClick={signOutHandler}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              style={{ color: "#000" }}
            />
          </div>
          {isShown && <span className={styles["span-text"]}>Sign out</span>}
        </Link>
      </NavbarCard>
    </>
  );
};

export default Navbar;
