import React, { useEffect } from "react";
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
import { Route, Routes, Navigate, NavLink } from "react-router-dom";
import ChangePassword from "./pages/ChangePassword";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode, setLightMode, themeActions } from "./store/theme-slice";
import { tasksActions } from "./store/tasks-slice";
import useHttp from "./hooks/use-http";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading, sendRequest } = useHttp();
  const userId = localStorage.getItem("localId");
  const isModifiedTask = useSelector((state) => state.tasks.isModifiedTask);

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

  useEffect(() => {
    const fetchTasksHandler = (taskObj) => {
      const initialTasks = [];

      for (const key in taskObj) {
        initialTasks.push({
          title: taskObj[key]?.title,
          description: taskObj[key]?.description,
          priority: taskObj[key]?.priority,
          due: taskObj[key]?.due,
          status: taskObj[key]?.status,
          id: taskObj[key]?.id,
          visibleId: taskObj[key]?.visibleId,
          createdOn: taskObj[key]?.createdOn,
          firebaseId: key,
        });
      }

      dispatch(tasksActions.retrieveInitialTasks(initialTasks));
    };

    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`,
      },
      fetchTasksHandler
    );

    if (isModifiedTask) {
      sendRequest(
        {
          url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`,
        },
        fetchTasksHandler
      );
    }
  }, [sendRequest, userId, dispatch, isModifiedTask]);

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

      {!isLoading && (
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
