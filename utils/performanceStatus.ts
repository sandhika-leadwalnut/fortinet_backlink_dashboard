export type PerformanceStatus = "Good" | "Needs Attention";

const extractMoveValue = (text?: string): number | null => {
  if (!text || text === "-") return null;

  const match = text.match(/\(([-+]?\d+)\)/);
  return match ? Number(match[1]) : null;
};

export const getPerformanceStatus = (
  bestKeywordMove?: string,
  worstKeywordMove?: string
): PerformanceStatus => {
  const best = extractMoveValue(bestKeywordMove);
  const worst = extractMoveValue(worstKeywordMove);

  // 1️⃣ Both empty
  if (best === null && worst === null) {
    return "Needs Attention";
  }

  // 2️⃣ Only worst exists
  if (best === null && worst !== null) {
    return "Needs Attention";
  }

  // 3️⃣ Only best exists
  if (best !== null && worst === null) {
    return "Good";
  }

  // 4️⃣ Both exist → compare absolute values
  const bestAbs = Math.abs(best!);
  const worstAbs = Math.abs(worst!);

  // If worst impact is significantly higher than best
  if (worstAbs - bestAbs > 3) {
    return "Needs Attention";
  }

  return "Good";
};
