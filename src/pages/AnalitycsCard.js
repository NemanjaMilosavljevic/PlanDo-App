import Chart from "../components/Analytics/Chart";
import FilterCard from "../components/Analytics/FilterCard";
import Ilustration from "../components/Ilustrations/Ilustration";
import styles from "./AnalitycsCard.module.css";
import classes from "../components/Ilustrations/IlustrationAnalitycs.module.css";
import ThemeModeContext from "../contextAPI/theme-mode-context";
import { useContext } from "react";

const AnalyticsCard = () => {
  const ctxTheme = useContext(ThemeModeContext);

  return (
    <div className={styles["card-analitycs"]}>
      <div className={styles["inner-container"]}>
        <div className={styles["heading-analitycs"]}>
          <h1>Analitycs</h1>
          <h3>Keep tracking your progress</h3>
        </div>
        <FilterCard></FilterCard>
        <Chart></Chart>
      </div>
      <Ilustration
        className={`${classes["ilustration-analitycs"]} ${
          ctxTheme.isToggle === true ? classes["dark"] : ""
        }`}
      ></Ilustration>
    </div>
  );
};

export default AnalyticsCard;
