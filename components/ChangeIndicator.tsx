import { ArrowDownIcon, ArrowUpIcon } from "./icons";

const ChangeIndicator = ({ value }: { value: number }) => {
  if (value === 0) {
    return <span className="text-gray-700">-</span>;
  }
  const isPositive = value > 0;
  const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
  const colorClass = isPositive ? "text-gray-800" : "text-red-600";

  return (
    <div className={`flex items-center font-medium ${colorClass}`}>
      <Icon className="w-4 h-4 mr-1" />
      <span>{Math.abs(value)}</span>
    </div>
  );
};

export default ChangeIndicator;
