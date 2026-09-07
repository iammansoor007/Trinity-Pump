"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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

  return (
    <section id="services" className="bg-[#0B1726] py-24 md:py-32 overflow-hidden border-t border-white/[0.08] relative">
      {/* Precision background technical lines */}
      <div className="absolute inset-0 opacity-[0.025] bg-grid-pattern-dark pointer-events-none" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 text-left border-b border-white/[0.08] pb-10">
          <div className="max-w-2xl">
            {cleanLabel && (
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-[2px] bg-[#C98A2E]" />
                <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                  {cleanLabel}
                </p>
              </div>
            )}

            {(cleanTitle1 || cleanTitle2 || cleanTitle3 || cleanTitleItalic) && (
              <h2 className="display-heading text-[32px] min-[400px]:text-[38px] md:text-[46px] text-white leading-[1.12] mb-4 font-bold tracking-tight">
                {cleanTitle1 && <span>{cleanTitle1} </span>}
                {cleanTitle2 && <span>{cleanTitle2} </span>}
                {cleanTitle3 && <span>{cleanTitle3} </span>}
                {cleanTitleItalic && <span className="text-[#C98A2E] font-serif italic">{cleanTitleItalic}</span>}
              </h2>
            )}

            {cleanDescription && (
              <p className="text-[#A9AFB5] text-[15px] leading-[1.75] font-light max-w-xl">
                {cleanDescription}
              </p>
            )}
          </div>

          {ctaAll && (
            <div className="flex-shrink-0">
              <Link
                href={allServicesUrl}
                className="btn-outline-white inline-flex items-center gap-2 text-[11.5px] font-mono uppercase tracking-widest px-6 py-3.5"
              >
                <span>{ctaAll}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* Equipment Selector Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          {items.map((item: any, idx: number) => {
            const isSelected = activeIdx === idx;
            const itemNumber = item.number || item.id || String(idx + 1).padStart(2, '0');
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`flex items-center gap-2 px-5 py-3 rounded-sm font-mono text-[12px] tracking-wider uppercase transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? "bg-[#C98A2E] text-[#0B1726] font-bold border-[#C98A2E] shadow-lg"
                    : "bg-[#14243A]/60 text-white/70 hover:text-white hover:bg-[#14243A] border-white/10"
                }`}
              >
                <span className={isSelected ? "text-[#0B1726]/70" : "text-[#C98A2E]"}>
                  {itemNumber}
                </span>
                <span>{item.title || item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Equipment Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Active Photo Frame */}
          {activeImage && (
            <div className="lg:col-span-6 relative h-[360px] sm:h-[450px] lg:h-auto min-h-[360px] rounded-sm overflow-hidden border border-white/10 bg-[#14243A] group shadow-2xl">
              {activeImage.startsWith('http') || activeImage.startsWith('/uploads') || activeImage.startsWith('/cdn-images') ? (
                <img
                  src={activeImage}
                  alt={active.title || active.name || ""}
                  className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <Image
                  src={activeImage}
                  alt={active.title || active.name || ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
              )}

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1726] via-transparent to-transparent pointer-events-none" />

              {/* Active Technical Badge */}
              {cardBadge && (
                <div className="absolute bottom-6 left-6 z-10 bg-[#0B1726]/90 border border-white/15 px-3.5 py-1.5 rounded-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2E]" />
                  <span className="text-white text-[11px] font-mono tracking-wider uppercase font-semibold">
                    {cardBadge}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Right: Data Specification Card */}
          <div className={`${activeImage ? "lg:col-span-6" : "lg:col-span-12"} bg-[#14243A]/70 border border-white/10 p-8 sm:p-10 rounded-sm text-left flex flex-col justify-between shadow-2xl relative`}>
            {/* Corner brackets */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C98A2E]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C98A2E]" />

            <div>
              {(cardCategory || cardStatus) && (
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                  {cardCategory ? (
                    <span className="text-[11px] font-mono text-[#C98A2E] tracking-widest uppercase font-bold">
                      {cardCategory}
                    </span>
                  ) : <span />}
                  {cardStatus && (
                    <span className="text-[11px] font-mono text-white/40 uppercase">
                      {cardStatus}
                    </span>
                  )}
                </div>
              )}

              <h3 className="display-heading text-[24px] sm:text-[30px] md:text-[34px] text-white leading-tight font-bold mb-4">
                {active.title || active.name}
              </h3>

              {active.description && (
                <p className="text-[#A9AFB5] text-[14.5px] leading-[1.8] font-light mb-6">
                  {stripHtml(active.description)}
                </p>
              )}

              {/* Dynamic Benefits / Key Features */}
              {activeBenefits && activeBenefits.length > 0 && (
                <div className="space-y-2.5 mb-8 pt-4 border-t border-white/[0.08]">
                  {featuresTitle && (
                    <span className="text-[10.5px] font-mono uppercase tracking-widest text-white/40 block mb-2">
                      {featuresTitle}
                    </span>
                  )}
                  {activeBenefits.map((b: any, bIdx: number) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-[13.5px] text-white/90">
                      <CheckCircle2 size={15} className="text-[#C98A2E] mt-0.5 flex-shrink-0" />
                      <span>{typeof b === 'string' ? b : (b.title || b.text || "")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-4">
              {active.slug && (
                <Link
                  href={`/${active.slug}/`}
                  className="btn-gold text-[11px] font-mono uppercase tracking-widest px-6 py-3.5"
                >
                  <span>{ctaLearnMore || "Learn More"}</span>
                  <ArrowRight size={13} className="ml-1.5" />
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondaryUrl}
                  className="btn-outline-white text-[11px] font-mono uppercase tracking-widest px-6 py-3.5"
                >
                  <span>{ctaSecondary}</span>
                </Link>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}