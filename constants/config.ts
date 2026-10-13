/**
 * Monthly Report Configuration
 *
 * ⚠️ Do not edit by hand. ⚠️
 * These values come from data/report.json, which is generated from the
 * monthly Word doc by:  python3 scripts/update_dashboard.py "<doc>.docx"
 */
import report from "../data/report.json";

const meta = report.meta;

export const REPORT_CONFIG = {
  reportDate: meta.reportDate, // e.g. "October 8 2026"

  reportPeriodStart: meta.periodStart, // e.g. "December 2025"
  reportPeriodEnd: meta.periodEnd, // e.g. "September 2026"
  reportPeriodDisplay: `${meta.periodStart} - ${meta.periodEnd}`,
  baselinePeriod: meta.baselineLabel, // e.g. "Dec'25"
  currentPeriod: meta.currentLabel, // e.g. "Sep'26"
  monthOrder: report.backlinkGrowth.map((m) => m.month),

  comparisonStartMonth: meta.baselineMonthAbbr,
  comparisonEndMonth: meta.currentMonthName,

  comparisonStartMonthAbbr: meta.baselineMonthAbbr, // e.g. "Dec"
  comparisonEndMonthAbbr: meta.currentMonthName, // e.g. "September"

  baselineMonthAbbr: meta.baselineMonthAbbr,
  currentMonthAbbr: meta.currentMonthName,
};

export const getMonthRange = (start: string, end: string) => {
  return `${start}-${end}`;
};

export const formatReportDate = () => {
  return REPORT_CONFIG.reportDate;
};

export const formatReportPeriod = () => {
  return REPORT_CONFIG.reportPeriodDisplay;
};
