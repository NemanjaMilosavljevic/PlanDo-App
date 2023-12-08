import { createSlice } from "@reduxjs/toolkit";

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
    resetInputState(state) {
      state.enteredEmail = "";
      state.enteredPassword = "";
      state.enteredNewPassword = "";
      state.emailIsTouched = false;
      state.passwordIsTouched = false;
      state.newPasswordIsTouched = false;
      state.emailInputIsInvalid = false;
      state.passwordInputIsInvalid = false;
      state.enteredEmailIsValid = false;
      state.enteredPasswordIsValid = false;
      state.enteredNewPasswordIsValid = false;
      state.newPasswordInputIsInvalid = false;
    },
    login(state, action) {
      state.token = action.payload;
      state.isUserLoggedIn = true;
    },
    logout(state) {
      state.token = null;
      state.isUserLoggedIn = false;
    },
  },
});

// Handling login

const authenticateUser = (navigate, dispatch, authData) => {
  dispatch(authActions.login(authData.idToken));
  dispatch(authActions.resetInputState());

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
  window.location.reload();
};

export const loginHandler = (
  userCredentials,
  sendRequest,
  isLogin,
  navigate
) => {
  return async (dispatch) => {
    let urlString;

    if (isLogin) {
      // firebase endpoint for login existing user
      urlString = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
    } else {
      // firebase endpoint for signup new user
      urlString = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`;
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

const authenticateChangePassword = (navigate, dispatch) => {
  dispatch(authActions.resetInputState());
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
        url: `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: newPasswordInfo,
      },
      authenticateChangePassword.bind(null, navigate, dispatch)
    );
    dispatch(authActions.newPasswordInputIsNotTouched());
  };
};

export const authActions = authSlice.actions;

export default authSlice.reducer;
