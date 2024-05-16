"use client";
import { PureComponent } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Startup } from "~/lib/schemas";

const data = [
  {
    name: "Page A",
    likes: 5000,
    favorites: 3400,
    views: 200,
    amt: 2400,
    date: new Date("2023-01-01"),
  },
  {
    name: "Page B",
    likes: 6000,
    favorites: 7400,
    views: 800,
    amt: 2210,
    date: new Date("2023-02-02"),
  },
  {
    name: "Page C",
    likes: 4000,
    favorites: 2400,
    views: 100,
    amt: 2290,
    date: new Date("2022-03-03"),
  },
  {
    name: "Page D",
    likes: 4400,
    favorites: 3400,
    views: 100,
    amt: 2290,
    date: new Date("2022-03-03"),
  },
];

interface LChartProps {
  startups: Startup[];
}
export default class LChart extends PureComponent<LChartProps> {
  render() {
    const { startups } = this.props;
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={250}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="favorites" stroke="#82ca9d" />
          <Line type="monotone" dataKey="views" stroke="#828888" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
