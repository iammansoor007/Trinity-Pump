"use client";

import { PhoneCall, ArrowRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

interface CtaBannerProps {
  data?: any;
  pageData?: any;
}

export default function CtaBanner({ data, pageData }: CtaBannerProps = {}) {
  const content = useContent();
  const ctaBanner = data || pageData?.content?.ctaBanner || content?.ctaBanner || {};
  const globalMetadata = pageData?.content?.globalMetadata || content?.globalMetadata || {};
  const footer = pageData?.content?.footer || content?.footer || {};

  const {
    tagline,
    title,
    description,
    button,
    btnUrl,
    buttonUrl
  } = ctaBanner || {};

  if (!ctaBanner || (!title && !tagline && !button)) return null;

  const phone = ctaBanner?.phone || footer?.contact?.phone || "";
  const isCallAction = button ? (button.toLowerCase().includes("call") || button.toLowerCase().includes("tel") || button.toLowerCase().includes("phone")) : false;
  const defaultActionUrl = isCallAction && phone
    ? `tel:${phone.replace(/[^\d+]/g, '')}`
    : (globalMetadata?.bookingUrl || "/contact-us/");
  const actionUrl = btnUrl || buttonUrl || defaultActionUrl;

  const cleanTagline = stripHtml(tagline || "");
  const cleanTitle = stripHtml(title || "");
  const cleanDescription = stripHtml(description || "");

  return (
    <section className="bg-[#0B1726] relative overflow-hidden py-16 md:py-20 border-y border-white/[0.08]">
      {/* Precision background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-grid-pattern-dark pointer-events-none" />

      {/* Industrial ambient accent circles */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/[0.04] hidden lg:block pointer-events-none" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/[0.04] hidden lg:block pointer-events-none" />

      <div className="site-container relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left z-10">
        
        {/* Left: Icon + Statement Narrative */}
        <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-8">
          <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-sm bg-[#14243A] border border-[#C98A2E]/50 flex items-center justify-center text-[#C98A2E] shadow-xl">
            <PhoneCall size={26} className="md:w-7 md:h-7" strokeWidth={1.8} />
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            {cleanTagline && (
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C98A2E] inline-block animate-pulse" />
                <p className="text-[#C98A2E] text-[10.5px] md:text-[11.5px] font-bold tracking-[0.2em] uppercase font-mono">
                  {cleanTagline}
                </p>
              </div>
            )}
            
            {cleanTitle && (
              <h3 className="display-heading text-[22px] min-[400px]:text-[26px] md:text-[32px] text-white leading-tight mb-2 font-bold">
                {cleanTitle}
              </h3>
            )}

            {cleanDescription && (
              <p className="text-[#A9AFB5] text-[13.5px] md:text-[14.5px] max-w-xl font-light">
                {cleanDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right: Action Button */}
        {button && (
          <div className="flex-shrink-0 w-full md:w-auto">
            <a
              href={actionUrl}
              className="btn-gold text-[11.5px] md:text-[12px] px-8 py-4 shadow-2xl w-full md:w-auto justify-center text-center font-bold tracking-widest uppercase"
            >
              <span>{button}</span>
              <ArrowRight size={14} className="ml-1.5" />
            </a>
          </div>
        )}

      </div>
    </section>
  );
}
