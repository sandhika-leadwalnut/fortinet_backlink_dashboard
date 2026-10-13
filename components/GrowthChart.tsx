import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const GrowthChart = ({
  data,
  title,
  maxVal,
}: {
  data: { name: string; value: number }[];
  title: string;
  maxVal: number;
}) => {
  const startValue = data[0]?.value || 0;
  const endValue = data[data.length - 1]?.value || 0;
  let growthText = "";
  let growthColor = "text-gray-800";

  if (startValue > 0) {
    const growth = ((endValue - startValue) / startValue) * 100;
    growthText = `(${growth >= 0 ? "+" : ""}${growth.toFixed(0)}%)`;
    if (growth > 0) growthColor = "text-green-600";
    else if (growth < 0) growthColor = "text-red-600";
  } else if (endValue > 0) {
    growthText = "(New Growth)";
    growthColor = "text-green-600";
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-1">
        {title}
      </h3>
      {growthText && (
        <p className={`text-sm font-bold text-center ${growthColor} mb-3`}>
          {growthText}
        </p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          barCategoryGap="40%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#D1D1D1"
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#A6A6A6" }}
            stroke="#000000"
          />
          <YAxis
            domain={[0, maxVal]}
            allowDecimals={false}
            axisLine={{ stroke: "#A6A6A6" }}
            stroke="#000000"
            width={40}
          />
          <Tooltip
            cursor={{ fill: "rgba(157, 167, 180, 0.3)" }}
            contentStyle={{
              background: "white",
              border: "1px solid #D1D1D1",
              borderRadius: "0.375rem",
              padding: "8px 12px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
                    <p className="text-gray-700 font-medium">{label}</p>
                    <p className="text-blue-600 font-bold">
                      Value: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: "#575757", fontWeight: "bold" }}
            />
            {data.map((entry, index) => {
              const colors = ["#61B178", "#00B6B5", "#006FCA"];
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index] || "#006FCA"}
                />
              );
            })}
          </Bar>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00B6B5"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 4, stroke: "#00B6B5", fill: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
