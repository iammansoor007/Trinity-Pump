"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

interface HeroProps {
  data?: any;
  pageData?: any;
}

export default function HeroSection({ data, pageData }: HeroProps = {}) {
  const content = useContent();
  const hero = data || pageData?.content?.hero || content?.hero || {};
  const globalMetadata = pageData?.content?.globalMetadata || content?.globalMetadata || {};
  const footer = pageData?.content?.footer || content?.footer || {};

  const {
    label,
    title1,
    title2,
    description,
    ctaBook,
    ctaBookUrl,
    ctaServices,
    ctaServicesUrl,
    socialProofText,
    socialProofLabel,
    cardBadge,
    statusText,
    hotlineLabel,
    image,
    imageAlt
  } = hero || {};

  const cleanLabel = stripHtml(label || "");
  const cleanTitle1 = stripHtml(title1 || "");
  const cleanTitle2 = stripHtml(title2 || "");
  const cleanDescription = stripHtml(description || "");
  const cleanSocialProof = stripHtml(socialProofText || "");
  const cleanCardBadge = stripHtml(cardBadge || hero?.badgeRight || hero?.telemetryTitle || hero?.locationBadge || "");
  const cleanStatusText = stripHtml(statusText || hero?.liveStatus || hero?.dispatchText || "");
  const cleanSocialProofLabel = stripHtml(socialProofLabel || hero?.credentialsLabel || "");
  const cleanHotlineLabel = stripHtml(hotlineLabel || hero?.phoneLabel || "");

  const phone = hero?.phone || footer?.contact?.phone || "";
  const isCallAction = ctaBook ? (ctaBook.toLowerCase().includes("call") || ctaBook.toLowerCase().includes("tel") || ctaBook.toLowerCase().includes("phone")) : false;
  const ctaLink = ctaBookUrl || (isCallAction && phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : (globalMetadata?.bookingUrl || "/contact-us/"));
  const servicesUrl = ctaServicesUrl || hero?.ctaServicesLink || "/services/";

  const hasCardContent = Boolean(cleanCardBadge || cleanStatusText || cleanSocialProof || phone);

  if (!hero && !title1 && !cleanTitle1) return null;

  const isRawImage = image && (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images'));

  return (
    <section className="on-ink relative bg-ink-900 overflow-hidden">
      {/* ── Background image ─────────────────────────────────────────── */}
      {image && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {isRawImage ? (
            <img
              src={image}
              alt={imageAlt || cleanTitle1 || cleanTitle2 || ""}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <Image
              src={image}
              alt={imageAlt || cleanTitle1 || cleanTitle2 || ""}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          )}

          {/* Editorial scrim: readable on the left, image breathes on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/92 to-ink-900/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-ink-900/55" />
        </div>
      )}

      {/* Hairline grid, barely there */}
      <div className="absolute inset-0 z-0 opacity-[0.05] bg-grid-pattern-dark pointer-events-none" />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="site-container relative z-10 pt-36 pb-20 md:pt-44 md:pb-28 lg:pt-52 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-12 items-end">

          {/* Headline column */}
          <div className={hasCardContent ? "lg:col-span-7" : "lg:col-span-9"}>
            {cleanLabel && (
              <div className="eyebrow eyebrow-on-ink mb-7">
                {cleanLabel}
              </div>
            )}

            {(cleanTitle1 || cleanTitle2) && (
              <h1 className="h-display text-white text-balance mb-7">
                {cleanTitle1 && <span className="block">{cleanTitle1}</span>}
                {cleanTitle2 && (
                  <span className="accent-word accent-word-on-ink block">
                    {cleanTitle2}
                  </span>
                )}
              </h1>
            )}

            {cleanDescription && (
              <p className="lede lede-on-ink mb-10 text-pretty">
                {cleanDescription}
              </p>
            )}

            {(ctaBook || ctaServices) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {ctaBook && (
                  <a href={ctaLink} className="btn btn-primary group">
                    {isCallAction && <Phone size={14} />}
                    <span>{ctaBook}</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                )}

                {ctaServices && (
                  <Link href={servicesUrl} className="btn btn-outline-ink group">
                    <span>{ctaServices}</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Contact / credential panel */}
          {hasCardContent && (
            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border border-white/15 bg-ink-900/70 backdrop-blur-md rounded p-7 sm:p-8">

                {(cleanCardBadge || cleanStatusText) && (
                  <div className="flex items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
                    {cleanCardBadge ? (
                      <span className="meta text-gold-soft">{cleanCardBadge}</span>
                    ) : <span />}
                    {cleanStatusText && (
                      <span className="meta meta-on-ink inline-flex items-center gap-2 text-emerald-400/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {cleanStatusText}
                      </span>
                    )}
                  </div>
                )}

                {cleanSocialProof && (
                  <div className="mb-6">
                    {cleanSocialProofLabel && (
                      <span className="meta meta-on-ink block mb-2.5">
                        {cleanSocialProofLabel}
                      </span>
                    )}
                    <p className="text-white/90 text-[15px] leading-relaxed">
                      {cleanSocialProof}
                    </p>
                  </div>
                )}

                {phone && (
                  <div className={cleanSocialProof || cleanCardBadge || cleanStatusText ? "pt-5 border-t border-white/10" : ""}>
                    {cleanHotlineLabel && (
                      <span className="meta meta-on-ink block mb-2">
                        {cleanHotlineLabel}
                      </span>
                    )}
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center gap-2.5 text-white hover:text-gold-soft transition-colors font-heading text-[22px] font-medium tracking-tight tnum"
                    >
                      <Phone size={16} className="text-gold" />
                      <span>{phone}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
