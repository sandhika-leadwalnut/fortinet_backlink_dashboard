import { CheckCircleIcon } from "./icons";

interface SuccessBannerProps {
  label: string;
  percentage: number;
  message: string;
}

const SuccessBanner = ({ label, percentage, message }: SuccessBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-800 leading-relaxed">
          <strong className="text-green-700">{label}:</strong> {percentage}% of{" "}
          {message}
        </p>
      </div>
    </div>
  );
};

export default SuccessBanner;
