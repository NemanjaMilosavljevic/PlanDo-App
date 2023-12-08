import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useEffect } from "react";
import styles from "./Login.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorModal from "../components/UI/ErrorModal";
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
  let tokenData = retrieveStoredToken();
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
    loginFormIsValid,
  } = auth;

  const emailInputHandler = (event) => {
    dispatch(authActions.emailInput(event.target.value));
    dispatch(authActions.isEmailValid());
  };

  const passwordInputHandler = (event) => {
    dispatch(authActions.passwordInput(event.target.value));
    dispatch(authActions.isPasswordValid());
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
  };

  const loginHandlerFunction = (event) => {
    event.preventDefault();

    dispatch(authActions.emailInputBlur());
    dispatch(authActions.passwordInputBlur());
    dispatch(authActions.isLoginFormValid());

    if (!loginFormIsValid) {
      return;
    }

    const userCredentials = {
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    };

    dispatch(loginHandler(userCredentials, sendRequest, auth, navigate));
  };
  console.log(auth);

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
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      {isLoading && !error && (
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
          <p className={styles["heading"]}>
            {!auth.isLogin ? "Sign Up" : "Login"}
          </p>
          <form onSubmit={loginHandlerFunction}>
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
