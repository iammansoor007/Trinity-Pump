"use client";

import Image from "next/image";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

interface StatsSectionProps {
  data?: any;
  pageData?: any;
}

export default function StatsSection({ data, pageData }: StatsSectionProps = {}) {
  const content = useContent();
  const stats = data || pageData?.content?.stats || content?.stats || {};

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

  const cleanLabel = stripHtml(label || "");
  const cleanTitle1 = stripHtml(titleLine1 || "");
  const cleanTitle2 = stripHtml(titleLine2 || "");
  const cleanTitleItalic = stripHtml(titleItalicWord || "");
  const cleanDescription = stripHtml(description || "");

  if (!stats || (!cleanLabel && !cleanTitle1 && !cleanTitle2 && !cleanTitleItalic && !cleanDescription && (!items || items.length === 0) && !image)) {
    return null;
  }

  const hasImage = Boolean(image);
  const isRawImage = image && (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images'));

  return (
    <section className="bg-paper section-y">
      <div className="site-container">
        <div className={`grid grid-cols-1 ${hasImage ? "lg:grid-cols-12 gap-12 lg:gap-16" : ""} items-center`}>

          {/* ── Editorial column ── */}
          <div className={hasImage ? "lg:col-span-7" : "max-w-3xl"}>
            {cleanLabel && <div className="eyebrow mb-6">{cleanLabel}</div>}

            {(cleanTitle1 || cleanTitle2 || cleanTitleItalic) && (
              <h2 className="h-section text-balance mb-6">
                {cleanTitle1 && <span className="block">{cleanTitle1}</span>}
                {cleanTitle2 && <span>{cleanTitle2} </span>}
                {cleanTitleItalic && (
                  <span className="accent-word">{cleanTitleItalic}</span>
                )}
              </h2>
            )}

            {cleanDescription && (
              <p className="lede text-pretty mb-12">
                {cleanDescription}
              </p>
            )}

            {/* Metrics — hairline grid, no cards */}
            {items && items.length > 0 && (
              <div className={`grid grid-cols-2 ${items.length >= 4 ? "sm:grid-cols-4" : items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} rule-grid`}>
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="px-5 py-6 first:pl-0">
                    {item.value && (
                      <span className="figure-lg block mb-2">{item.value}</span>
                    )}
                    {item.label && (
                      <span className="block text-[12.5px] leading-snug text-[color:var(--text-muted)]">
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Image ── */}
          {hasImage && (
            <div className="lg:col-span-5">
              <div className="frame frame-zoom relative h-[380px] sm:h-[460px] lg:h-[540px] w-full border border-line">
                {isRawImage ? (
                  <img
                    src={image}
                    alt={imageAlt || cleanTitle1 || cleanLabel || ""}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={imageAlt || cleanTitle1 || cleanLabel || ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                )}

                {cleanLabel && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/85 to-transparent px-6 pt-14 pb-5">
                    <span className="meta text-white/80">{cleanLabel}</span>
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
