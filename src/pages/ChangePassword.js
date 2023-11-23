import styles from "./Login.module.css";
import React, { useContext } from "react";
import AuthContext from "../contextAPI/auth-context";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorModal from "../components/UI/ErrorModal";

const ChangePassword = () => {
  const ctxAuth = useContext(AuthContext);

  return (
    <>
      {ctxAuth.isLoading && (
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
          <form onSubmit={ctxAuth.changePassword}>
            {ctxAuth.newPasswordInputIsInvalid && (
              <p className="invalid-input">
                *Password requires minimum 6 characters
              </p>
            )}
            <Input
              input={{
                type: "password",
                placeholder: "New Password",
                onBlur: ctxAuth.newPasswordInputBlurHandler,
                onChange: ctxAuth.newPasswordInputHandler,
                value: ctxAuth.enteredNewPassword,
              }}
              className={styles.placeholder}
            />

            {ctxAuth.error && (
              <ErrorModal onClose={ctxAuth.clearError}>
                {ctxAuth.error}
              </ErrorModal>
            )}
            {!ctxAuth.error && (
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
