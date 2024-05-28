import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Layout/Navbar";
import TaskForm from "./pages/TaskForm";
import Header from "./components/Layout/Header";
import Ilustration from "./components/Ilustrations/Ilustration";
import Kanban from "./pages/Kanban";
import IlustrationBackground from "./pages/IlustrationBackground";
import AnalyticsCard from "./pages/AnalitycsCard";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ChangePassword from "./pages/ChangePassword";
import {
  Route,
  Routes,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tasksActions } from "./store/tasks-slice";
import useHttp from "./hooks/use-http";
import styles from "./components/Ilustrations/Ilustration.module.css";
import AdminPanel from "./pages/AdminPanel";
import { usersActions } from "../src/store/users-slice";
import Modal from "./components/UI/Modal";
import { logoutHandler } from "./store/auth-slice";
import socket from "./socket";

let initialRender = true;

const App = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const { isLoading, sendRequest } = useHttp();
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

  const isModifiedTask = useSelector((state) => state.tasks.isModifiedTask);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const navbarAndHeaderIsShown = useSelector(
    (state) => state.navbar.navbarAndHeaderIsShown
  );
  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const notification = useSelector((state) => state.users.notification);

  useEffect(() => {
    socket.on("users", (data) => {
      if (data.action === "delete") {
        dispatch(usersActions.delete(data.deletedUser));
        dispatch(usersActions.setNotification(data.message));
        dispatch(logoutHandler(data.deletedUser));
      }
      if (data.action === "create") {
        dispatch(usersActions.addUser(data.user));
        dispatch(usersActions.setNotification(data.message));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if ((initialRender && path.includes("/tasks")) || isModifiedTask) {
      initialRender = false;

      const fetchTasksHandler = (fetchedTasks) => {
        dispatch(tasksActions.retrieveInitialTasks(fetchedTasks));
      };

      sendRequest(
        {
          url: `http://localhost:5000/tasks`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
        fetchTasksHandler
      );
    }
  }, [sendRequest, dispatch, isModifiedTask, token, path]);

  return (
    <>
      {isUserLoggedIn && navbarAndHeaderIsShown && <Header />}
      {isUserLoggedIn && navbarAndHeaderIsShown && <Navbar />}
      {notification && (
        <Modal
          onClose={() => dispatch(usersActions.resetNotification())}
          type="notification"
        >
          {notification}
        </Modal>
      )}

      <Routes>
        (<Route path="/landing-page" element={<LandingPage />}></Route>)
        {isUserLoggedIn && (
          <Route
            element={ReactDOM.createPortal(
              <IlustrationBackground />,
              document.getElementById("ilustration-bg")
            )}
            path="/home"
          ></Route>
        )}
        {role === "admin" && (
          <Route element={<AdminPanel />} path="/admin"></Route>
        )}
        {role === "admin" && (
          <Route element={<AdminPanel />} path="/admin/:userId"></Route>
        )}
        {isUserLoggedIn && (
          <Route element={<TaskForm />} path="/create-task"></Route>
        )}
        {isUserLoggedIn && <Route element={<Kanban />} path="/tasks"></Route>}
        {isUserLoggedIn && (
          <Route element={<Kanban />} path="/tasks/edit/:taskId"></Route>
        )}
        {isUserLoggedIn && (
          <Route element={<AnalyticsCard />} path="/analitycs"></Route>
        )}
        {!isUserLoggedIn ? (
          <Route
            path="/"
            element={<Navigate to="/register" />}
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
          <Route path="/change-password" element={<ChangePassword />}></Route>
        )}
        <Route path="/register" element={<Login />}></Route>
        {isLogin && <Route path="/login" element={<Login />}></Route>}
        {isUserLoggedIn ? (
          <Route path="*" element={<PageNotFound />}></Route>
        ) : (
          <Route
            path="*"
            element={<Navigate to="/register" />}
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
              isToggle ? styles["dark"] : ""
            }`}
          />
        </NavLink>
      )}
    </>
  );
};

export default App;
