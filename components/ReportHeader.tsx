import { IMAGE_PATHS, DATA_SOURCES } from "../constants/constants";
import { REPORT_CONFIG } from "../constants/config";

const ReportHeader = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <img
          src={IMAGE_PATHS.fortinetLogo}
          alt="Fortinet Logo"
          className="h-12 object-contain"
        />
        <div className="flex flex-col items-center">
          <img
            src={IMAGE_PATHS.leadWalnutLogo}
            alt="Company Image"
            className="h-8 object-contain"
          />
          <p className="text-sm font-bold text-[#575757] mt-1">
            <strong>{REPORT_CONFIG.reportDate}</strong>
          </p>
        </div>
      </div>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#575757]">
          Backlink Performance Summary Report ({" "}
          {REPORT_CONFIG.reportPeriodDisplay} )
        </h1>
        <p className="text-sm text-[#000000] mt-1">
          Source: {DATA_SOURCES.primary}
        </p>
      </header>
    </>
  );
};

export default ReportHeader;
