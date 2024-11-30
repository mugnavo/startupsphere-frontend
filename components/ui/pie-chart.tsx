import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { Investor, Startup } from "~/lib/schemas";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = [
  "#004A98",
  "#00A6FB",
  "#57B8FF",
  "#CCC",
  "#1e1e1e",
  "#ED262A",
  // "#FF6347", // Tomato Red
  // "#32CD32", // Lime Green
  // "#FFD700", // Gold
  // "#00CED1", // Dark Turquoise
  // "#FF69B4", // Hot Pink
  // "#8A2BE2", // Blue Violet
  // "#FF4500", // Orange Red
  // "#20B2AA", // Light Sea Green
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text fontSize={10} x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 14;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text fontSize={14} x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={fill}>
        {name.split(" ").map((word: string, index: number, wordsArray: string[]) => (
          <tspan
            key={index}
            x={cx}
            dy={index === 0 ? `-${(wordsArray.length - 1) * 0.6}em` : "1em"}
          >
            {word}
          </tspan>
        ))}

        <tspan x={cx} fontSize={12} dy="1.5em" fill="#999">
          {percent < 0.0001 ? " " : `${(percent * 100).toFixed(2)}%`}
        </tspan>
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" /> */}
      {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
      {/* <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        width={1}
        fontSize={12}
        textAnchor={textAnchor}
        fill="#333"
      >
        {name
          .split(" ")
          .reverse()
          .map((word: string, index: number) => (
            <tspan key={index} x={ex + (cos >= 0 ? 1 : -1) * 12} dy={index === 0 ? 0 : -15}>
              {word}
            </tspan>
          ))}
      </text>
      <text
        fontSize={12}
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text> */}
    </g>
  );
};

interface Filter {
  name: string;
  isActive: boolean;
}
type StartupStats = {
  views: number;
  likes: number;
  bookmarks: number;
};

export default function PChart({
  startups,
  // filters,
  investor,
}: {
  startups: Startup[];
  // filters: Filter[] | null;
  investor: Investor | null;
}) {
  // const val = filters && filters.map((filter) => filter.name);
  const transformedData = investor
    ? Array.from(["views", "likes", "bookmarks"]).map((item) => {
        const flag = investor[item as keyof StartupStats] === 0;
        return {
          value: flag ? 0.0001 : investor[item as keyof StartupStats],
          name: flag ? `No ${item} data` : `${item.charAt(0).toUpperCase() + item.slice(1)}`,
        };
      })
    : // : val
      //   ? startups.map((startup) => ({
      //       name: startup.companyName,
      //       value:
      //         val.length > 0
      //           ? val.reduce(
      //               (total, stat) => total + startup[stat.toLowerCase() as keyof StartupStats],
      //               0
      //             )
      //           : ((startup.bookmarks + startup.views + startup.likes)) || 0.0001,
      //     }))
      startups.length > 0 ? startups.map((startup) => ({
            name: startup.companyName,
            value: ((startup.bookmarks + startup.views + startup.likes)) || 0.0001,
          }))
      :
      Array.from(["views", "likes", "bookmarks"]).map((item) => {
        const flag = startups.length == 0 || startups[0][item as keyof StartupStats] === 0;
        return {
          value: flag ? 0.0001 : startups[0][item as keyof StartupStats],
          name: flag ? `No ${item} data` : `${item.charAt(0).toUpperCase() + item.slice(1)}`,
        };
      });

  const [state, setState] = useState({
    activeIndex: 0,
  });

  const onPieEnter = (_: any, index: number) => {
    setState({
      activeIndex: index,
    });
  };

  return (
    <div className="absolute h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={100} height={100}>
          <Pie
            activeIndex={state.activeIndex}
            activeShape={renderActiveShape}
            data={transformedData}
            labelLine={false}
            //   label={renderCustomizedLabel}
            cx="50%"
            cy="65%"
            // startAngle={180}
            // endAngle={0}
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
