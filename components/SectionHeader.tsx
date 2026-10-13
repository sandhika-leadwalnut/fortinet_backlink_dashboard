import { ReactNode } from "react";
import { CHART_COLORS } from "../constants/constants";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  iconClassName?: string;
}

const SectionHeader = ({
  icon,
  title,
  iconClassName = "w-6 h-6 mr-3",
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center mb-4">
      <div className={iconClassName} style={{ color: CHART_COLORS.primary }}>
        {icon}
      </div>
      <h2 className="text-xl font-bold text-[#575757]">{title}</h2>
    </div>
  );
};

export default SectionHeader;
