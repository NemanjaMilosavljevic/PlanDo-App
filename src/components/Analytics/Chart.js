import React, { useContext } from "react";
import TasksContext from "../../contextAPI/tasks-context";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import styles from "./Chart.module.css";

const Chart = () => {
  const ctxTask = useContext(TasksContext);

  const sumToDo = () => {
    const filteredItems = ctxTask.filterState.filteredTasks.filter((task) => {
      return task.status === "To do";
    });
    return filteredItems.length;
  };

  const sumInProgress = () => {
    const filteredItems = ctxTask.filterState.filteredTasks.filter((task) => {
      return task.status === "In progress";
    });
    return filteredItems.length;
  };

  const sumDone = () => {
    const filteredItems = ctxTask.filterState.filteredTasks.filter((task) => {
      return task.status === "Done";
    });
    return filteredItems.length;
  };

  const filteredData = [
    { name: "To do", value: sumToDo() },
    { name: "In progress", value: sumInProgress() },
    { name: "Done", value: sumDone() },
  ];

  return (
    <div className={styles["cont"]}>
      <ResponsiveContainer width="90%" height={300}>
        <BarChart
          width="30%"
          height={300}
          data={filteredData}
          margin={{
            top: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            fontWeight={500}
            axisLine={false}
            style={{ fill: "#c78437" }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: "Number of tasks",
              angle: -90,
              fill: "#ccc",
            }}
            hide={true}
          />
          <Tooltip cursor={{ fill: "#c78437", opacity: 0.1 }} />
          <Bar
            dataKey="value"
            maxBarSize={25}
            background={false}
            fill="#c78437"
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
