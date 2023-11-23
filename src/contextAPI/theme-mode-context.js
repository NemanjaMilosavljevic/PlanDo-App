import React, { useState, useEffect } from "react";

const ThemeModeContext = React.createContext({
  isToggle: false,
  modeThemeHandler: () => {},
});

export const ThemeModeContextProvider = (props) => {
  const [isToggle, setIsToggled] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode === "dark") {
      setDarkMode();
      setIsToggled(true);
      return;
    }

    setLightMode();
    setIsToggled(false);
  }, []);

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("mode", "dark");
    setIsToggled(true);
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("mode", "light");
    setIsToggled(false);
  };

  const modeThemeHandler = (event) => {
    if (event.target.checked) {
      setDarkMode();
    } else {
      setLightMode();
    }
  };
  return (
    <ThemeModeContext.Provider
      value={{
        isToggle,
        modeThemeHandler,
      }}
    >
      {props.children}
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeContext;
