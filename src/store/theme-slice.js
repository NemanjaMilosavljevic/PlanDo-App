import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  switchIsToggle: false,
  usersModePreference: [],
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    isCheckedDarkMode(state) {
      state.switchIsToggle = true;
    },
    isCheckedLightMode(state) {
      state.switchIsToggle = false;
    },
    setInitialPreferenceMode(state, action) {
      const userId = action.payload;
      const inititalUserPreference = {
        user: userId,
        preferedMode: "light",
      };

      state.usersModePreference.push(inititalUserPreference);

      document.cookie = `userModePreference-${userId}=${JSON.stringify(
        state.usersModePreference
      )}; max-age=3600`;
    },
    setUserPreferenceMode(state, action) {
      const { userPreference, usersModePreference } = action.payload;

      const userModePreference = usersModePreference?.filter(
        (user) => user.user === userPreference.user
      )[0];
      const userExist = !!userModePreference;

      let updatedModePreferences;

      if (!userExist) {
        state.usersModePreference.push(userPreference);
        document.cookie = `userModePreference-${
          userPreference.user
        }=${JSON.stringify(state.usersModePreference)}; max-age=3600`;
      } else {
        updatedModePreferences = usersModePreference.map((user) => {
          if (user.user === userPreference.user) {
            return { ...userPreference };
          } else {
            return { ...user };
          }
        });
        state.usersModePreference = updatedModePreferences;
        document.cookie = `userModePreference-${
          userPreference.user
        }=${JSON.stringify(updatedModePreferences)}; max-age=3600`;
      }
    },
  },
});

export const setDarkMode = () => {
  return () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("mode", "dark");
  };
};

export const setLightMode = () => {
  return () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("mode", "light");
  };
};

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
