"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

interface ServicesProps {
  data?: any;
  pageData?: any;
}

export default function ServicesSection({ data, pageData }: ServicesProps = {}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const content = useContent();
  const services = data || pageData?.content?.services || content?.services || {};

  const {
    label,
    badge,
    titleLine1,
    titleLine2,
    titleLine3,
    titleItalicWord,
    description,
    ctaAll,
    ctaAllUrl,
    ctaLearnMore
  } = services || {};

  const items = (services?.services || services?.items || []).filter(
    (item: any) => item && (item.status === 'published' || item.status === undefined)
  );

  if (!services || items.length === 0) return null;

  const active = items[activeIdx] || items[0];
  const activeImage = active?.image || (active?.images && active.images[0]);
  const activeBenefits = Array.isArray(active?.benefits) ? active.benefits : (Array.isArray(active?.keyFeatures) ? active.keyFeatures : []);

  const cleanLabel = stripHtml(label || badge || "");
  const cleanTitle1 = stripHtml(titleLine1 || "");
  const cleanTitle2 = stripHtml(titleLine2 || "");
  const cleanTitle3 = stripHtml(titleLine3 || "");
  const cleanTitleItalic = stripHtml(titleItalicWord || "");
  const cleanDescription = stripHtml(description || "");

  // Dynamic card labels
  const cardBadge = active?.badge || active?.specBadge || (services?.itemBadgePrefix ? `${services.itemBadgePrefix} ${activeIdx + 1}` : "");
  const cardCategory = active?.category || services?.cardCategory || services?.specTitle || "";
  const cardStatus = active?.statusLabel || services?.statusLabel || "";
  const featuresTitle = active?.benefitsTitle || active?.featuresTitle || services?.featuresTitle || "";

  const ctaSecondary = services?.ctaSecondary || services?.ctaQuote || "";
  const ctaSecondaryUrl = services?.ctaSecondaryUrl || services?.ctaQuoteUrl || "/contact-us/";
  const allServicesUrl = ctaAllUrl || "/services/";

  const isRawImage = activeImage && (activeImage.startsWith('http') || activeImage.startsWith('/uploads') || activeImage.startsWith('/cdn-images'));

  return (
    <section id="services" className="bg-paper-pure section-y border-y border-line">
      <div className="site-container">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            {cleanLabel && <div className="eyebrow mb-6">{cleanLabel}</div>}

            {(cleanTitle1 || cleanTitle2 || cleanTitle3 || cleanTitleItalic) && (
              <h2 className="h-section text-balance mb-5">
                {cleanTitle1 && <span>{cleanTitle1} </span>}
                {cleanTitle2 && <span>{cleanTitle2} </span>}
                {cleanTitle3 && <span>{cleanTitle3} </span>}
                {cleanTitleItalic && (
                  <span className="accent-word">{cleanTitleItalic}</span>
                )}
              </h2>
            )}

            {cleanDescription && (
              <p className="lede text-pretty">{cleanDescription}</p>
            )}
          </div>

          {ctaAll && (
            <Link href={allServicesUrl} className="link-arrow flex-shrink-0 pb-1">
              <span>{ctaAll}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* ── Selector tabs ──────────────────────────────────────────── */}
        <div className="flex items-stretch gap-8 overflow-x-auto no-scrollbar border-b border-line mb-10">
          {items.map((item: any, idx: number) => {
            const isSelected = activeIdx === idx;
            const itemNumber = item.number || item.id || String(idx + 1).padStart(2, '0');
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                aria-pressed={isSelected}
                className={`group relative flex items-baseline gap-2.5 whitespace-nowrap pb-4 pt-1 cursor-pointer transition-colors duration-200 ${
                  isSelected ? "text-ink-900" : "text-[color:var(--text-muted)] hover:text-ink-900"
                }`}
              >
                <span className={`font-mono text-[10.5px] font-semibold tracking-[0.13em] transition-colors ${
                  isSelected ? "text-gold" : "text-[color:var(--text-muted)] group-hover:text-gold-ink"
                }`}>
                  {itemNumber}
                </span>
                <span className="font-heading text-[14.5px] font-medium tracking-tight">
                  {item.title || item.name}
                </span>
                <span
                  className={`absolute left-0 right-0 -bottom-px h-[2px] transition-colors duration-200 ${
                    isSelected ? "bg-gold" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ── Active item ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

          {/* Image */}
          {activeImage && (
            <div className="lg:col-span-7">
              <div className="frame frame-zoom relative h-[320px] sm:h-[420px] lg:h-full lg:min-h-[480px] border border-line">
                {isRawImage ? (
                  <img
                    src={activeImage}
                    alt={active.title || active.name || ""}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <Image
                    src={activeImage}
                    alt={active.title || active.name || ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center"
                  />
                )}

                {cardBadge && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/85 to-transparent px-6 pt-16 pb-5">
                    <span className="meta text-white/85">{cardBadge}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specification panel */}
          <div className={`${activeImage ? "lg:col-span-5" : "lg:col-span-12"} flex flex-col justify-between bg-paper border border-line rounded p-7 sm:p-9`}>
            <div>
              {(cardCategory || cardStatus) && (
                <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-line">
                  {cardCategory ? (
                    <span className="meta text-gold-ink">{cardCategory}</span>
                  ) : <span />}
                  {cardStatus && <span className="meta">{cardStatus}</span>}
                </div>
              )}

              <h3 className="h-sub mb-4">
                {active.title || active.name}
              </h3>

              {active.description && (
                <p className="copy mb-8">
                  {stripHtml(active.description)}
                </p>
              )}

              {activeBenefits && activeBenefits.length > 0 && (
                <div className="pt-7 border-t border-line">
                  {featuresTitle && (
                    <span className="meta block mb-4">{featuresTitle}</span>
                  )}
                  <ul className="space-y-3">
                    {activeBenefits.map((b: any, bIdx: number) => (
                      <li key={bIdx} className="flex items-start gap-3 text-[14.5px] leading-snug text-ink-900">
                        <Check size={15} className="text-gold mt-[3px] flex-shrink-0" strokeWidth={2.5} />
                        <span>{typeof b === 'string' ? b : (b.title || b.text || "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {((active.slug && (ctaLearnMore || active?.ctaLabel)) || ctaSecondary) && (
              <div className="pt-8 mt-8 border-t border-line flex flex-wrap items-center gap-3">
                {active.slug && (ctaLearnMore || active?.ctaLabel) && (
                  <Link href={`/${active.slug}/`} className="btn btn-primary btn-sm group">
                    <span>{ctaLearnMore || active?.ctaLabel}</span>
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                )}
                {ctaSecondary && (
                  <Link href={ctaSecondaryUrl} className="btn btn-outline btn-sm">
                    <span>{ctaSecondary}</span>
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
