import { useState } from "react";
import { PerformanceSummaryData } from "../types";
import {
  FORTINET_URLS,
  SECTION_TITLES,
  TABLE_COLUMNS,
  CHART_COLORS,
} from "../constants/constants";
import { REPORT_CONFIG, getMonthRange } from "../constants/config";
import StatusBadge from "./StatusBadge";
import GrowthIndicator from "./GrowthIndicator";
import ChangeIndicator from "./ChangeIndicator";

interface PerformanceSummaryTableProps {
  data: PerformanceSummaryData[];
}

const PerformanceSummaryTable = ({
  data,
}: PerformanceSummaryTableProps) => {
  const monthRange = getMonthRange(
    REPORT_CONFIG.comparisonStartMonthAbbr,
    REPORT_CONFIG.comparisonEndMonthAbbr
  );

  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 10);

  return (
    <div
      className="bg-white p-4 sm:p-6 shadow-md border-t-4 rounded-lg hover:shadow-lg transition-all duration-200"
      style={{ borderTopColor: CHART_COLORS.primary }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderTopColor = CHART_COLORS.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderTopColor = CHART_COLORS.primary;
      }}
    >
      <h2 className="text-xl font-bold text-gray-700 mb-6">
        {SECTION_TITLES.performanceSummaryUrlWiseBreakdown}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm text-left">
          <thead className="border-b-2 border-gray-300">
            <tr className="text-black font-semibold uppercase">
              <th className="p-3">{TABLE_COLUMNS.url}</th>

              <th className="p-3">
                {TABLE_COLUMNS.backlinkGrowth} ({monthRange})
              </th>

              <th className="p-3">
                {TABLE_COLUMNS.paChange} ({monthRange})
              </th>

              <th className="p-3">{TABLE_COLUMNS.bestKeywordMove}</th>

              <th className="p-3">{TABLE_COLUMNS.worstKeywordMove}</th>

              <th className="p-3 text-center">
                {TABLE_COLUMNS.overallStatus}
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td
                  className="p-3 font-semibold"
                  style={{ color: CHART_COLORS.primary }}
                >
                  <a
                    href={row.urlLink || FORTINET_URLS[index] || row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline transition-colors"
                    style={{
                      color: CHART_COLORS.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = CHART_COLORS.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = CHART_COLORS.primary;
                    }}
                    title={row.urlLink || FORTINET_URLS[index] || row.url}
                  >
                    {row.url}
                  </a>
                </td>

                <td className="p-3">
                  <GrowthIndicator value={row.backlinkGrowth} />
                </td>

                <td className="p-3">
                  <ChangeIndicator value={row.paChange} />
                </td>

                <td className="p-3 text-green-600">
                  {row.bestKeywordMove || "-"}
                </td>

                <td className="p-3 text-red-600">
                  {row.worstKeywordMove || "-"}
                </td>

                <td className="p-3 text-center">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 10 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: CHART_COLORS.primary }}
          >
            {showAll
              ? "Show Less"
              : `Read More (${data.length - 10} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceSummaryTable;