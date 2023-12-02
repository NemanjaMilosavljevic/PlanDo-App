import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Layout/Navbar";
import TaskForm from "./pages/TaskForm";
import Header from "./components/Layout/Header";
import Ilustration from "./components/Ilustrations/Ilustration";
import Kanban from "./pages/Kanban";
import IlustrationBackground from "./pages/IlustrationBackground";
import AnalyticsCard from "./pages/AnalitycsCard";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import styles from "./components/Ilustrations/Ilustration.module.css";
import TasksContext from "./contextAPI/tasks-context";
import { Route, Routes, Navigate, NavLink } from "react-router-dom";
import ChangePassword from "./pages/ChangePassword";
import { useDispatch, useSelector } from "react-redux";
import { themeActions } from "./store/theme-slice";
import { setDarkMode } from "./store/theme-slice";
import { setLightMode } from "./store/theme-slice";

const App = () => {
  const ctxTasks = useContext(TasksContext);
  const dispatch = useDispatch();

  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);

  const navbarAndHeaderIsShown = useSelector(
    (state) => state.navbar.navbarAndHeaderIsShown
  );
  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  console.log("RENDERING APP");

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
    <>
      {isUserLoggedIn && navbarAndHeaderIsShown && <Header />}
      {isUserLoggedIn && navbarAndHeaderIsShown && <Navbar />}

      <Routes>
        {isUserLoggedIn && (
          <Route
            element={ReactDOM.createPortal(
              <IlustrationBackground />,
              document.getElementById("ilustration-bg")
            )}
            path="/home"
          ></Route>
        )}
        {isUserLoggedIn && (
          <Route element={<TaskForm />} path="/create-task"></Route>
        )}
        {isUserLoggedIn && <Route element={<Kanban />} path="/kanban"></Route>}
        {isUserLoggedIn && (
          <Route element={<AnalyticsCard />} path="/analitics"></Route>
        )}
        {!isUserLoggedIn ? (
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
        {isUserLoggedIn && (
          <Route path="/update-password" element={<ChangePassword />}></Route>
        )}
        <Route path="/sign-in" element={<Login />}></Route>
        {isUserLoggedIn ? (
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
