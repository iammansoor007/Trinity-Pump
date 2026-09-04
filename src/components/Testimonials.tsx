"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { testimonials } = useContent();

  const {
    label,
    title1,
    title2,
    dash = "—",
    items = [],
    results = []
  } = testimonials || {};

  if (!testimonials || !items || items.length === 0) return null;

  const prev = () => setActiveIdx((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === items.length - 1 ? 0 : i + 1));

  const active = items[activeIdx] || items[0];
  const authorName = active.author || active.name || "";
  const authorRole = [active.role, active.company].filter(Boolean).join(" • ");

  return (
    <section id="testimonials" className="bg-[#0B1726] py-24 md:py-32 relative overflow-hidden border-t border-white/[0.08]">
      {/* Precision background technical pattern */}
      <div className="absolute inset-0 opacity-[0.025] bg-grid-pattern-dark pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Left: Operator Testimonial Showcase (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col justify-between text-left">
            <div>
              {label && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-[2px] bg-[#C98A2E]" />
                  <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                    {label}
                  </p>
                </div>
              )}

              {(title1 || title2) && (
                <h2 className="display-heading text-white leading-[1.12] mb-8 font-extrabold tracking-tight">
                  {title1 && <span className="text-[32px] min-[400px]:text-[38px] md:text-[44px] block">{title1}</span>}
                  {title2 && <span className="text-[32px] min-[400px]:text-[38px] md:text-[44px] text-[#C98A2E] font-serif italic block">{title2}</span>}
                </h2>
              )}

              {/* Quote Card */}
              <div className="border border-white/10 bg-[#14243A]/80 p-8 sm:p-10 mb-8 relative rounded-sm shadow-2xl">
                {/* Large decorative quote mark */}
                <span className="absolute -top-5 left-6 text-[64px] leading-none text-[#C98A2E]/25 font-serif select-none pointer-events-none">
                  “
                </span>

                {active.quote && (
                  <p className="text-white/90 text-[15px] sm:text-[16px] md:text-[17px] leading-[1.8] font-light pt-2 mb-6">
                    “{stripHtml(active.quote)}”
                  </p>
                )}

                {/* Stars + Operator Attribution */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div>
                    {authorName && (
                      <span className="text-[#C98A2E] text-[14px] font-mono font-bold tracking-wide block">
                        {dash} {authorName}
                      </span>
                    )}
                    {authorRole && (
                      <span className="text-white/50 text-[11.5px] font-mono uppercase tracking-wider block mt-0.5">
                        {authorRole}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 text-[#C98A2E]">
                    {Array.from({ length: active.rating || active.stars || 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Carousel Controls */}
              {items.length > 1 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prev}
                      aria-label="Previous quote"
                      className="w-10 h-10 rounded-sm bg-[#14243A] border border-white/10 text-white/70 hover:text-[#C98A2E] hover:border-[#C98A2E] transition-all flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next quote"
                      className="w-10 h-10 rounded-sm bg-[#14243A] border border-white/10 text-white/70 hover:text-[#C98A2E] hover:border-[#C98A2E] transition-all flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <span className="text-[12px] font-mono text-white/40 tracking-wider">
                    0{activeIdx + 1} / 0{items.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Field Verification Metrics (5 cols) ── */}
          {results && results.length > 0 && (
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((res: any, rIdx: number) => (
                <div
                  key={rIdx}
                  className="p-6 bg-[#14243A]/60 border border-white/10 rounded-sm text-left relative group hover:border-[#C98A2E]/50 transition-colors shadow-lg"
                >
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
                    METRIC // 0{rIdx + 1}
                  </div>
                  <span className="text-[#C98A2E] font-serif text-[32px] sm:text-[36px] font-bold block leading-none mb-2">
                    {res.value}
                  </span>
                  <span className="text-[#A9AFB5] text-[11.5px] font-mono uppercase tracking-wider font-semibold block leading-snug">
                    {res.label}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}