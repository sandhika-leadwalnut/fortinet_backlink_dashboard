import KpiCard from "./KpiCard";
import { KpiData } from "../types";
import { REPORT_CONFIG } from "../constants/config";

interface DashboardHeaderProps {
  data: KpiData;
}

const DashboardHeader = ({ data }: DashboardHeaderProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard title="URLs Tracked" value={data.urlsTracked} />
      <KpiCard title="Keywords Tracked" value={data.keywordsTracked} />
      <KpiCard
        title={`Backlink Plan till ${REPORT_CONFIG.currentMonthAbbr}`}
        value={data.planTotalBacklinks.toLocaleString()}
      />
      <KpiCard
        title={`Backlink Actual till ${
          REPORT_CONFIG.reportPeriodEnd.split(" ")[0]
        }`}
        value={data.totalBacklinks.toLocaleString()}
        subtitle=""
      />
    </div>
  );
};

export default DashboardHeader;
