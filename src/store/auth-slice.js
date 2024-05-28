import { createSlice } from "@reduxjs/toolkit";
import { usersActions } from "./users-slice";

let logoutTimer;

//Auto logout whene token expires and retrieving stored token

const calculateRemainingTime = (expDate) => {
  const currentTime = new Date().getTime();
  const adjRemainingTime = new Date(expDate).getTime();

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
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

export const logoutHandler = (id) => {
  return (dispatch) => {
    if (id) {
      const currentUser = localStorage.getItem("userId");
      if (id === currentUser) {
        dispatch(authActions.logout({ id, currentUser }));
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("expirationTime");
        localStorage.removeItem("role");
        return;
      }
      return;
    }

    dispatch(authActions.logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("role");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };
};

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
  isUserAdmin: false,
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
    logout(state, action) {
      if (!action.payload) {
        state.token = null;
        state.isUserLoggedIn = false;
        return;
      }
      const { id, currentUser } = action.payload;

      if (id === currentUser) {
        state.token = null;
        state.isUserLoggedIn = false;
      }
    },
    isUserAdmin(state, action) {
      state.isUserAdmin = action.payload;
    },
  },
});

const authenticateUser = (navigate, dispatch, authData) => {
  dispatch(authActions.login(authData.token));
  dispatch(authActions.resetInputState());

  // Setting timer for auto logout
  const expirationDate = new Date(
    new Date().getTime() + authData.expiresIn * 1000
  );
  const remainingTime = calculateRemainingTime(expirationDate);
  logoutTimer = setTimeout(logoutHandler, remainingTime);

  localStorage.setItem("token", authData.token);
  localStorage.setItem("expirationTime", expirationDate);
  localStorage.setItem("userEmail", authData.email);
  localStorage.setItem("userId", authData.userId);
  localStorage.setItem("role", authData.role);
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
      urlString = `http://localhost:5000/login`;
    } else {
      urlString = `http://localhost:5000/register`;
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
      isLogin
        ? authenticateUser.bind(null, navigate, dispatch)
        : () => {
            dispatch(authActions.resetInputState());
            dispatch(authActions.switchAuthMode());
            navigate({ pathname: "/login" });
          }
    );
  };
};

const authenticateChangePassword = (navigate, dispatch, data) => {
  dispatch(authActions.resetInputState());
  dispatch(usersActions.setNotification(data.message));
  navigate({ pathname: "/home" });
};

export const changePasswordHandler = (
  newPasswordInfo,
  sendRequest,
  navigate,
  token
) => {
  return (dispatch) => {
    sendRequest(
      {
        url: `http://localhost:5000/change-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
