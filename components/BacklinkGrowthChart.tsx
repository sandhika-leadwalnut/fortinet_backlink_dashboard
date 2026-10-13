import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BacklinkGrowth } from "../types";

interface BacklinkGrowthChartProps {
  data: BacklinkGrowth[];
}

const BacklinkGrowthChart = ({ data }: BacklinkGrowthChartProps) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 40, left: 30, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            tick={{
              fontSize: 12,
              fill: "#4b5563",
            }}
            stroke="#9ca3af"
            label={{ value: "Month", position: "bottom", offset: 0 }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#9ca3af"
            tick={{
              fontSize: 12,
              fill: "#4b5563",
            }}
            label={{
              value: "Total Backlinks",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="totalBacklinks"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 5 }}
            activeDot={{ r: 8 }}
            name="Total Backlinks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BacklinkGrowthChart;
