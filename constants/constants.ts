/**
 * Static Configuration Constants
 *
 * These values rarely change but should be centralized for easy updates.
 * Update only when business rules or external resources change.
 */

import report from "../data/report.json";

export const EXTERNAL_URLS = {
  googleSheets: report.acquisitionSheetUrl ?? "",
  fortinetBaseUrl: "https://www.fortinet.com",
};

export const IMAGE_PATHS = {
  fortinetLogo: "/Fortinet logo png.png",
  leadWalnutLogo: "/LeadWalnut light logo with tagline 3.png",
};

export const DA_THRESHOLDS = {
  minTarget: 30,
  maxTarget: 70,

  highlightRange: {
    min: 41,
    max: 70,
  },

  minTraffic: 500,

  trafficAveragingPeriod: 6,
};

export const FORTINET_URLS = [
  "https://www.fortinet.com/resources/cyberglossary/what-is-ztna",
  "https://www.fortinet.com/resources/cyberglossary/what-is-network-security",
  "https://www.fortinet.com/resources/cyberglossary/what-is-cybersecurity",
  "https://www.fortinet.com/resources/cyberglossary/sd-wan-explained",
  "https://www.fortinet.com/resources/cyberglossary/sase",
  "https://www.fortinet.com/resources/cyberglossary/firewall",
  "https://www.fortinet.com/resources/cyberglossary/what-is-cyber-attack",
  "https://www.fortinet.com/resources/cyberglossary/iot-security",
  "https://www.fortinet.com/ransomware-hub",
  "https://www.fortinet.com/solutions/industries/scada-industrial-control-systems/what-is-ot-security",
  "https://www.fortinet.com/resources/cyberglossary/malware",
  "https://www.fortinet.com/resources/cyberglossary/what-is-endpoint-security",
  "https://www.fortinet.com/products/sd-wan",
  "https://www.fortinet.com/resources/cyberglossary/what-is-secops",
  "https://www.fortinet.com/solutions/cloud-security/vulnerability-management",
  "https://www.fortinet.com/blog/psirt-blogs",
  "https://www.fortinet.com/resources/cyberglossary/ransomware",
  "https://www.fortinet.com/resources/hubs/quantum-security",
  "https://www.fortinet.com/products/rugged-firewall",
  "https://www.fortinet.com/resources/cyberglossary/what-is-cloud-security",
  "https://www.fortinet.com/resources/cyberglossary/what-is-casb",
  "https://www.fortinet.com/resources/cyberglossary/ai-cybersecurity",
];

export const DATA_SOURCES = {
  primary: "GSC, MOZ",
};

export const SECTION_TITLES = {
  monthlyAcquisitionTrend: "Monthly Acquisition Trend",
  keywordRankingPerformance: "Keyword Ranking Performance",
  backlinkAcquisitionDetails: "Backlink Acquisition Details",
  detailedMonthlyBacklinksSheet: "Detailed Monthly Backlinks Sheet",
  backlinkQualityAssurance: "Backlink Quality Assurance",
  referringDomainsDA: "Referring Domains DA",
  performanceSummaryUrlWiseBreakdown:
    "Performance Summary - URL wise Breakdown",
};

export const TABLE_COLUMNS = {
  url: "URL",
  backlinkGrowth: "Backlink Growth",
  paChange: "PA Change",
  bestKeywordMove: "Best Keyword Move",
  worstKeywordMove: "Worst Keyword Move",
  overallStatus: "Overall Status",
};

export const CHART_COLORS = {
  primary: "#006FCA",
  secondary: "#61B178",
  accent: "#00B6B5",
  hover: "#004C8F",
  daDistribution: ["#006FCA", "#61B178", "#00B6B5"],
  baselineBar: "#3b82f6",
  currentBar: "#10b981",
  borderPrimary: "#006FCA",
  borderHover: "#00B6B5",
  textGray: "#4b5563",
  textBaseline: "#1e40af",
  textCurrent: "#047857",
  gridStroke: "#e0e0e0",
  highlightBg: "#f0fdf4",
  highlightBorderBlue: "#2563eb",
  highlightBorderGreen: "#16a34a",
};

export const MONTH_COLORS: Record<string, string> = {
  March: "#9DA7B4",
  April: "#A6A6A6",
  May: "#6D6D6D",
  June: "#006FCA",
  July: "#9040BA",
  August: "#DD291E",
  September: "#00B6B5",
  October: "#228B22",
};

export const DA_DISTRIBUTION = {
  targetRange: "DA 41-70",
  tooltipText:
    "Distribution of referring domains by Moz Domain Authority (DA).",
  successMessage:
    "referring domains fall within the DA 41-70 range, indicating strong domain authority distribution.",
};

export const BUSINESS_IMPACT_CHART = {
  height: 420,
  margins: {
    top: 30,
    right: 24,
    left: 64,
    bottom: 60,
  },
  barSize: 64,
  barRadius: [8, 8, 0, 0] as [number, number, number, number],
  xAxisHeight: 64,
  yAxisWidth: 64,
  fontSize: {
    xAxis: 13,
    yAxis: 12,
    barLabel: 12,
  },
  growthMultipliers: {
    maxValueMultiplier: 1.25,
    roundingDivisor: 5,
  },
};
