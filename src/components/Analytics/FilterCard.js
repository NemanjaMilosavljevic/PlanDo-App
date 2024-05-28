import styles from "./FilterCard.module.css";
import DropdownInput from "../UI/DropdownInput";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chartActions } from "../../store/chart-slice";
import { FilterTasks } from "../../store/chart-slice";
import useHttp from "../../hooks/use-http";

const FilterCard = () => {
  const token = localStorage.getItem("token");
  const { sendRequest } = useHttp();

  const dispatch = useDispatch();
  const chart = useSelector((state) => state.chart);
  const { filteredMonth, filteredPriority } = chart;

  const tasks = useSelector((state) => state.tasks);
  const { initialTasks } = tasks;

  const filterMonthHandler = (event) => {
    dispatch(chartActions.setFilterMonth(event.target.value));
  };

  const filterPriorityHandler = (event) => {
    dispatch(chartActions.setFilterPriority(event.target.value));
  };

  useEffect(() => {
    dispatch(FilterTasks(sendRequest, token, filteredMonth, filteredPriority));
  }, [dispatch, sendRequest, token, filteredMonth, filteredPriority]);

  useEffect(() => {
    dispatch(chartActions.setFilterMonth("All"));
    dispatch(chartActions.setFilterPriority("All"));
    dispatch(chartActions.setFilteredTasks(initialTasks));
  }, [initialTasks, dispatch]);

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
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
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
