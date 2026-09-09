"use client";

import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

interface HowWeWorkProps {
  data?: any;
  pageData?: any;
}

export default function HowItWorksSection({ data, pageData }: HowWeWorkProps = {}) {
  const content = useContent();
  const process = data || pageData?.content?.process || pageData?.content?.howWeWork || content?.process || {};

  const {
    label,
    title,
    description,
    phaseLabel,
    items = []
  } = process || {};

  if (!process || !items || items.length === 0) return null;

  const cleanLabel = stripHtml(label || "");
  const cleanTitle = stripHtml(title || "");
  const cleanDescription = stripHtml(description || "");

  // Pick a column count that fills the last row: 4 or 8 steps go four-wide,
  // multiples of three go three-wide, so the hairline grid never leaves an orphan cell.
  const count = items.length;
  const fourWide = count > 2 && count % 3 !== 0 && count % 4 === 0;
  const colsClass =
    count === 1 ? "" :
    count === 2 ? "md:grid-cols-2" :
    fourWide ? "md:grid-cols-2 xl:grid-cols-4" :
    "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="bg-paper-pure section-y border-y border-line">
      <div className="site-container">

        {/* Header */}
        {(cleanLabel || cleanTitle || cleanDescription) && (
          <div className="max-w-2xl mb-14">
            {cleanLabel && <div className="eyebrow mb-6">{cleanLabel}</div>}
            {cleanTitle && <h2 className="h-section text-balance">{cleanTitle}</h2>}
            {cleanDescription && (
              <p className="lede text-pretty mt-5">{cleanDescription}</p>
            )}
          </div>
        )}

        {/* Steps — hairline grid, numbered */}
        <div className={`grid grid-cols-1 ${colsClass} rule-grid`}>
          {items.map((item: any, idx: number) => {
            const stepNum = item.step || item.number || item.id || String(idx + 1).padStart(2, '0');
            const itemTag = item.tag || (phaseLabel ? `${phaseLabel} ${stepNum}` : (item.badge || ""));
            const itemDesc = item.desc || item.description || "";

            return (
              <div
                key={idx}
                className={`group relative flex flex-col p-8 ${fourWide ? "xl:p-8" : "lg:p-10"} transition-colors duration-200 hover:bg-paper`}
              >
                {/* Step number, set as an editorial figure */}
                {stepNum && (
                  <span className="font-display text-[40px] leading-none text-gold/35 group-hover:text-gold transition-colors duration-300 mb-6 block">
                    {stepNum}
                  </span>
                )}

                {itemTag && <div className="meta text-gold-ink mb-3">{itemTag}</div>}

                {item.title && <h3 className="h-card mb-3">{item.title}</h3>}

                {itemDesc && (
                  <p className="copy">{stripHtml(itemDesc)}</p>
                )}

                {Array.isArray(item.actions) && item.actions.length > 0 && (
                  <ul className="mt-7 pt-6 border-t border-line space-y-2.5">
                    {item.actions.map((act: string, aIdx: number) => (
                      <li key={aIdx} className="flex items-center gap-3 text-[13.5px] text-ink-900">
                        <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
