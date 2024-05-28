import classes from "./AdminPanel.module.css";
import styles from "../components/UI/ModalOverlay.module.css";
import { useEffect } from "react";
import useHttp from "../hooks/use-http";
import { usersActions, deleteUser } from "../store/users-slice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { closeConfirmModal } from "../store/tasks-slice";
import ConfirmModal from "../components/UI/ConfirmModal";
import ReactDOM from "react-dom";

let initialRender = true;

const AdminPanel = () => {
  const { error, clearError, sendRequest } = useHttp();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const {
    users,
    notification,
    isModalOpenForDeletingUser,
    didUserDelete,
    userInfo,
  } = useSelector((state) => state.users);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const deleteUserHandler = (userId, role) => {
    closeModal();
    dispatch(deleteUser(userId, role, sendRequest, token));
  };

  const confirmDeletingTaskHandler = (userId, role) => {
    dispatch(usersActions.openConfirmingModalForDeletingUser({ userId, role }));
    navigate({ pathname: `/admin/${userId}` });
  };

  const closeModal = () => {
    dispatch(closeConfirmModal({ type: "modal" }));
    navigate({ pathname: `/admin` });
  };

  useEffect(() => {
    if (isModalOpenForDeletingUser) {
      dispatch(usersActions.isUserDeleted());
    }
  }, [isModalOpenForDeletingUser, dispatch]);

  useEffect(() => {
    if ((initialRender && path.includes("/admin")) || notification) {
      initialRender = false;

      const fetchUsersHandler = (fetchedUsers) => {
        dispatch(usersActions.retrieveUsers(fetchedUsers));
      };

      sendRequest(
        {
          url: `${process.env.REACT_APP_RESTAPI_ORIGIN}/admin`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
        fetchUsersHandler
      );
    }
  }, [sendRequest, dispatch, token, path, notification]);

  return (
    <>
      {isModalOpenForDeletingUser &&
        ReactDOM.createPortal(
          <ConfirmModal
            animation={didUserDelete}
            textField={<p>Are you sure you want to delete user?</p>}
            children={
              <>
                <div className={styles["confirm-container-buttons"]}>
                  <Button
                    className={styles["button-confirm"]}
                    button={{ onClick: closeModal }}
                  >
                    No
                  </Button>
                  <Button
                    className={styles["button-confirm"]}
                    button={{
                      onClick: deleteUserHandler.bind(
                        null,
                        userInfo.userId,
                        userInfo.role
                      ),
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </>
            }
          ></ConfirmModal>,
          document.getElementById("confirm-modal")
        )}
      {error && (
        <Modal onClose={clearError} type="error">
          {error}
        </Modal>
      )}
      {notification && (
        <Modal
          onClose={() => dispatch(usersActions.resetNotification())}
          type="notification"
        >
          {notification}
        </Modal>
      )}
      <div className={classes.wrapper}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th scope="col" style={{ width: "10%" }}>
                ID
              </th>
              <th scope="col" style={{ width: "40%" }}>
                Email
              </th>
              <th scope="col" style={{ width: "20%" }}>
                Role
              </th>
              <th scope="col" style={{ width: "30%" }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id} style={{ height: "70px" }}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      className={classes["delete-button"]}
                      button={{
                        onClick: confirmDeletingTaskHandler.bind(
                          null,
                          user.id,
                          user.role
                        ),
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPanel;
