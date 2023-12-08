import styles from "./Login.module.css";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorModal from "../components/UI/ErrorModal";
import { authActions } from "../store/auth-slice";
import { useSelector, useDispatch } from "react-redux";
import useHttp from "../hooks/use-http";
import { changePasswordHandler } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";

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

    dispatch(authActions.newPasswordInputBlur());

    if (!changePasswordFormIsValid) {
      return;
    }

    const newPasswordInfo = {
      idToken: token,
      password: enteredNewPassword,
      returnSecureToken: true,
    };

    dispatch(changePasswordHandler(newPasswordInfo, sendRequest, navigate));
  };

  return (
    <>
      {isLoading && (
        <ClipLoader
          color={"#c78437"}
          loading={true}
          cssOverride={{
            position: "fixed",
            inset: "280px 0 0 630px",
          }}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
      {!isLoading && (
        <div className={styles.wrapper}>
          <img src="Images/logo_text.png" alt="Sign In logo" />
          <form onSubmit={changePasswordHandlerFunction}>
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

            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
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
