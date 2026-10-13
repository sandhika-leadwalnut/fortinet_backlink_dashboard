/**
 * Dashboard data.
 *
 * ⚠️ Do not edit numbers here by hand. ⚠️
 * Every monthly value lives in data/report.json, which is generated from the
 * monthly Word doc by:  python3 scripts/update_dashboard.py "<doc>.docx"
 * This file only reshapes report.json for the components.
 */
import report from "./report.json";
import {
  KpiData,
  BacklinkGrowth,
  KeywordRankingPerformance,
  KeywordPosition,
  DaDistribution,
  PerformanceSummaryData,
  BusinessImpactData,
  KeyFinding,
  ReportHighlights,
} from "../types";
import { getPerformanceStatus } from "../utils/performanceStatus";

export const kpiData: KpiData = report.kpis;

export const backlinkGrowthData: BacklinkGrowth[] = report.backlinkGrowth;

export const keywordRankingPerformanceData: KeywordRankingPerformance =
  report.keywordRanking;

export const top3Keywords: KeywordPosition[] = report.top3Keywords;

export const firstPageKeywords: KeywordPosition[] = report.firstPageKeywords;

export const allFirstPageKeywords: KeywordPosition[] = [
  ...top3Keywords,
  ...firstPageKeywords,
].sort((a, b) => a.rank - b.rank);

export const daDistributionData: DaDistribution[] = report.daDistribution;

export const performanceSummaryData: PerformanceSummaryData[] =
  report.performanceSummary.map((item) => ({
    ...item,
    status: getPerformanceStatus(item.bestKeywordMove, item.worstKeywordMove),
  }));

// Kept for compatibility; not shown on the dashboard.
export const businessImpactData: BusinessImpactData[] = [];

export const businessImpactCategories = report.overallRankings;

export const keyFindingsData: KeyFinding[] = report.keyFindings;

export const highlightsData: ReportHighlights = report.highlights as ReportHighlights;

export const acquisitionSheetUrl: string = report.acquisitionSheetUrl ?? "";

export const reportMeta = report.meta;
