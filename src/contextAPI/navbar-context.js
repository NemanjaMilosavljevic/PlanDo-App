import React, { useEffect, useState, useRef } from "react";

const NavbarContext = React.createContext({
  isNavbarShowed: true,
  toggleNavbar: () => {},
  showNavbar: () => {},
  hideNavbar: () => {},
  navbarAndHeaderIsShown: true,
  hideNabvarAndHeaderHandler: () => {},
  showNabvarAndHeaderHandler: () => {},
  showAccountSettings: () => {},
  hideAccountSettings: () => {},
  showAccountBar: false,
  accountRef: null,
});

export const NavbarContextProvider = (props) => {
  const [isNavbarShowed, setIsNavbarShowed] = useState(true);
  const [navbarAndHeaderIsShown, setNavbarAndHeaderIsShown] = useState(true);
  const [showAccountBar, setShowAccountBar] = useState(false);

  const accountRef = useRef();

  const hideNabvarAndHeaderHandler = () => {
    setNavbarAndHeaderIsShown(false);
  };

  const showNabvarAndHeaderHandler = () => {
    setNavbarAndHeaderIsShown(true);
  };

  const showNavbarHandler = () => {
    setIsNavbarShowed(true);
  };

  const hideNavbarHandler = () => {
    setIsNavbarShowed(false);
  };

  const toggleNavbarHandler = () => {
    setIsNavbarShowed((prevState) => {
      return !prevState;
    });
  };

  const showAccountSettingsHandler = () => {
    setShowAccountBar(true);
  };

  const hideAccountSettingsHandler = () => {
    setShowAccountBar(false);
  };

  const closeOnOutsideClickHandler = (event) => {
    if (!accountRef.current?.contains(event.target)) {
      setShowAccountBar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeOnOutsideClickHandler, true);
  }, []);

  return (
    <NavbarContext.Provider
      value={{
        isNavbarShowed,
        toggleNavbar: toggleNavbarHandler,
        showNavbar: showNavbarHandler,
        hideNavbar: hideNavbarHandler,
        navbarAndHeaderIsShown,
        hideNabvarAndHeaderHandler: hideNabvarAndHeaderHandler,
        showNabvarAndHeaderHandler: showNabvarAndHeaderHandler,
        showAccountSettings: showAccountSettingsHandler,
        hideAccountSettings: hideAccountSettingsHandler,
        showAccountBar,
        accountRef,
      }}
    >
      {props.children}
    </NavbarContext.Provider>
  );
};

export default NavbarContext;
