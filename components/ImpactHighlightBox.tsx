import { CHART_COLORS } from "../constants/constants";

interface ImpactHighlightBoxProps {
  label: string;
  growth: string | undefined;
  borderColor: string;
}

const ImpactHighlightBox = ({
  label,
  growth,
  borderColor,
}: ImpactHighlightBoxProps) => {
  const growthValue = parseFloat(growth || "0");
  const displayGrowth = growthValue > 0 ? `+${growth}%` : `${growth}%`;

  return (
    <div
      className="p-4 rounded-lg border-l-4"
      style={{
        backgroundColor: CHART_COLORS.highlightBg,
        borderLeftColor: borderColor,
      }}
    >
      <p className="text-sm text-gray-800">
        <span className="font-semibold">{label}:</span>{" "}
        <span className="text-green-600 font-bold">{displayGrowth}</span>{" "}
        improvement
      </p>
    </div>
  );
};

export default ImpactHighlightBox;
