"use client";

import { CalendarRange, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function CtaBanner() {
  const { ctaBanner, globalMetadata } = useContent();

  const {
    tagline = "Take the First Step",
    title = "Ready to Feel Your Best?",
    description = "Book your appointment today and start your journey to a pain-free, stronger you.",
    button = "BOOK APPOINTMENT",
    btnUrl = "",
    buttonUrl = ""
  } = ctaBanner || {};

  const bookingUrl = btnUrl || buttonUrl || globalMetadata?.bookingUrl || "/contact-us/";

  return (
    <section className="bg-dark relative overflow-hidden py-14 md:py-16 border-y border-white/10">

      {/* Subtle radial dots texture */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-radial-dots-gold pointer-events-none"
      />

      {/* Left decorative circle */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[30px] border-white/[0.02] hidden md:block" />
      {/* Right decorative circle */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[30px] border-white/[0.02] hidden md:block" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="site-container relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
      >

        {/* Left: Icon + Text */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
          {/* Calendar icon with refined gold treatment */}
          <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <CalendarRange size={24} className="md:w-7 md:h-7" strokeWidth={1.8} />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-gold text-[10.5px] md:text-[12px] font-bold tracking-[0.18em] uppercase mb-1.5 font-mono">
              {stripHtml(tagline)}
            </p>
            <h3 className="display-heading text-[22px] min-[400px]:text-[26px] md:text-[32px] text-white leading-tight mb-2">
              {stripHtml(title)}
            </h3>
            <p className="text-white/70 text-[13.5px] md:text-[14.5px] max-w-xl font-light">
              {stripHtml(description)}
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-[11px] md:text-[12px] px-8 py-4 shadow-xl w-full md:w-auto justify-center text-center"
          >
            {button} <ArrowRight size={14} className="ml-1.5" />
          </a>
        </div>

      </motion.div>
    </section>
  );
}
