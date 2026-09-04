"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";

export default function Leadership() {
  const { leadership, globalMetadata } = useContent();

  const {
    label,
    title,
    tagline,
    desc1,
    desc2,
    photoBadge,
    ctaMore,
    ctaLink,
    signatureName,
    signatureTitle,
    image,
    imageAlt
  } = leadership || {};

  const targetLink = ctaLink || globalMetadata?.bookingUrl || "/contact-us/";

  if (!leadership && !title) return null;

  return (
    <section className="bg-[#F5F3EE] py-24 md:py-32 relative overflow-hidden border-t border-[#E8E6E0]">
      {/* Precision architectural background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-grid-pattern-black pointer-events-none" />

      <div className="site-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          {label && (
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-[2px] bg-[#C98A2E]" />
              <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                {label}
              </p>
            </div>
          )}
          {title && (
            <h2 className="display-heading text-[32px] min-[400px]:text-[38px] md:text-[46px] text-[#0B1726] leading-[1.1] mb-3 font-extrabold tracking-tight">
              {title}
            </h2>
          )}
          {tagline && (
            <p className="text-[#C98A2E] font-serif italic text-[18px] md:text-[22px] font-medium">
              {tagline}
            </p>
          )}
        </div>

        {/* Asymmetrical Executive Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Executive Narrative & Directives (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 md:p-12 bg-white border border-[#D6D3CC] shadow-sm relative rounded-sm text-left">
            {/* Top corner technical accent */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C98A2E]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C98A2E]" />

            <div>
              {desc1 && (
                <div
                  className="text-[#5E6670] text-[15px] md:text-[16.5px] leading-[1.8] mb-6 font-normal"
                  dangerouslySetInnerHTML={{ __html: desc1 }}
                />
              )}

              {desc2 && (
                <div
                  className="text-[#0B1726] text-[14.5px] md:text-[15.5px] leading-[1.8] p-5 sm:p-6 bg-[#F5F3EE] border-l-2 border-[#C98A2E] border-y border-r border-[#E8E6E0] rounded-sm font-medium"
                  dangerouslySetInnerHTML={{ __html: desc2 }}
                />
              )}
            </div>

            {/* Signature & Sign-off Block */}
            <div className="pt-8 mt-8 border-t border-[#E8E6E0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {(signatureName || signatureTitle) && (
                <div>
                  {signatureName && (
                    <span className="text-[#0B1726] font-bold text-[20px] block font-serif tracking-wide">
                      {signatureName}
                    </span>
                  )}
                  {signatureTitle && (
                    <span className="text-[#5E6670] font-mono text-[11.5px] uppercase tracking-wider block mt-0.5">
                      {signatureTitle}
                    </span>
                  )}
                </div>
              )}

              {ctaMore && (
                <Link
                  href={targetLink}
                  className="btn-gold inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest px-6 py-3.5"
                >
                  <span>{ctaMore}</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>

          {/* Executive Profile Frame (5 cols) */}
          {image && (
            <div className="lg:col-span-5 relative flex flex-col">
              <div className="relative w-full h-[420px] sm:h-[500px] lg:h-full min-h-[420px] rounded-sm overflow-hidden shadow-xl border border-[#D6D3CC] bg-[#0B1726] group">
                {image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images') ? (
                  <img
                    src={image}
                    alt={imageAlt || title || "Leadership"}
                    className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={imageAlt || title || "Leadership"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                )}

                {/* Industrial gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1726]/85 via-transparent to-transparent pointer-events-none" />

                {/* Floating technical credential tag */}
                {photoBadge && (
                  <div className="absolute bottom-6 left-6 z-20 bg-[#0B1726]/95 text-[#C98A2E] font-mono text-[11px] font-bold tracking-widest uppercase px-4 py-2 border border-[#C98A2E]/50 shadow-xl rounded-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2E] animate-pulse" />
                    <span>{photoBadge}</span>
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
