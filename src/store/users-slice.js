import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  userIsDeleted: false,
  notification: "",
  didUserDelete: false,
  isModalOpenForDeletingUser: false,
  userInfo: { userId: "", role: "" },
};

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    retrieveUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      const newUser = action.payload;
      state.users.push(newUser);
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    resetNotification(state, action) {
      state.notification = "";
    },
    delete(state, action) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    isUserDeleted(state) {
      state.didUserDelete = true;
    },
    isUserNotDeleted(state) {
      state.didUserDelete = false;
    },
    openConfirmingModalForDeletingUser(state, action) {
      state.userInfo = action.payload;
      state.isModalOpenForDeletingUser = true;
    },
    closeConfirmingModalForDeletingUser(state) {
      state.userInfo = { userId: "", role: "" };
      state.isModalOpenForDeletingUser = false;
    },
  },
});

export const deleteUser = (userId, role, sendRequest, token) => {
  return async (dispatch) => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_RESTAPI_ORIGIN}/admin/${userId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { role },
      },
      () => {}
    );
  };
};

export const usersActions = usersSlice.actions;

export default usersSlice.reducer;
