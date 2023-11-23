import styles from "./NavbarCard.module.css";
import NavbarContext from "../../contextAPI/navbar-context";
import { useContext } from "react";

const NavbarCard = (props) => {
  const ctxNavbar = useContext(NavbarContext);

  return (
    <div
      className={props.className}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <ul>
        <li onClick={ctxNavbar.showCreateTask} className={styles["bold-text"]}>
          {props.children[0]}
        </li>
        <li onClick={ctxNavbar.showKanban}>{props.children[1]} </li>
        <li onClick={ctxNavbar.showAnalitycs}>{props.children[2]}</li>
      </ul>
      <ul id={styles["acc-list"]}>
        <li>{props.children[3]}</li>
        <li>{props.children[4]}</li>
      </ul>
    </div>
  );
};

export default NavbarCard;
