const BacklinkBestPractices = () => {
  const BEST_PRACTICES = [
    {
      category: "ACQUISITION APPROACH",
      practices: [
        "Backlinks are obtained exclusively through guest posts published on relevant, high-quality websites.",
        "No link exchanges, private blog networks (PBNs), or automated link-building methods are used.",
      ],
    },
    {
      category: "REFERRING DOMAIN QUALITY",
      practices: [
        "Domains with a Domain Authority (DA) between 30 and 70+ are targeted.",
        "Referring domains must demonstrate consistent organic traffic of at least 500 visits per month on average over the past six months",
        "Domains must be topically relevant to the linked website's niche, ensuring contextual alignment between the referring page and the target page.",
        "Internal QA Agent is utilized to assess the quality of referring domains. This agent meticulously validates domain metrics such as Domain Authority (DA) and traffic, alongside relevance and content quality.",
      ],
    },
    {
      category: "ANCHOR TEXT GUIDELINES",
      practices: [
        "No keyword stuffing is permitted. Anchor texts must be semantically relevant, natural in phrasing, and contextual to the surrounding content.",
        "Anchor texts are typically 4-8 words in length and consist of variations or partial matches of the target keyword to maintain natural diversity.",
      ],
    },
    {
      category: "CONTENT RELEVANCE & QUALITY",
      practices: [
        "All guest posts must provide unique, valuable, and informative content that benefits readers, not solely for link placement.",
        "Content must be topically aligned with both the referring site's audience and the target page's subject matter.",
      ],
    },
  ];

  return (
    <div className="bg-white p-6 shadow-md rounded-lg border-t-4 border-[#00B6B5] hover:shadow-lg hover:border-[#006FCA] transition-all duration-200">
      <div className="flex items-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-[#00B6B5] mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h2 className="text-xl font-bold text-[#575757]">
          Backlink Best Practices
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BEST_PRACTICES.map((category, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <h3 className="text-base font-semibold text-[#006FCA] mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {category.category}
            </h3>
            <ul className="space-y-2">
              {category.practices.map((practice, practiceIndex) => (
                <li
                  key={practiceIndex}
                  className="flex items-start text-xs text-[#575757]"
                >
                  <span className="text-[#00B6B5] mr-2 mt-1">•</span>
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacklinkBestPractices;
