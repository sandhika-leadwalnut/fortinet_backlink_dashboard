import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, BUSINESS_IMPACT_CHART } from "../constants/constants";
import { REPORT_CONFIG } from "../constants/config";
import { CustomTooltip } from "./CustomTooltip";
import { BusinessImpactCategory } from "../types";

interface OverallRankingsBarChartProps {
  data: BusinessImpactCategory[];
}

const OverallRankingsBarChart = ({ data }: OverallRankingsBarChartProps) => {
  return (
    <div className="relative" style={{ height: BUSINESS_IMPACT_CHART.height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={BUSINESS_IMPACT_CHART.margins}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.gridStroke}
          />
          <XAxis
            dataKey="name"
            angle={0}
            textAnchor="middle"
            height={BUSINESS_IMPACT_CHART.xAxisHeight}
            tick={{
              fill: CHART_COLORS.textGray,
              fontSize: BUSINESS_IMPACT_CHART.fontSize.xAxis,
              fontWeight: 500,
            }}
            interval={0}
          />
                   <YAxis
            tick={{
              fill: CHART_COLORS.textGray,
              fontSize: BUSINESS_IMPACT_CHART.fontSize.yAxis,
            }}
            width={70}
            label={{
              value: "Number of Keywords",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: {
                fill: CHART_COLORS.textGray,
                fontWeight: 600,
                textAnchor: "middle",
              },
            }}
          
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "12px" }} iconType="rect" />
          <Bar
            dataKey="baseline"
            fill={CHART_COLORS.baselineBar}
            name={`Baseline (${REPORT_CONFIG.baselinePeriod})`}
            radius={BUSINESS_IMPACT_CHART.barRadius}
            barSize={BUSINESS_IMPACT_CHART.barSize}
            label={{
              position: "top",
              fill: CHART_COLORS.textBaseline,
              fontSize: BUSINESS_IMPACT_CHART.fontSize.barLabel,
              fontWeight: 600,
            }}
          />
          <Bar
            dataKey="current"
            fill={CHART_COLORS.currentBar}
            name={`Current (${REPORT_CONFIG.currentPeriod})`}
            radius={BUSINESS_IMPACT_CHART.barRadius}
            barSize={BUSINESS_IMPACT_CHART.barSize}
            label={{
              position: "top",
              fill: CHART_COLORS.textCurrent,
              fontSize: BUSINESS_IMPACT_CHART.fontSize.barLabel,
              fontWeight: 600,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverallRankingsBarChart;
