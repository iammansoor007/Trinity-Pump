"use client";

import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function HowItWorksSection() {
  const { process } = useContent();

  const {
    label,
    title,
    description,
    phaseLabel = "COMMITMENT",
    items = []
  } = process || {};

  if (!process || !items || items.length === 0) return null;

  return (
    <section className="bg-[#E8E6E0] py-24 md:py-32 relative border-t border-[#D6D3CC]">
      {/* Precision architectural technical pattern */}
      <div className="absolute inset-0 opacity-[0.025] bg-grid-pattern-black pointer-events-none" />

      <div className="site-container relative z-10">

        {/* Section Header */}
        <div className="mb-16 max-w-2xl text-left">
          {label && (
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-[2px] bg-[#C98A2E]" />
              <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                {stripHtml(label)}
              </p>
            </div>
          )}
          {title && (
            <h2 className="display-heading text-[32px] min-[400px]:text-[38px] md:text-[46px] text-[#0B1726] leading-[1.12] font-extrabold tracking-tight">
              {stripHtml(title)}
            </h2>
          )}
          {description && (
            <p className="text-[#5E6670] text-[15px] md:text-[16.5px] leading-[1.8] mt-4 font-normal">
              {stripHtml(description)}
            </p>
          )}
        </div>

        {/* Architectural Principles & Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any, idx: number) => {
            const stepNum = item.step || String(idx + 1).padStart(2, '0');
            const itemTag = item.tag || `${phaseLabel} ${stepNum}`;
            const itemDesc = item.desc || item.description || "";

            return (
              <div
                key={idx}
                className="p-8 bg-white border border-[#D6D3CC] rounded-sm text-left shadow-sm relative group hover:border-[#C98A2E] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Corner Technical Accent */}
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#C98A2E]/40 group-hover:border-[#C98A2E] transition-colors" />

                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E6E0]">
                    <span className="text-[#C98A2E] font-mono text-[11px] uppercase tracking-widest font-bold">
                      {itemTag}
                    </span>
                    <span className="text-[#0B1726]/30 font-serif text-[20px] font-bold">
                      {stepNum}
                    </span>
                  </div>

                  {item.title && (
                    <h3 className="display-heading text-[20px] md:text-[22px] text-[#0B1726] font-bold mb-3 leading-snug">
                      {item.title}
                    </h3>
                  )}

                  {itemDesc && (
                    <p className="text-[#5E6670] text-[14px] leading-[1.75] font-normal">
                      {stripHtml(itemDesc)}
                    </p>
                  )}
                </div>

                {/* Optional checklist actions if present in CMS */}
                {Array.isArray(item.actions) && item.actions.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#E8E6E0] space-y-2">
                    {item.actions.map((act: string, aIdx: number) => (
                      <div key={aIdx} className="flex items-center gap-2 text-[12.5px] text-[#0B1726]/80 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2E]" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
