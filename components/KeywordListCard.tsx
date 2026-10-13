import { KeywordPosition } from "@/types";
import { ReactNode } from "react";
import { REPORT_CONFIG } from "@/constants/config";

export const KeywordListCard = ({
  title,
  data,
  icon,
}: {
  title: string;
  data: KeywordPosition[];
  icon: ReactNode;
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 shadow-md rounded-lg h-full hover:shadow-lg transition-all duration-200">
      <div className="flex items-center mb-4 text-[#000000]">
        {icon}
        <h3 className="text-lg font-semibold ml-2">{title}</h3>
      </div>
      <div className="pr-2 h-64 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-12 px-2 py-2 text-xs font-semibold text-[#000000] border-b border-[#D1D1D1]">
          <div className="col-span-6">Keyword</div>
          <div className="col-span-3 text-center">Position Change</div>
          <div className="col-span-3 text-center">{REPORT_CONFIG.currentMonthAbbr} Rank</div>
        </div>
        {data.map((kw, index) => {
          const displayChange = kw.change;
          const changeColor =
            displayChange > 0
              ? "text-[#61B178]"
              : displayChange < 0
              ? "text-[#DD291E]"
              : "text-[#000000]";
          const changeText =
            displayChange === 0
              ? "0"
              : `${displayChange > 0 ? "+" : ""}${displayChange}`;

          return (
            <div
              key={index}
              className="grid grid-cols-12 items-center px-2 py-2 border-b border-[#D1D1D1] last:border-b-0 hover:bg-[#F0F0F0] transition-colors"
            >
              <span
                className="col-span-6 text-[#575757] truncate text-sm"
                title={kw.name}
              >
                {kw.name}
              </span>
              <span
                className={`col-span-3 text-center text-sm font-medium ${changeColor}`}
              >
                ({changeText})
              </span>
              <span className="col-span-3 text-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#006FCA] text-white text-xs font-bold">
                  {kw.rank}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
