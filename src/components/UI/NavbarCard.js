import styles from "./NavbarCard.module.css";

const NavbarCard = (props) => {
  return (
    <div
      className={props.className}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <ul>
        <li className={styles["bold-text"]}>{props.children[0]}</li>
        <li>{props.children[1]} </li>
        <li>{props.children[2]}</li>
      </ul>
      <ul id={styles["acc-list"]}>
        <li>{props.children[3]}</li>
        <li>{props.children[4]}</li>
      </ul>
    </div>
  );
};

export default NavbarCard;
