"use client";

import Image from "next/image";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function StatsSection() {
  const { stats } = useContent();

  const {
    label,
    titleLine1,
    titleLine2,
    titleItalicWord,
    description,
    image,
    imageAlt,
    items = []
  } = stats || {};

  if (!stats) return null;

  return (
    <section className="bg-[#E8E6E0] py-24 md:py-32 relative overflow-hidden border-y border-[#D6D3CC]">
      {/* Precision architectural technical pattern */}
      <div className="absolute inset-0 opacity-[0.025] bg-grid-pattern-black pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Left Column: Editorial & Dynamic Metrics (7 cols) ── */}
          <div className="lg:col-span-7 text-left flex flex-col justify-between">
            <div>
              {label && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 h-[2px] bg-[#C98A2E]" />
                  <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                    {stripHtml(label)}
                  </p>
                </div>
              )}

              {(titleLine1 || titleLine2 || titleItalicWord) && (
                <h2 className="display-heading text-[30px] min-[400px]:text-[36px] md:text-[44px] text-[#0B1726] leading-[1.12] mb-6 font-extrabold tracking-tight">
                  {titleLine1 && <span>{stripHtml(titleLine1)}<br /></span>}
                  {titleLine2 && <span>{stripHtml(titleLine2)} </span>}
                  {titleItalicWord && <span className="text-[#C98A2E] font-serif italic">{stripHtml(titleItalicWord)}</span>}
                </h2>
              )}

              {description && (
                <div className="border-l-2 border-[#C98A2E] pl-5 py-1 mb-8">
                  <p className="text-[#5E6670] text-[15px] md:text-[16.5px] leading-[1.8] font-normal">
                    {stripHtml(description)}
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Telemetry Metrics Panel (Only rendered if items exist in CMS) */}
            {items && items.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {items.slice(0, 4).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-[#D6D3CC] rounded-sm text-left shadow-sm"
                  >
                    <span className="text-[#C98A2E] font-serif text-[24px] sm:text-[28px] font-bold block leading-none mb-1">
                      {item.value}
                    </span>
                    <span className="text-[#5E6670] text-[10.5px] font-mono uppercase tracking-wider font-semibold block leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right Column: Architectural Blueprint Frame (5 cols) ── */}
          {image && (
            <div className="lg:col-span-5 relative">
              <div className="relative h-[340px] sm:h-[440px] md:h-[500px] w-full rounded-sm overflow-hidden shadow-2xl border border-[#D6D3CC] group bg-[#0B1726]">
                {image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images') ? (
                  <img
                    src={image}
                    alt={imageAlt || "Trinity Standards"}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={imageAlt || "Trinity Standards"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                    priority
                  />
                )}

                {/* Corner technical brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 m-3 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#C98A2E]" />
                  <div className="absolute top-0 left-0 h-full w-[2px] bg-[#C98A2E]" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 m-3 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#C98A2E]" />
                  <div className="absolute bottom-0 right-0 h-full w-[2px] bg-[#C98A2E]" />
                </div>

                {label && (
                  <div className="absolute bottom-4 left-4 bg-[#0B1726]/90 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2E]" />
                    <span className="text-white text-[10.5px] font-mono tracking-wider uppercase font-semibold">
                      {stripHtml(label)}
                    </span>
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