import { KeyFinding } from "../types";

interface KeyFindingsProps {
  keyFindings: KeyFinding[];
}

const KeyFindings = ({ keyFindings }: KeyFindingsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#DD291E] hover:shadow-lg hover:border-[#006FCA] transition-all duration-200 min-h-[240px]">
      <h2 className="text-xl font-bold text-[#575757] mb-4">Key Findings</h2>
      <ul className="space-y-4 text-[#000000] list-disc pl-5">
        {keyFindings.map((finding, index) => (
          <li key={index} className="space-y-1">
            <strong className="text-[#575757]">{finding.title}:</strong>{" "}
            <span
  dangerouslySetInnerHTML={{ __html: finding.description }}
/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyFindings;
