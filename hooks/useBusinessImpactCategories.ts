import { useMemo } from "react";
import { businessImpactCategories } from "../data/mockData";
import { BusinessImpactCategory } from "../types";

export const useBusinessImpactCategories = (): BusinessImpactCategory[] => {
  return useMemo(() => {
    return businessImpactCategories.map((category) => ({
      ...category,
      growth: (
        ((category.current - category.baseline) / category.baseline) *
        100
      ).toFixed(1),
    }));
  }, []);
};
