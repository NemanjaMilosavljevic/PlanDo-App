import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faChartLine,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { faClipboard, faCircleUser } from "@fortawesome/free-regular-svg-icons";
import styles from "./Navbar.module.css";
import NavbarCard from "../UI/NavbarCard";
import React, { useContext } from "react";
import NavbarContext from "../../contextAPI/navbar-context";
import AuthContext from "../../contextAPI/auth-context";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const ctxNavbar = useContext(NavbarContext);
  const ctxAuth = useContext(AuthContext);
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const changeAccountHandler = () => {
    ctxAuth.logout();
    navigate({ pathname: "/sign-in" });
  };

  const setNewPasswordHandler = (event) => {
    event.stopPropagation();
    ctxNavbar.hideAccountSettings();
    navigate({ pathname: "/update-password" });
  };

  return (
    <>
      <NavbarCard
        className={styles["nav-wrapper"]}
        onMouseEnter={ctxNavbar.showNavbar}
        onMouseLeave={ctxNavbar.hideNavbar}
      >
        <Link to="/create-task" className={styles.link}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon icon={faClipboard} style={{ color: "#000" }} />
            {ctxNavbar.isNavbarShowed && <span>Create New Task</span>}
          </div>
        </Link>

        <Link to="/kanban" className={styles.link}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon icon={faTableColumns} style={{ color: "#000 " }} />
            {ctxNavbar.isNavbarShowed && (
              <span className={styles["span-text"]}>Kanban Board</span>
            )}
          </div>
        </Link>
        <Link to="/analitics" className={styles.link}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon
              icon={faChartLine}
              style={{
                color: "#000",
              }}
            />
            {ctxNavbar.isNavbarShowed && (
              <span className={styles["span-text"]}>Analitycs</span>
            )}
          </div>
        </Link>

        <div
          className={styles.flexcont}
          onClick={ctxNavbar.showAccountSettings}
        >
          <FontAwesomeIcon icon={faCircleUser} style={{ color: "#000" }} />
          {ctxNavbar.isNavbarShowed && (
            <span className={styles["span-text"]}>Account</span>
          )}

          <div
            className={`${styles.container} ${
              ctxNavbar.showAccountBar ? styles.visible : ""
            }`}
            id="proba"
            ref={ctxNavbar.accountRef}
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
            </ul>
          </div>
        </div>

        <Link to="/sign-in" className={styles.link} onClick={ctxAuth.logout}>
          <div className={styles.flexcont}>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              style={{ color: "#000" }}
            />
            {ctxNavbar.isNavbarShowed && (
              <span className={styles["span-text"]}>Sign out</span>
            )}
          </div>
        </Link>
      </NavbarCard>
    </>
  );
};

export default Navbar;
