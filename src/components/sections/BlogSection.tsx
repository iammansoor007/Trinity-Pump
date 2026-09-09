"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { normalizeBlogImage } from "@/lib/blogImage";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string | { name: string };
  categories?: string[];
  tags?: string[];
  category?: string;
}

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaAll?: string;
  ctaReadMore?: string;
  posts?: BlogPost[];
  viewAllLink?: string;
}

export default function BlogSection({
  title,
  subtitle,
  description,
  ctaAll,
  ctaReadMore,
  posts = [],
  viewAllLink = "/blogs/",
}: BlogSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!posts || posts.length === 0) return null;

  const maxIndex = Math.max(0, posts.length - cardsPerView);
  const hasSlider = posts.length > cardsPerView;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section id="blog" className="bg-paper section-y overflow-hidden">
      <div className="site-container">

        {/* ── Header ─────────────────────────────── */}
        {(title || subtitle || ctaAll) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              {subtitle && <div className="eyebrow mb-6">{subtitle}</div>}
              {title && <h2 className="h-section text-balance">{title}</h2>}
              {description && <p className="lede text-pretty mt-5">{description}</p>}
            </div>

            <div className="flex items-center gap-5 flex-shrink-0">
              {ctaAll && (
                <Link href={viewAllLink || "/blogs/"} className="link-arrow">
                  <span>{ctaAll}</span>
                  <ArrowRight size={14} />
                </Link>
              )}

              {hasSlider && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous article"
                    className="w-10 h-10 rounded border border-line-strong bg-paper-pure text-ink-900 hover:border-ink-900 hover:bg-paper-alt transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next article"
                    className="w-10 h-10 rounded border border-line-strong bg-paper-pure text-ink-900 hover:border-ink-900 hover:bg-paper-alt transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Sliding track ──────────────── */}
        <div className="relative overflow-hidden -mx-3 sm:mx-0">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * (100 / cardsPerView)}%`
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {posts.map((post) => {
              const rawCat = Array.isArray(post.categories) && post.categories[0];
              const rawTag = Array.isArray(post.tags) && post.tags[0];

              const tag =
                post.category ||
                (rawCat ? (typeof rawCat === "string" ? rawCat : (rawCat as any).name || "") : "") ||
                (rawTag ? (typeof rawTag === "string" ? rawTag : (rawTag as any).name || "") : "") ||
                "";

              const rawExcerpt = post.excerpt || "";
              const cleanExcerpt = rawExcerpt.replace(/<[^>]*>?/gm, "").trim();
              const postUrl = `/blogs/${post.slug}/`;

              return (
                <div
                  key={post._id}
                  style={{ width: `${100 / cardsPerView}%` }}
                  className="flex-shrink-0 px-3"
                >
                  <article className="group card card-hover overflow-hidden flex flex-col h-full">
                    <Link href={postUrl} className="flex flex-col flex-1 no-underline">

                      {/* Image */}
                      <div className="frame relative aspect-[16/10] w-full rounded-none">
                        {post.featuredImage ? (
                          <Image
                            src={normalizeBlogImage(post.featuredImage)}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="w-full h-full bg-ink-700 flex items-center justify-center">
                            <ArrowRight size={28} className="text-gold/30" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between">
                        <div>
                          {tag && <div className="meta text-gold-ink mb-4">{tag}</div>}

                          <h3 className="h-card mb-3 line-clamp-2 group-hover:text-gold-ink transition-colors duration-200">
                            {post.title}
                          </h3>

                          {cleanExcerpt && (
                            <p className="copy line-clamp-2 mb-6">{cleanExcerpt}</p>
                          )}
                        </div>

                        {ctaReadMore && (
                          <span className="link-arrow pt-5 border-t border-line">
                            {ctaReadMore} <ArrowRight size={13} />
                          </span>
                        )}
                      </div>

                    </Link>
                  </article>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Pagination dots */}
        {hasSlider && (
          <div className="flex justify-center items-center gap-2 mt-10 md:hidden">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-200 ${
                  currentIndex === idx ? "bg-gold w-7" : "bg-line-strong w-3 hover:bg-gold/50"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
