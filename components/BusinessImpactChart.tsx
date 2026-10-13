import { REPORT_CONFIG } from "../constants/config";
import { CHART_COLORS } from "../constants/constants";
import { GrowthChart } from "./GrowthChart";
import { BusinessImpactChartProps } from "../types";
import { useKeywordRankingChartData } from "../hooks/useKeywordRankingChartData";
import { useBusinessImpactCategories } from "../hooks/useBusinessImpactCategories";
import ImpactHighlightBox from "./ImpactHighlightBox";
import OverallRankingsBarChart from "./OverallRankingsBarChart";

const BusinessImpactChart = ({
  keywordRankingData,
}: BusinessImpactChartProps) => {
  const categories = useBusinessImpactCategories();
  const { top3ChartData, firstPageChartData, maxVal } =
    useKeywordRankingChartData(keywordRankingData);

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md border-t-4 transition-all duration-200"
      style={{
        borderTopColor: CHART_COLORS.borderPrimary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderTopColor = CHART_COLORS.borderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderTopColor = CHART_COLORS.borderPrimary;
      }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Business Impact of Backlinks
      </h2>

   
      
  <h3 className="text-xl font-semibold text-gray-800 mb-4">
        1. Impact on Keywords Where Backlinks Are Acquired
      </h3>

      {keywordRankingData && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GrowthChart
              data={top3ChartData}
              title="Keywords in Top 3 Positions"
              maxVal={maxVal}
            />
            <GrowthChart
              data={firstPageChartData}
              title="Keywords on First Page"
              maxVal={maxVal}
            />
          </div>
        </div>
      )}


      <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-8">
       2. Impact on Overall Keyword Rankings
      </h3>
      <p className="text-gray-600 mb-6">
        Baseline ({REPORT_CONFIG.baselinePeriod}) vs Current (
        {REPORT_CONFIG.currentPeriod})
      </p>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImpactHighlightBox
          label="1. Page 1 Rankings"
          growth={categories[0]?.growth}
          borderColor={CHART_COLORS.highlightBorderBlue}
        />
        <ImpactHighlightBox
          label="2. Top 3 Positions (1-3)"
          growth={categories[2]?.growth}
          borderColor={CHART_COLORS.highlightBorderGreen}
        />
      </div>

      <OverallRankingsBarChart data={categories} />
    </div>
  );
};

export default BusinessImpactChart;
