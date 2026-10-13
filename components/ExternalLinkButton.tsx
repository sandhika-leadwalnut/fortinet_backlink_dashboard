import { ReactNode } from "react";
import { ExternalLinkIcon } from "./icons";
import { CHART_COLORS } from "../constants/constants";

interface ExternalLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const ExternalLinkButton = ({
  href,
  children,
  className = "",
}: ExternalLinkButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${className}`}
      style={{
        backgroundColor: CHART_COLORS.primary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#004C8F";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = CHART_COLORS.primary;
      }}
    >
      <ExternalLinkIcon className="w-5 h-5 mr-2" />
      {children}
    </a>
  );
};

export default ExternalLinkButton;
