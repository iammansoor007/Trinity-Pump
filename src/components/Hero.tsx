"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function HeroSection() {
  const { hero, globalMetadata, footer } = useContent();

  const {
    label,
    title1,
    title2,
    description,
    ctaBook,
    ctaServices,
    socialProofText,
    image,
    imageAlt
  } = hero || {};

  const cleanLabel = stripHtml(label || "");
  const cleanTitle1 = stripHtml(title1 || "");
  const cleanTitle2 = stripHtml(title2 || "");
  const cleanDescription = stripHtml(description || "");
  const cleanSocialProof = stripHtml(socialProofText || "");

  const phone = footer?.contact?.phone || "";
  const isCallAction = ctaBook ? (ctaBook.toLowerCase().includes("call") || ctaBook.includes("830")) : false;
  const ctaLink = isCallAction && phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : (globalMetadata?.bookingUrl || "/contact-us/");

  if (!hero && !title1) return null;

  return (
    <section className="relative bg-[#0B1726] min-h-[90vh] flex items-center overflow-hidden border-b border-white/[0.08]">
      {/* Precision architectural technical grid overlay */}
      <div className="absolute inset-0 opacity-[0.035] bg-grid-pattern-dark pointer-events-none z-10" />

      {/* Subtle gold depth glow */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-[#C98A2E]/[0.06] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── Industrial Background Image Layer ──────────────────── */}
      {image && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images') ? (
            <img
              src={image}
              alt={imageAlt || cleanTitle1 || "Hero Banner"}
              className="w-full h-full object-cover object-center filter contrast-110 brightness-90"
            />
          ) : (
            <Image
              src={image}
              alt={imageAlt || cleanTitle1 || "Hero Banner"}
              fill
              sizes="100vw"
              className="object-cover object-center filter contrast-110 brightness-90"
              priority
            />
          )}

          {/* High-Contrast Industrial Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1726] via-[#0B1726]/90 to-[#0B1726]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1726] via-transparent to-[#0B1726]/80" />
        </div>
      )}

      {/* ── Main Hero Content ──────────────────────────────────── */}
      <div className="relative site-container pt-36 pb-20 md:pt-44 md:pb-28 w-full z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Command Statement (8 cols) */}
          <div className="lg:col-span-8 text-left flex flex-col items-start">
            {/* Dynamic Telemetry Eyebrow */}
            {cleanLabel && (
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#14243A] border border-[#C98A2E]/40 text-[#C98A2E] text-[10.5px] sm:text-[11.5px] font-mono font-bold tracking-[0.2em] uppercase rounded-sm shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#C98A2E] animate-pulse"></span>
                  {cleanLabel}
                </span>
              </div>
            )}

            {/* Dynamic Headline */}
            <h1 className="display-heading text-[36px] min-[400px]:text-[42px] sm:text-[52px] md:text-[62px] lg:text-[66px] text-white leading-[1.08] tracking-tight mb-6 font-black">
              {cleanTitle1 && <span className="block">{cleanTitle1}</span>}
              {cleanTitle2 && (
                <span className="text-[#C98A2E] block mt-1 font-serif italic font-normal">
                  {cleanTitle2}
                </span>
              )}
            </h1>

            {/* Dynamic Description */}
            {cleanDescription && (
              <p className="text-[#A9AFB5] text-[15px] sm:text-[16.5px] md:text-[18px] leading-[1.75] font-light max-w-[620px] mb-8">
                {cleanDescription}
              </p>
            )}

            {/* Dynamic Action CTAs */}
            {(ctaBook || ctaServices) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
                {ctaBook && (
                  <a
                    href={ctaLink}
                    className="btn-gold flex items-center justify-center gap-2 text-[12px] font-mono tracking-widest uppercase px-8 py-4 shadow-xl"
                  >
                    {isCallAction && <Phone size={14} className="fill-current" />}
                    <span>{ctaBook}</span>
                    <ArrowRight size={14} />
                  </a>
                )}

                {ctaServices && (
                  <Link
                    href="/services/"
                    className="btn-outline-white flex items-center justify-center gap-2 text-[12px] font-mono tracking-widest uppercase px-7 py-4"
                  >
                    <span>{ctaServices}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Industrial Telemetry HUD Card (4 cols) */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-[#14243A]/80 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-sm text-left shadow-2xl relative">
              {/* Corner brackets */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C98A2E]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C98A2E]" />

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <span className="text-[10.5px] font-mono tracking-widest text-[#C98A2E] uppercase font-bold">
                  PERMIAN OPERATIONS
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE DISPATCH
                </span>
              </div>

              {cleanSocialProof && (
                <div className="mb-5">
                  <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block mb-1.5">
                    VERIFIED CREDENTIALS
                  </span>
                  <p className="text-white/90 text-[13.5px] font-medium leading-relaxed">
                    {cleanSocialProof}
                  </p>
                </div>
              )}

              {phone && (
                <div className="pt-4 border-t border-white/[0.08]">
                  <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block mb-1">
                    24/7 HOTLINE
                  </span>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    className="text-[#C98A2E] font-mono text-[16px] sm:text-[18px] font-bold tracking-wider hover:underline block"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
