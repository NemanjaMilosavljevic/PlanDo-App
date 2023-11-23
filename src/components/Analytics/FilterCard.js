import { useContext } from "react";
import TasksContext from "../../contextAPI/tasks-context";
import styles from "./FilterCard.module.css";
import DropdownInput from "../UI/DropdownInput";

const FilterCard = () => {
  const ctxTasks = useContext(TasksContext);

  return (
    <div className={styles["filter-wrapper"]}>
      <label id={styles.label}>Filter by:</label>
      <DropdownInput
        ref={ctxTasks.monthRef}
        className={styles["filter-select"]}
        dropdownInput={{
          onChange: ctxTasks.onFilteredMonth,
          id: styles["filter-select"],
          value: ctxTasks.filterState.filteredMonth,
        }}
      >
        <option value="All">Month</option>
        <option value="Januar">Januar</option>
        <option value="Februar">Februar</option>
        <option value="Mart">Mart</option>
        <option value="April">April</option>
        <option value="Mai">Mai</option>
        <option value="Jun">Jun</option>
        <option value="Jul">Jul</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </DropdownInput>

      <DropdownInput
        ref={ctxTasks.priorityRef}
        className={styles["filter-select-second"]}
        dropdownInput={{
          onChange: ctxTasks.onFilteredPriority,
          id: styles["filter-select-second"],
          value: ctxTasks.filterState.filteredPriority,
        }}
      >
        <option value="All">Priority</option>
        <option value="Important">Important</option>
        <option value="Not-important">Not-important</option>
      </DropdownInput>
    </div>
  );
};

export default FilterCard;
