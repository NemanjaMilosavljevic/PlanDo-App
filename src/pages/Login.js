import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useEffect } from "react";
import styles from "./Login.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "../components/UI/Modal";
import useHttp from "../hooks/use-http";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logoutHandler,
  retrieveStoredToken,
  loginHandler,
  authActions,
} from "../store/auth-slice";

const Login = () => {
  const tokenData = retrieveStoredToken();

  const { sendRequest, isLoading, error, clearError } = useHttp();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {
    enteredEmail,
    enteredPassword,
    emailInputIsInvalid,
    passwordInputIsInvalid,
    isLogin,
    enteredPasswordIsValid,
    enteredEmailIsValid,
    isUserAdmin,
  } = auth;

  const loginFormIsValid = enteredPasswordIsValid && enteredEmailIsValid;

  const emailInputHandler = (event) => {
    dispatch(authActions.emailInput(event.target.value));
    dispatch(authActions.isEmailValid());
  };

  const passwordInputHandler = (event) => {
    dispatch(authActions.passwordInput(event.target.value));
    dispatch(authActions.isPasswordValid());
  };

  const registerAsAdminHandler = (event) => {
    dispatch(authActions.isUserAdmin(event.target.checked));
  };

  const emailInputBlurHandler = () => {
    dispatch(authActions.emailInputBlur());
    dispatch(authActions.isEmailValid());
  };

  const passwordInputBlurHandler = () => {
    dispatch(authActions.passwordInputBlur());
    dispatch(authActions.isPasswordValid());
  };

  const switchAuthModeHandler = () => {
    dispatch(authActions.switchAuthMode());
    dispatch(authActions.resetInputState());
  };

  const loginHandlerFunction = (event) => {
    event.preventDefault();

    dispatch(authActions.emailInputBlur());
    dispatch(authActions.passwordInputBlur());

    if (!loginFormIsValid) {
      return;
    }

    const userCredentials = {
      email: enteredEmail,
      password: enteredPassword,
      isUserAdmin: isUserAdmin,
      returnSecureToken: true,
    };

    dispatch(loginHandler(userCredentials, sendRequest, isLogin, navigate));
  };

  useEffect(() => {
    const signOut = () => {
      dispatch(logoutHandler());
    };

    if (tokenData) {
      setTimeout(signOut, tokenData.duration);
    } else {
      signOut();
    }
  }, [tokenData, dispatch]);

  return (
    <>
      {error && (
        <Modal onClose={clearError} type="error">
          {error}
        </Modal>
      )}
      {isLoading && !error && (
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
          <img src="Images/logo_text.png" alt="Sign In logo" />
          <p className={styles["heading"]}>{!isLogin ? "Sign Up" : "Login"}</p>
          <form onSubmit={loginHandlerFunction} className={styles.form}>
            {emailInputIsInvalid && (
              <p className="invalid-input">*Email is invalid!</p>
            )}
            <Input
              input={{
                type: "email",
                placeholder: "E-mail",
                value: enteredEmail,
                onChange: emailInputHandler,
                onBlur: emailInputBlurHandler,
              }}
              className={styles.placeholder}
            />
            {passwordInputIsInvalid && (
              <p className="invalid-input">
                *Password requires minimum 6 characters
              </p>
            )}
            <Input
              input={{
                type: "password",
                placeholder: "Password",
                value: enteredPassword,
                onChange: passwordInputHandler,
                onBlur: passwordInputBlurHandler,
              }}
              className={styles.placeholder}
            />

            {!isLogin && (
              <label id={styles["admin-check"]}>
                <Input
                  input={{
                    type: "checkbox",
                    id: "checkbox-admin",
                    value: isUserAdmin,
                    onChange: registerAsAdminHandler,
                  }}
                />
                register as admin
              </label>
            )}
            {error && <p className="error-text">{error}</p>}
            {!error && (
              <Button
                className={styles.button}
                button={{
                  type: "submit",
                }}
              >
                {!isLogin ? "Sign Up" : "Login"}
              </Button>
            )}
          </form>
          <p
            onClick={switchAuthModeHandler}
            className={styles["auth-mode-changer"]}
          >
            {!isLogin ? "Login with existing account" : "Create new account"}
          </p>
        </div>
      )}
    </>
  );
};

export default Login;
