// components/KeyHighlights.tsx

import SectionHeader from "./SectionHeader";
import { DocumentIcon } from "./icons";
import { CHART_COLORS } from "../constants/constants";
import { highlightsData } from "../data/mockData";
const Figure = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-[85%] h-[70vh] mx-auto mb-6 rounded-xl border border-gray-300 shadow-sm overflow-hidden bg-white">
    <img src={src} alt={alt} className="w-full h-full object-contain object-top" />
  </div>
);
const KeyHighlights = () => {
  /* ==========================================================
      SERP DATA
  ========================================================== */
const imageClass =
  "block mx-auto w-auto max-w-[85%] max-h-[80vh] object-contain rounded-xl border border-gray-300 shadow-sm mb-6";
  /* All highlight content comes from data/report.json (generated from the monthly Word doc). */
  const { serpGroups, llm: llmHighlights, guestPosts: guestSection } = highlightsData;
  const guestPosts = guestSection.items;

  return (
    <div
      className="bg-white rounded-lg shadow-md border-t-4 p-6 hover:shadow-lg transition-all duration-300"
      style={{ borderTopColor: CHART_COLORS.primary }}
    >
      <SectionHeader
        icon={<DocumentIcon />}
        title="Key Highlights"
      />

      {/* ==========================================================
            SERP KEY HIGHLIGHTS
      ========================================================== */}

      <section className="mb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          SERP Key Highlights
        </h2>

        {serpGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={groupIndex < serpGroups.length - 1 ? "mb-20" : undefined}
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {group.title}
          </h3>

          <p className="text-gray-700 leading-7 mb-10">
            {group.description}
          </p>

          <div className="space-y-14">
            {group.items.map((item, index) => (
              <div key={index}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.keyword}
                    className={imageClass}
                  />
                )}

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-semibold">Keyword:</span>{" "}
                    {item.keyword}
                  </p>

                  <p className="break-all">
                    <span className="font-semibold">Link:</span>{" "}
                    <a
                      href={item.link ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.link}
                    </a>
                  </p>

                  <p>
                    <span className="font-semibold">Position:</span>{" "}
                    {item.position}
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5">
                    <p className="text-gray-700 leading-7">
                      <span className="font-semibold">Insight:</span>{" "}
                      {item.insight}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        ))}
      </section>

      {/* Divider */}

      <div className="border-t border-gray-300 mb-20"></div>

      {/* ==========================================================
            LLM KEY HIGHLIGHTS
      ========================================================== */}

     <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          LLM Key Highlights
        </h2>

        {/* LLM Charts */}

        <div className="space-y-16 mb-20">
          {llmHighlights.map((item, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold mb-6">{item.title}</h3>

              {item.image && (
                <img src={item.image} alt={item.title} className={imageClass} />
              )}

                         <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5">
                {Array.isArray(item.insight) ? (
                  <div className="text-gray-700 leading-7 space-y-1">
                    <p>
                      <span className="font-semibold">Insight:</span>{" "}
                      {item.insight[0]}
                    </p>
                    {item.insight.slice(1).map((line, i) => (
                      <p key={i} className="ml-4">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 leading-7">
                    <span className="font-semibold">Insight:</span>{" "}
                    {item.insight}
                  </p>
                )}
              </div>
            </div>
            
          ))}
        </div>

        {/* Guest Posts */}

        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Listicle Type of Guest Posts - Third-Party Guest Posts for Brand Mentions
          </h3>

          <p className="text-gray-700 leading-7 mb-10">
            {guestSection.insight}
          </p>

          <div className="space-y-14">
            {guestPosts.map((post, index) => (
              <div key={index}>
                {post.image && (
                  <img src={post.image} alt={post.title} className={imageClass} />
                )}

                <div className="space-y-3">
                  <p className="font-semibold">{post.title}</p>

                  <a
                    href={post.link ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {post.link}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5 mt-10">
            <p className="text-gray-700 leading-7">
              <span className="font-semibold">Insight:</span> {guestSection.insight}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KeyHighlights;