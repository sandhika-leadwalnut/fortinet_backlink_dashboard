interface ChartLegendProps {
  data: { name: string }[];
  colors: string[];
}

const ChartLegend = ({ data, colors }: ChartLegendProps) => {
  return (
    <div className="flex justify-center space-x-6 mt-3">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div
            className="w-3 h-3 mr-2"
            style={{ backgroundColor: colors[index] }}
          />
          <span className="text-sm text-[#000000]">{entry.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
