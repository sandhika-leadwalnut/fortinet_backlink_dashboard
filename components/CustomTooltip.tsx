import { REPORT_CONFIG } from "@/constants/config";

export const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">
          {payload[0].payload.name}
        </p>
        <p className="text-blue-600">
          Baseline ({REPORT_CONFIG.baselinePeriod}):{" "}
          {payload[0].payload.baseline.toLocaleString()}
        </p>
        <p className="text-green-600">
          Current ({REPORT_CONFIG.currentPeriod}):{" "}
          {payload[0].payload.current.toLocaleString()}
        </p>
        <p className="text-orange-600 font-semibold mt-1">
          Growth: {payload[0].payload.growth}%
        </p>
      </div>
    );
  }
  return null;
};
