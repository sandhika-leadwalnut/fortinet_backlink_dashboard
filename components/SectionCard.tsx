import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  borderColor?: string;
  hoverBorderColor?: string;
}

const SectionCard = ({
  title,
  children,
  borderColor = "#006FCA",
  hoverBorderColor,
}: SectionCardProps) => {
  const borderStyle = { borderTopColor: borderColor };

  return (
    <div
      className="bg-white p-4 sm:p-6 shadow-md border-t-4 rounded-lg hover:shadow-lg transition-all duration-200"
      style={borderStyle}
      onMouseEnter={(e) => {
        if (hoverBorderColor) {
          e.currentTarget.style.borderTopColor = hoverBorderColor;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverBorderColor) {
          e.currentTarget.style.borderTopColor = borderColor;
        }
      }}
    >
      <h2 className="text-xl font-bold text-[#575757] mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default SectionCard;
