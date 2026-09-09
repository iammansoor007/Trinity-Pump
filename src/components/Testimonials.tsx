"use client";

import { useState } from "react";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

interface TestimonialsProps {
  data?: any;
  pageData?: any;
}

export default function TestimonialsSection({ data, pageData }: TestimonialsProps = {}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const content = useContent();
  const testimonials = data || pageData?.content?.testimonials || content?.testimonials || {};

  const {
    label,
    title1,
    title2,
    dash,
    items = [],
    results = []
  } = testimonials || {};

  if (!testimonials || ((!items || items.length === 0) && (!results || results.length === 0))) {
    return null;
  }

  const prev = () => setActiveIdx((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === items.length - 1 ? 0 : i + 1));

  const active = items[activeIdx] || items[0] || {};
  // Two schemas reach this component: global content (author/role/company/quote)
  // and the homepage Page document (name/position/text/rating). Read both.
  const quoteText = stripHtml(active.quote || active.text || active.content || active.review || "");
  const authorName = active.author || active.name || "";
  const authorRole = [active.role || active.position, active.company].filter(Boolean).join(" · ");
  const starCount = active.rating || active.stars || 0;
  const authorDash = dash !== undefined ? dash : "";

  // "results" is either a metrics list ({ value, label }) or a gallery ({ image, caption }).
  const metricResults = (results || []).filter((r: any) => r && !r.image && (r.value || r.label));
  const galleryResults = (results || []).filter((r: any) => r && r.image);

  const hasItems = items && items.length > 0;
  const hasResults = metricResults.length > 0 || galleryResults.length > 0;

  return (
    <section id="testimonials" className="bg-paper section-y">
      <div className="site-container">
        <div className={`grid grid-cols-1 ${hasResults ? "lg:grid-cols-12 gap-12 lg:gap-16" : ""} items-start`}>

          {/* ── Quote ── */}
          {hasItems && (
            <div className={hasResults ? "lg:col-span-7" : "max-w-3xl"}>
              {label && <div className="eyebrow mb-6">{label}</div>}

              {(title1 || title2) && (
                <h2 className="h-section text-balance mb-10">
                  {title1 && <span className="block">{title1}</span>}
                  {title2 && <span className="accent-word block">{title2}</span>}
                </h2>
              )}

              {/* Editorial pull quote — the display serif doing real work */}
              <figure className="border-t border-line pt-9">
                {quoteText && (
                  <blockquote className="font-display text-[24px] sm:text-[29px] md:text-[33px] leading-[1.34] tracking-[-0.012em] text-ink-900 text-pretty mb-9">
                    &ldquo;{quoteText}&rdquo;
                  </blockquote>
                )}

                <figcaption className="flex flex-wrap items-end justify-between gap-5">
                  <div>
                    {authorName && (
                      <span className="block font-heading text-[15.5px] font-semibold tracking-tight text-ink-900">
                        {authorDash ? `${authorDash} ` : ""}{authorName}
                      </span>
                    )}
                    {authorRole && <span className="meta block mt-2">{authorRole}</span>}
                  </div>

                  {starCount > 0 && (
                    <div className="flex gap-1 text-gold" aria-label={`${starCount} out of 5`}>
                      {Array.from({ length: starCount }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                  )}
                </figcaption>
              </figure>

              {/* Controls */}
              {items.length > 1 && (
                <div className="flex items-center gap-6 mt-9">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prev}
                      aria-label="Previous quote"
                      className="w-10 h-10 rounded border border-line-strong text-ink-900 hover:border-ink-900 hover:bg-paper-alt transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next quote"
                      className="w-10 h-10 rounded border border-line-strong text-ink-900 hover:border-ink-900 hover:bg-paper-alt transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <span className="meta tnum">
                    {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── Verified results: metrics and/or gallery ── */}
          {hasResults && (
            <div className={`${hasItems ? "lg:col-span-5" : "max-w-3xl"} space-y-6`}>

              {metricResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 rule-grid">
                  {metricResults.map((res: any, rIdx: number) => {
                    const metricTag = res.tag || res.badge || (testimonials.metricPrefix ? `${testimonials.metricPrefix} ${rIdx + 1}` : "");

                    return (
                      <div key={rIdx} className="p-7">
                        {metricTag && <div className="meta mb-4">{metricTag}</div>}
                        {res.value && <span className="figure-lg block mb-2.5">{res.value}</span>}
                        {res.label && (
                          <span className="block text-[12.5px] leading-snug text-[color:var(--text-muted)]">
                            {res.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {galleryResults.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {galleryResults.map((res: any, gIdx: number) => {
                    const caption = res.caption || res.label || res.title || "";
                    // Plain <img>: gallery URLs are remote (Cloudinary) and not in next.config remotePatterns.
                    return (
                      <figure key={gIdx} className="frame frame-zoom relative aspect-[4/3] border border-line">
                        <img src={res.image} alt={caption} className="w-full h-full object-cover" loading="lazy" />
                        {caption && (
                          // `meta` goes on the block itself so its 1.4 line-height wins over body's inherited 1.6.
                          <figcaption className="meta text-white/85 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/85 to-transparent px-4 pt-8 pb-3.5">
                            {caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
