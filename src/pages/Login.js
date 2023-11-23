import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useContext } from "react";
import styles from "./Login.module.css";
import AuthContext from "../contextAPI/auth-context";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorModal from "../components/UI/ErrorModal";

const Login = () => {
  const ctxAuth = useContext(AuthContext);

  return (
    <>
      {ctxAuth.error && (
        <ErrorModal onClose={ctxAuth.clearError}>{ctxAuth.error}</ErrorModal>
      )}
      {ctxAuth.isLoading && !ctxAuth.error && (
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
      {!ctxAuth.isLoading && (
        <div className={styles.wrapper}>
          <img src="Images/logo_text.png" alt="Sign In logo" />
          <p className={styles["heading"]}>
            {!ctxAuth.isLogin ? "Sign Up" : "Login"}
          </p>
          <form onSubmit={ctxAuth.login}>
            {ctxAuth.emailInputIsInvalid && (
              <p className="invalid-input">*Email is invalid!</p>
            )}
            <Input
              input={{
                type: "email",
                placeholder: "E-mail",
                value: ctxAuth.enteredEmail,
                onChange: ctxAuth.emailInputHandler,
                onBlur: ctxAuth.emailInputBlurHandler,
              }}
              className={styles.placeholder}
            />
            {ctxAuth.passwordInputIsInvalid && (
              <p className="invalid-input">
                *Password requires minimum 6 characters
              </p>
            )}
            <Input
              input={{
                type: "password",
                placeholder: "Password",
                value: ctxAuth.enteredPassword,
                onChange: ctxAuth.passwordInputHandler,
                onBlur: ctxAuth.passwordInputBlurHandler,
              }}
              className={styles.placeholder}
            />
            {ctxAuth.error && <p className="error-text">{ctxAuth.error}</p>}
            {!ctxAuth.error && (
              <Button
                className={styles.button}
                button={{
                  type: "submit",
                }}
              >
                {!ctxAuth.isLogin ? "Sign Up" : "Login"}
              </Button>
            )}
          </form>
          <p
            onClick={ctxAuth.switchAuthMode}
            className={styles["auth-mode-changer"]}
          >
            {!ctxAuth.isLogin
              ? "Login with existing account"
              : "Create new account"}
          </p>
        </div>
      )}
    </>
  );
};

export default Login;
