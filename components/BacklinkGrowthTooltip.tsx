import { REPORT_CONFIG } from "../constants/config";

interface BacklinkGrowthTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const BacklinkGrowthTooltip = ({
  active,
  payload,
  label,
}: BacklinkGrowthTooltipProps) => {
  if (active && payload && payload.length) {
    const payloadMap = new Map(payload.map((p) => [p.name, p]));

    return (
      <div className="bg-white p-3 border border-[#D1D1D1] rounded-md shadow-lg">
        <p className="font-bold mb-2 text-[#575757]">{label}</p>
        <ul className="space-y-1">
          {REPORT_CONFIG.monthOrder.map((month) => {
            const item = payloadMap.get(month);
            if (!item || item.value === undefined || item.value === null)
              return null;

            return (
              <li
                key={month}
                className="flex justify-between items-center text-sm"
              >
                <span
                  style={{ color: item.color, textTransform: "capitalize" }}
                >
                  {item.name}:
                </span>
                <span
                  className="font-semibold ml-4"
                  style={{ color: item.color }}
                >
                  {item.value}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return null;
};

export default BacklinkGrowthTooltip;
