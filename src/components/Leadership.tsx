"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "../hooks/useContent";

interface LeadershipProps {
  data?: any;
  pageData?: any;
}

export default function Leadership({ data, pageData }: LeadershipProps = {}) {
  const content = useContent();
  const leadership = data || pageData?.content?.leadership || content?.leadership || {};
  const globalMetadata = pageData?.content?.globalMetadata || content?.globalMetadata || {};

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

  if (!leadership || (!title && !signatureName && !image && !desc1)) return null;

  const isRawImage = image && (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images'));

  return (
    <section className="bg-paper section-y">
      <div className="site-container">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          {label && <div className="eyebrow mb-6">{label}</div>}
          {title && <h2 className="h-section text-balance mb-4">{title}</h2>}
          {tagline && (
            <p className="accent-word text-[21px] md:text-[26px] leading-snug">
              {tagline}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${image ? "lg:grid-cols-12 gap-10 lg:gap-14" : ""} items-start`}>

          {/* Portrait */}
          {image && (
            <div className="lg:col-span-5">
              <div className="frame frame-zoom relative w-full h-[440px] sm:h-[540px] lg:h-[620px] border border-line">
                {isRawImage ? (
                  <img
                    src={image}
                    alt={imageAlt || title || signatureName || ""}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={imageAlt || title || signatureName || ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top"
                  />
                )}

                {photoBadge && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/85 to-transparent px-6 pt-16 pb-5">
                    <span className="meta text-white/85">{photoBadge}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Narrative */}
          <div className={`${image ? "lg:col-span-7" : "max-w-3xl"} flex flex-col justify-between`}>
            <div>
              {desc1 && (
                <div
                  className="lede text-pretty mb-8 [&_p]:mb-4 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: desc1 }}
                />
              )}

              {desc2 && (
                <div
                  className="border-l-2 border-gold pl-6 sm:pl-7 py-1 mb-8 text-[16px] md:text-[17px] leading-[1.7] text-ink-900 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-ink-900"
                  dangerouslySetInnerHTML={{ __html: desc2 }}
                />
              )}
            </div>

            {((signatureName || signatureTitle) || ctaMore) && (
              <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {(signatureName || signatureTitle) && (
                  <div>
                    {signatureName && (
                      <span className="block font-display text-[26px] leading-tight text-ink-900">
                        {signatureName}
                      </span>
                    )}
                    {signatureTitle && (
                      <span className="meta block mt-2">{signatureTitle}</span>
                    )}
                  </div>
                )}

                {ctaMore && (
                  <Link href={targetLink} className="btn btn-outline btn-sm group flex-shrink-0">
                    <span>{ctaMore}</span>
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
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
