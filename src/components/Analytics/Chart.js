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
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Chart = () => {
  const filteredTasks = useSelector((state) => state.chart.filteredTasks);

  const filteredData = useMemo(() => {
    const totalTasks = (status) => {
      const filteredItems = filteredTasks.filter((task) => {
        return task.status === status;
      });
      return filteredItems.length;
    };

    return [
      { name: "To do", value: totalTasks("To Do") },
      { name: "In progress", value: totalTasks("In progress") },
      { name: "Done", value: totalTasks("Done") },
    ];
  }, [filteredTasks]);

  return (
    <div className={styles["container"]}>
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
