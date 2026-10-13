import { ArrowUpIcon } from "./icons";

const GrowthIndicator = ({ value }: { value: number }) => {
  if (value === 0) {
    return <span className="text-gray-700">0</span>;
  }
  return (
    <div className="flex items-center font-medium text-gray-800">
      <ArrowUpIcon className="w-4 h-4 mr-1" />
      <span>{value}</span>
    </div>
  );
};

export default GrowthIndicator;
