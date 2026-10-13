import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { DaDistribution } from "../types";
import { InfoIconFilled } from "./icons";
import {
  CHART_COLORS,
  SECTION_TITLES,
  DA_DISTRIBUTION,
} from "../constants/constants";
import DaDistributionTooltip from "./DaDistributionTooltip";
import SuccessBanner from "./SuccessBanner";
import ChartLegend from "./ChartLegend";

interface DaDistributionChartProps {
  data: DaDistribution[];
}

const DaDistributionChart = ({ data }: DaDistributionChartProps) => {
  const totalDomains = data.reduce((sum, item) => sum + item.value, 0);
  const da41to70 = data.find(
    (item) => item.name === DA_DISTRIBUTION.targetRange
  );
  const da41to70Percentage = da41to70
    ? Math.round((da41to70.value / totalDomains) * 100)
    : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-[#006FCA] hover:shadow-lg hover:border-[#00B6B5] transition-all duration-200">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#575757] mb-2">
          {SECTION_TITLES.backlinkQualityAssurance}
        </h1>
        <div className="flex items-center mb-3">
          <h2 className="text-lg font-bold text-[#575757]">
            {SECTION_TITLES.referringDomainsDA}
          </h2>
          <div className="group relative ml-2">
            <InfoIconFilled className="w-4 h-4 text-[#000000] hover:text-[#006FCA] transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-[#575757] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {DA_DISTRIBUTION.tooltipText}
            </span>
          </div>
        </div>

        <SuccessBanner
          label={DA_DISTRIBUTION.targetRange}
          percentage={da41to70Percentage}
          message={DA_DISTRIBUTION.successMessage}
        />
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 40, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#D1D1D1"
            horizontal={false}
          />
          <XAxis type="number" stroke="#A6A6A6" />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#A6A6A6"
            width={80}
            tick={{ fill: "#575757" }}
            reversed={true}
          />
          <Tooltip
            content={<DaDistributionTooltip />}
            cursor={{ fill: "rgba(157, 167, 180, 0.2)" }}
          />
          <Bar dataKey="value" barSize={35}>
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: "#575757", fontWeight: "bold", fontSize: "12px" }}
            />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  CHART_COLORS.daDistribution[
                    index % CHART_COLORS.daDistribution.length
                  ]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <ChartLegend data={data} colors={CHART_COLORS.daDistribution} />
    </div>
  );
};

export default DaDistributionChart;
