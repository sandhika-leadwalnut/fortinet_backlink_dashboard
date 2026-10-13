import { REPORT_CONFIG } from "../constants/config";
import { BUSINESS_IMPACT_CHART } from "../constants/constants";
import { KeywordRankingPerformance, KeywordRankingChartData } from "../types";

export const useKeywordRankingChartData = (
  keywordRankingData?: KeywordRankingPerformance
) => {
  const createChartData = (
  startValue: number,
  endValue: number
): KeywordRankingChartData[] => [
  {
    name: REPORT_CONFIG.reportPeriodStart, // baseline month
    value: startValue,
  },
  {
    name: REPORT_CONFIG.reportPeriodEnd, // current month
    value: endValue,
  },
];

  const calculateMaxValue = (
    top3Value: number,
    firstPageValue: number
  ): number => {
    const maxValue = Math.max(top3Value, firstPageValue);
    return (
      Math.ceil(
        (maxValue *
          BUSINESS_IMPACT_CHART.growthMultipliers.maxValueMultiplier) /
          BUSINESS_IMPACT_CHART.growthMultipliers.roundingDivisor
      ) * BUSINESS_IMPACT_CHART.growthMultipliers.roundingDivisor
    );
  };

  const top3ChartData: KeywordRankingChartData[] = keywordRankingData
    ? createChartData(
        keywordRankingData.top3.baseline,
  
        keywordRankingData.top3.current
    )
    : [];

  const firstPageChartData: KeywordRankingChartData[] = keywordRankingData
    ? createChartData(

        keywordRankingData.firstPage.baseline,
          keywordRankingData.firstPage.current
      )
    : [];

  const maxVal = keywordRankingData
  ? calculateMaxValue(
      Math.max(
        keywordRankingData.top3.baseline,
        keywordRankingData.top3.current
      ),
      Math.max(
        keywordRankingData.firstPage.baseline,
        keywordRankingData.firstPage.current
      )
    )
  : 0;

  return {
    top3ChartData,
    firstPageChartData,
    maxVal,
  };
};
