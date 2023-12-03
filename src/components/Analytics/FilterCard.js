import styles from "./FilterCard.module.css";
import DropdownInput from "../UI/DropdownInput";
import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chartActions } from "../../store/chart-slice";
import { tasksActions } from "../../store/tasks-slice";

const FilterCard = () => {
  const monthRef = useRef();
  const priorityRef = useRef();

  const dispatch = useDispatch();
  const chart = useSelector((state) => state.chart);
  const { filteredMonth, filteredPriority } = chart;

  const tasks = useSelector((state) => state.tasks);
  const { isModifiedTask, initialTasks } = tasks;

  const filterMonthHandler = (event) => {
    dispatch(chartActions.setFilterMonth(event.target.value));
    dispatch(chartActions.filterTasks({ initialTasks, monthRef, priorityRef }));
  };

  const filterPriorityHandler = (event) => {
    dispatch(chartActions.setFilterPriority(event.target.value));
    dispatch(chartActions.filterTasks({ initialTasks, monthRef, priorityRef }));
  };

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
        inputRef={monthRef}
        className={styles["filter-select"]}
        dropdownInput={{
          onChange: filterMonthHandler,
          id: styles["filter-select"],
          value: filteredMonth,
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
        inputRef={priorityRef}
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
