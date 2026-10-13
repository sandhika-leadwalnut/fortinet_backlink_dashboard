type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

const KpiCard = ({ title, value, subtitle }: KpiCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#DD291E] hover:shadow-lg hover:border-[#006FCA] transition-all duration-200 cursor-pointer">
      <p className="text-4xl font-bold text-[#575757] group-hover:text-[#006FCA] transition-colors">
        {value}
      </p>
      <p className="text-sm text-[#6D6D6D] font-medium uppercase tracking-wider">
        {title}
      </p>
      {subtitle && <p className="text-xs text-[#6D6D6D] mt-1">{subtitle}</p>}
    </div>
  );
};

export default KpiCard;
