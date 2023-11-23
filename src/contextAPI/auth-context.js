import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../hooks/use-http";

const AuthContext = React.createContext({
  token: "",
  enteredEmail: "",
  enteredPassword: "",
  emailInputHandler: () => {},
  passwordInputHandler: () => {},
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
  switchAuthMode: () => {},
  isLogin: false,
  changePassword: () => {},
  newPasswordRef: null,
  loginFormIsValid: false,
  usernameInputIsInvalid: false,
  emailInputIsInvalid: false,
  passwordInputIsInvalid: false,
  emailInputBlurHandler: () => {},
  passwordInputBlurHandler: () => {},
  newPasswordInputIsInvalid: false,
  newPasswordInputHandler: () => {},
  enteredNewPassword: false,
  newPasswordInputBlurHandler: () => {},
  error: null,
  clearError: () => {},
  isLoading: false,
  userId: null,
});

let logoutTimer;

const calculateRemainingTime = (expTime) => {
  const currentTime = new Date().getTime();
  const adjRemainingTime = new Date(expTime).getTime();

  const remainingTime = adjRemainingTime - currentTime;
  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 300000) {
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("localId");
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
  const APIKEY = "AIzaSyAdtDga0Ku0CkUW_a_wCI8Y_B6OeDA3Tw4";
  const tokenData = retrieveStoredToken();
  const initialToken = tokenData?.token;

  const [token, setToken] = useState(initialToken);
  const [isLogin, setIsLogin] = useState(false);

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredNewPassword, setEnteredNewPassword] = useState("");

  const [emailIsTouched, setEmailIsTouched] = useState(false);
  const [passwordIsTouched, setPasswordIsTouched] = useState(false);
  const [newPasswordIsTouched, setNewPasswordIsTouched] = useState(false);

  const enteredEmailIsValid = enteredEmail.trim() !== "";
  const emailInputIsInvalid = !enteredEmailIsValid && emailIsTouched;
  const enteredPasswordIsValid = enteredPassword.length >= 6;
  const passwordInputIsInvalid = !enteredPasswordIsValid && passwordIsTouched;

  const enteredNewPasswordIsValid = enteredNewPassword.length >= 6;
  const newPasswordInputIsInvalid =
    !enteredNewPasswordIsValid && newPasswordIsTouched;

  const loginFormIsValid = enteredPasswordIsValid && enteredEmailIsValid;
  const changePasswordFormIsValid = enteredNewPasswordIsValid;

  const isUserLogin = !!token;

  const navigate = useNavigate();
  const userId = localStorage.getItem("localId") || null;

  const { sendRequest, isLoading, error, clearError } = useHttp();

  const emailInputHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordInputHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const newPasswordInputHandler = (event) => {
    setEnteredNewPassword(event.target.value);
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => {
      return !prevState;
    });

    setEnteredEmail("");
    setEnteredPassword("");
    setEmailIsTouched(false);
    setPasswordIsTouched(false);
  };

  const emailInputBlurHandler = () => {
    setEmailIsTouched(true);
  };

  const passwordInputBlurHandler = () => {
    setPasswordIsTouched(true);
  };

  const newPasswordInputBlurHandler = () => {
    setNewPasswordIsTouched(true);
  };

  const authenticateUser = (authData) => {
    const expirationTime = new Date(
      new Date().getTime() + +authData.expiresIn * 1000
    );

    const remainingTime = calculateRemainingTime(expirationTime);

    setToken(authData.idToken);
    localStorage.setItem("token", authData.idToken);
    localStorage.setItem("expirationTime", expirationTime);
    localStorage.setItem("userEmail", authData.email);
    localStorage.setItem("localId", authData.localId);
    navigate({ pathname: "/home" });

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  const loginHandler = (event) => {
    event.preventDefault();

    setEmailIsTouched(true);
    setPasswordIsTouched(true);

    if (!loginFormIsValid) {
      return;
    }

    const userCredentials = {
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    };

    let urlString;

    if (isLogin) {
      // firebase endpoint for login existing user
      urlString = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`;
    } else {
      // firebase endpoint for signup new user
      urlString = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
    }

    sendRequest(
      {
        url: urlString,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userCredentials,
      },
      authenticateUser
    );

    setEnteredEmail("");
    setEnteredPassword("");
    setEmailIsTouched(false);
    setPasswordIsTouched(false);
  };

  const authenticateChangePassword = () => {
    alert("Succesfully changed password!");
    navigate({ pathname: "/home" });
  };

  const changePasswordHandler = (event) => {
    event.preventDefault();

    setNewPasswordIsTouched(true);

    if (!changePasswordFormIsValid) {
      return;
    }

    const newPasswordInfo = {
      idToken: token,
      password: enteredNewPassword,
      returnSecureToken: true,
    };

    sendRequest(
      // firebase endpoint for changing password
      {
        url: `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${APIKEY}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: newPasswordInfo,
      },
      authenticateChangePassword
    );
    setNewPasswordIsTouched(false);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("localId");
    localStorage.removeItem("expirationTime");
    //setIsLogin(false);
    setEnteredEmail("");
    setEnteredPassword("");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    } else {
      logoutHandler();
    }
  }, [tokenData]);

  return (
    <AuthContext.Provider
      value={{
        token,
        enteredEmail,
        enteredPassword,
        emailInputHandler,
        passwordInputHandler,
        login: loginHandler,
        logout: logoutHandler,
        isLoggedIn: isUserLogin,
        switchAuthMode: switchAuthModeHandler,
        isLogin,
        changePassword: changePasswordHandler,
        loginFormIsValid,
        emailInputIsInvalid,
        passwordInputIsInvalid,
        emailInputBlurHandler,
        passwordInputBlurHandler,
        newPasswordInputIsInvalid,
        newPasswordInputHandler,
        enteredNewPassword,
        newPasswordInputBlurHandler,
        error,
        clearError,
        isLoading,
        userId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
