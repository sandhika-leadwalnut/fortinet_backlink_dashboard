interface DaDistributionTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    fill: string;
  }>;
  label?: string;
}

const DaDistributionTooltip = ({
  active,
  payload,
  label,
}: DaDistributionTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#D1D1D1] rounded-md shadow-lg text-[#575757]">
        <p className="font-bold mb-1">{label}</p>
        <p>
          <span className="font-semibold">Domains: </span>
          <span className="font-bold" style={{ color: payload[0].fill }}>
            {payload[0].value.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default DaDistributionTooltip;
