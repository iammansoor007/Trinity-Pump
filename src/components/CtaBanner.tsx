"use client";

import { ArrowRight, Phone } from "lucide-react";
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
    <section className="on-ink bg-ink-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] bg-grid-pattern-dark pointer-events-none" />

      <div className="site-container relative z-10 section-y-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">

          <div className="max-w-2xl">
            {cleanTagline && (
              <div className="eyebrow eyebrow-on-ink mb-6">{cleanTagline}</div>
            )}

            {cleanTitle && (
              <h2 className="h-section text-white text-balance mb-4">
                {cleanTitle}
              </h2>
            )}

            {cleanDescription && (
              <p className="lede lede-on-ink text-pretty">{cleanDescription}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            {button && (
              <a href={actionUrl} className="btn btn-primary group">
                {isCallAction && <Phone size={14} />}
                <span>{button}</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            )}

            {phone && !isCallAction && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="btn btn-outline-ink"
              >
                <Phone size={14} />
                <span className="tnum">{phone}</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
