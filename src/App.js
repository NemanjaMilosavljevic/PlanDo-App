import React, { useContext } from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Layout/Navbar";
import TaskForm from "./pages/TaskForm";
import Header from "./components/Layout/Header";
import Ilustration from "./components/Ilustrations/Ilustration";
import Kanban from "./pages/Kanban";
import IlustrationBackground from "./pages/IlustrationBackground";
import AnalyticsCard from "./pages/AnalitycsCard";
import NavbarContext from "./contextAPI/navbar-context";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import styles from "./components/Ilustrations/Ilustration.module.css";
import TasksContext from "./contextAPI/tasks-context";
import { Route, Routes, Navigate, NavLink } from "react-router-dom";
import AuthContext from "./contextAPI/auth-context";
import ChangePassword from "./pages/ChangePassword";
import { useSelector } from "react-redux";

const App = () => {
  const ctxNavbar = useContext(NavbarContext);
  const ctxAuth = useContext(AuthContext);
  const ctxTasks = useContext(TasksContext);

  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  console.log("RENDERING APP");

  return (
    <>
      {ctxAuth.isLoggedIn && ctxNavbar.navbarAndHeaderIsShown && (
        <Header onClick={ctxNavbar.toggleNavbar} />
      )}
      {ctxAuth.isLoggedIn && ctxNavbar.navbarAndHeaderIsShown && <Navbar />}

      <Routes>
        {ctxAuth.isLoggedIn && (
          <Route
            element={ReactDOM.createPortal(
              <IlustrationBackground />,
              document.getElementById("ilustration-bg")
            )}
            path="/home"
          ></Route>
        )}
        {ctxAuth.isLoggedIn && (
          <Route element={<TaskForm />} path="/create-task"></Route>
        )}
        {ctxAuth.isLoggedIn && (
          <Route element={<Kanban />} path="/kanban"></Route>
        )}
        {ctxAuth.isLoggedIn && (
          <Route element={<AnalyticsCard />} path="/analitics"></Route>
        )}
        {!ctxAuth.isLoggedIn ? (
          <Route
            path="/"
            element={<Navigate to="/sign-in" />}
            replace={true}
          ></Route>
        ) : (
          <Route
            path="/"
            element={<Navigate to="/home" />}
            replace={true}
          ></Route>
        )}
        {ctxAuth.isLoggedIn && (
          <Route path="/update-password" element={<ChangePassword />}></Route>
        )}
        <Route path="/sign-in" element={<Login />}></Route>
        {ctxAuth.isLoggedIn ? (
          <Route path="*" element={<PageNotFound />}></Route>
        ) : (
          <Route
            path="*"
            element={<Navigate to="/sign-in" />}
            replace={true}
          ></Route>
        )}
      </Routes>

      {!ctxTasks.isLoading && (
        <NavLink
          to="/create-task"
          className={(dataLink) =>
            dataLink.isActive ? "show-ilustration" : "hide-ilustration"
          }
        >
          <Ilustration
            className={`${styles["ilustration-newtask"]} ${
              isToggle === true ? styles["dark"] : ""
            }`}
          />
        </NavLink>
      )}
    </>
  );
};

export default App;
