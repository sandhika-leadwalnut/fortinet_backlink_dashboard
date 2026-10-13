import {
  kpiData,
  backlinkGrowthData,
  keywordRankingPerformanceData,
  top3Keywords,
  allFirstPageKeywords,
  daDistributionData,
  performanceSummaryData,
  businessImpactData,
  keyFindingsData,
} from "./data/mockData";
import { SECTION_TITLES } from "./constants/constants";

import DashboardLayout from "./components/DashboardLayout";
import ReportHeader from "./components/ReportHeader";
import DashboardHeader from "./components/DashboardHeader";
import KeyFindings from "./components/KeyFindings";
import DaDistributionChart from "./components/DaDistributionChart";
import BacklinkGrowthChart from "./components/BacklinkGrowthChart";
import KeywordPerformanceChart from "./components/KeywordPerformanceChart";
import PerformanceSummaryTable from "./components/PerformanceSummaryTable";
import BacklinkBestPractices from "./components/BacklinkBestPractices";
import BusinessImpactChart from "./components/BusinessImpactChart";
import BacklinkAcquisitionDetails from "./components/BacklinkAcquisitionDetails";
import SectionCard from "./components/SectionCard";
import KeyHighlights from "./components/KeyHighlights";

const App = () => {
  return (
    <DashboardLayout>
      <ReportHeader />
      <DashboardHeader data={kpiData} />
      <BusinessImpactChart keywordRankingData={keywordRankingPerformanceData} />
      <div className="mb-6">
        <DaDistributionChart data={daDistributionData} />
      </div>
      <SectionCard title={SECTION_TITLES.monthlyAcquisitionTrend}>
        <BacklinkGrowthChart data={backlinkGrowthData} />
      </SectionCard>
      <SectionCard title={SECTION_TITLES.keywordRankingPerformance}>
        <KeywordPerformanceChart
          data={keywordRankingPerformanceData}
          top3Data={top3Keywords}
          allFirstPageData={allFirstPageKeywords}
        />
      </SectionCard>
      <PerformanceSummaryTable data={performanceSummaryData} />
      <KeyFindings keyFindings={keyFindingsData} />

<KeyHighlights />
      <BacklinkAcquisitionDetails />
      <BacklinkBestPractices />
    </DashboardLayout>
  );
};

export default App;
