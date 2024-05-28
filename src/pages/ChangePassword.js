import styles from "./Login.module.css";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "../components/UI/Modal";
import { authActions } from "../store/auth-slice";
import { useSelector, useDispatch } from "react-redux";
import useHttp from "../hooks/use-http";
import { changePasswordHandler } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";
import { usersActions } from "../store/users-slice";

const ChangePassword = () => {
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {
    newPasswordInputIsInvalid,
    enteredNewPassword,
    enteredNewPasswordIsValid,
    token,
  } = auth;

  const notification = useSelector((state) => state.users.notification);

  const changePasswordFormIsValid = enteredNewPasswordIsValid;

  const newPasswordInputHandler = (event) => {
    dispatch(authActions.newPasswordInput(event.target.value));
    dispatch(authActions.isNewPasswordValid());
  };

  const newPasswordInputBlurHandler = () => {
    dispatch(authActions.newPasswordInputBlur());
    dispatch(authActions.isNewPasswordValid());
  };

  const changePasswordHandlerFunction = (event) => {
    event.preventDefault();

    if (!changePasswordFormIsValid) {
      return;
    }

    dispatch(authActions.newPasswordInputBlur());

    const newPasswordInfo = {
      password: enteredNewPassword,
    };

    dispatch(
      changePasswordHandler(newPasswordInfo, sendRequest, navigate, token)
    );
  };

  return (
    <>
      {isLoading && (
        <ClipLoader
          color={"#c78437"}
          loading={true}
          cssOverride={{
            position: "fixed",
            left: "50%",
            top: "40%",
          }}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
      {!isLoading && (
        <div className={styles.wrapper}>
          <img
            src="Images/logo_text.png"
            alt="Sign In logo"
            className={styles.image}
          />
          <form
            onSubmit={changePasswordHandlerFunction}
            className={styles.form}
          >
            {newPasswordInputIsInvalid && (
              <p className="invalid-input">
                *Password requires minimum 6 characters
              </p>
            )}
            <Input
              input={{
                type: "password",
                placeholder: "New Password",
                onBlur: newPasswordInputBlurHandler,
                onChange: newPasswordInputHandler,
                value: enteredNewPassword,
              }}
              className={styles.placeholder}
            />

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
            {!error && (
              <Button className={styles.button} button={{ type: "submit" }}>
                Change Password
              </Button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
