import {
  EXTERNAL_URLS,
  SECTION_TITLES,
  CHART_COLORS,
} from "../constants/constants";
import { DocumentIcon } from "./icons";
import SectionHeader from "./SectionHeader";
import ExternalLinkButton from "./ExternalLinkButton";

const BacklinkAcquisitionDetails = () => {
  return (
    <div
      className="bg-white p-6 shadow-md rounded-lg border-t-4 hover:shadow-lg transition-all duration-200"
      style={{ borderTopColor: CHART_COLORS.primary }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderTopColor = CHART_COLORS.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderTopColor = CHART_COLORS.primary;
      }}
    >
      <SectionHeader
        icon={<DocumentIcon />}
        title={SECTION_TITLES.backlinkAcquisitionDetails}
      />
      <ExternalLinkButton href={EXTERNAL_URLS.googleSheets}>
        {SECTION_TITLES.detailedMonthlyBacklinksSheet}
      </ExternalLinkButton>
    </div>
  );
};

export default BacklinkAcquisitionDetails;
