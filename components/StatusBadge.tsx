export const StatusBadge = ({
  status,
}: {
  status: "Good" | "Needs Attention";
}) => {
  const baseClasses =
    "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (status === "Good") {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-700`}>Good</span>
    );
  }
  return (
    <span className={`${baseClasses} bg-red-100 text-red-700`}>
      Needs Attention
    </span>
  );
};

export default StatusBadge;
