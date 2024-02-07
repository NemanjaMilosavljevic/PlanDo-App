import styles from "./FilterCard.module.css";
import DropdownInput from "../UI/DropdownInput";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chartActions } from "../../store/chart-slice";
import { tasksActions } from "../../store/tasks-slice";

const FilterCard = () => {
  const dispatch = useDispatch();
  const chart = useSelector((state) => state.chart);
  const { filteredMonth, filteredPriority } = chart;

  const tasks = useSelector((state) => state.tasks);
  const { isModifiedTask, initialTasks } = tasks;

  const filterMonthHandler = (event) => {
    dispatch(chartActions.setFilterMonth(event.target.value));
  };

  const filterPriorityHandler = (event) => {
    dispatch(chartActions.setFilterPriority(event.target.value));
  };

  useEffect(() => {
    dispatch(
      chartActions.filterTasks({
        initialTasks,
        filteredMonth,
        filteredPriority,
      })
    );
  }, [dispatch, filteredPriority, filteredMonth, initialTasks]);

  useEffect(() => {
    dispatch(chartActions.setFilterMonth("All"));
    dispatch(chartActions.setFilterPriority("All"));
    dispatch(chartActions.setFilteredTasks(initialTasks));

    return () => {
      dispatch(tasksActions.isTaskNotUpdated());
    };
  }, [initialTasks, isModifiedTask, dispatch]);

  return (
    <div className={styles["filter-wrapper"]}>
      <label id={styles.label}>Filter by:</label>
      <DropdownInput
        className={styles["filter-select"]}
        dropdownInput={{
          onChange: filterMonthHandler,
          id: styles["filter-select"],
          value: filteredMonth,
        }}
      >
        <option value="All">Month</option>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </DropdownInput>

      <DropdownInput
        className={styles["filter-select-second"]}
        dropdownInput={{
          onChange: filterPriorityHandler,
          id: styles["filter-select-second"],
          value: filteredPriority,
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
