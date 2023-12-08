import { createSlice } from "@reduxjs/toolkit";

const APIKEY = "AIzaSyAdtDga0Ku0CkUW_a_wCI8Y_B6OeDA3Tw4";
let logoutTimer;

//Auto logout whene token expires and retrieving stored token

const calculateRemainingTime = (expTime) => {
  const currentTime = new Date().getTime();
  const adjRemainingTime = new Date(expTime).getTime();

  const remainingTime = adjRemainingTime - currentTime;
  return remainingTime;
};

export const retrieveStoredToken = () => {
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

export const logoutHandler = () => {
  return (dispatch) => {
    dispatch(authActions.logout());

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("localId");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };
};

// Initial state

const initialState = {
  token: retrieveStoredToken()?.token,
  enteredEmail: "",
  enteredPassword: "",
  enteredNewPassword: "",
  emailIsTouched: false,
  passwordIsTouched: false,
  newPasswordIsTouched: false,
  isUserLoggedIn: !!retrieveStoredToken()?.token,
  isLogin: false,
  enteredEmailIsValid: false,
  emailInputIsInvalid: false,
  enteredPasswordIsValid: false,
  passwordInputIsInvalid: false,
  enteredNewPasswordIsValid: false,
  newPasswordInputIsInvalid: false,
  changePasswordFormIsValid: false,
  loginFormIsValid: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    isEmailValid(state) {
      state.enteredEmailIsValid = state.enteredEmail.trim() !== "";
      state.emailInputIsInvalid =
        !state.enteredEmailIsValid && state.emailIsTouched;
    },
    isPasswordValid(state) {
      state.enteredPasswordIsValid = state.enteredPassword.length >= 6;
      state.passwordInputIsInvalid =
        !state.enteredPasswordIsValid && state.passwordIsTouched;
    },
    isNewPasswordValid(state) {
      state.enteredNewPasswordIsValid = state.enteredNewPassword.length >= 6;
      state.newPasswordInputIsInvalid =
        !state.enteredNewPasswordIsValid && state.newPasswordIsTouched;
    },
    isChangePasswordFormValid(state) {
      state.changePasswordFormIsValid = state.enteredNewPasswordIsValid;
    },

    isLoginFormValid(state) {
      state.loginFormIsValid =
        state.enteredPasswordIsValid && state.enteredEmailIsValid;
    },
    emailInput(state, action) {
      state.enteredEmail = action.payload;
    },
    passwordInput(state, action) {
      state.enteredPassword = action.payload;
    },
    newPasswordInput(state, action) {
      state.enteredNewPassword = action.payload;
    },
    switchAuthMode(state) {
      state.isLogin = !state.isLogin;
      state.enteredEmail = "";
      state.enteredPassword = "";
      state.emailIsTouched = false;
      state.passwordIsTouched = false;
      state.emailInputIsInvalid = false;
      state.passwordInputIsInvalid = false;
    },
    emailInputBlur(state) {
      state.emailIsTouched = true;
    },
    passwordInputBlur(state) {
      state.passwordIsTouched = true;
    },
    newPasswordInputBlur(state) {
      state.newPasswordIsTouched = true;
    },
    newPasswordInputIsNotTouched(state) {
      state.newPasswordIsTouched = false;
    },
    login(state, action) {
      const token = action.payload;

      state.token = token;
      state.isUserLoggedIn = true;
      state.enteredEmail = "";
      state.enteredPassword = "";
      state.emailIsTouched = false;
      state.passwordIsTouched = false;
      state.emailInputIsInvalid = false;
      state.passwordInputIsInvalid = false;
      state.enteredEmailIsValid = false;
      state.enteredPasswordIsValid = false;
    },
    logout(state) {
      state.token = null;
      state.isUserLoggedIn = false;
      state.enteredEmail = "";
      state.enteredPassword = "";
      state.loginFormIsValid = false;
      state.enteredEmailIsValid = false;
      state.enteredPasswordIsValid = false;
    },
  },
});

// Handling login

const authenticateUser = (navigate, dispatch, authData) => {
  //
  dispatch(authActions.login(authData.idToken));

  // Setting timer for auto logout
  const expirationTime = new Date(
    new Date().getTime() + +authData.expiresIn * 1000
  );
  const remainingTime = calculateRemainingTime(expirationTime);
  logoutTimer = setTimeout(logoutHandler, remainingTime);

  localStorage.setItem("token", authData.idToken);
  localStorage.setItem("expirationTime", expirationTime);
  localStorage.setItem("userEmail", authData.email);
  localStorage.setItem("localId", authData.localId);
  navigate({ pathname: "/home" });
};

export const loginHandler = (userCredentials, sendRequest, auth, navigate) => {
  return async (dispatch) => {
    let urlString;

    if (auth.isLogin) {
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
      authenticateUser.bind(null, navigate, dispatch)
    );
  };
};

// Handling password change

const authenticateChangePassword = (navigate) => {
  alert("Succesfully changed password!");
  navigate({ pathname: "/home" });
};

export const changePasswordHandler = (
  newPasswordInfo,
  sendRequest,
  navigate
) => {
  return (dispatch) => {
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
      authenticateChangePassword.bind(null, navigate)
    );
    dispatch(authActions.newPasswordInputIsNotTouched());
  };
};

export const authActions = authSlice.actions;

export default authSlice.reducer;
