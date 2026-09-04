"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  ctaAll = "View All Articles",
  ctaReadMore = "Read Article",
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
    <section id="blog" className="bg-[#F5F3EE] py-20 md:py-28 overflow-hidden border-t border-[#E8E6E0]">
      <div className="site-container">

        {/* ── Header ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-[2px] bg-[#C98A2E]" />
              <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                {subtitle}
              </p>
            </div>
            <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[42px] text-[#0B1726] leading-tight font-bold tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={viewAllLink}
              className="flex items-center gap-2 text-[#C98A2E] text-[12px] font-bold tracking-[0.14em] uppercase hover:gap-3 transition-all duration-200"
            >
              {ctaAll} <ArrowRight size={14} />
            </Link>

            {/* Slider Navigation Buttons */}
            {hasSlider && (
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={handlePrev}
                  aria-label="Previous article"
                  className="w-9 h-9 rounded-sm border border-[#D6D3CC] bg-white text-[#0B1726]/70 hover:border-[#C98A2E] hover:text-[#C98A2E] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next article"
                  className="w-9 h-9 rounded-sm border border-[#D6D3CC] bg-white text-[#0B1726]/70 hover:border-[#C98A2E] hover:text-[#C98A2E] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Sliding Track Carousel ──────────────── */}
        <div className="relative overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
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
                  className="flex-shrink-0 px-3 md:px-4"
                >
                  <article className="blog-card group bg-white border border-[#D6D3CC] hover:border-[#C98A2E] hover:shadow-xl rounded-sm overflow-hidden flex flex-col h-full transition-all duration-300 text-left">
                    <Link href={postUrl} className="flex flex-col flex-1 no-underline">

                      {/* Image */}
                      <div className="relative h-[210px] w-full overflow-hidden bg-[#0B1726]">
                        {post.featuredImage ? (
                          <Image
                            src={normalizeBlogImage(post.featuredImage)}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#14243A] flex items-center justify-center">
                            <ArrowRight size={32} className="text-[#C98A2E]/30" />
                          </div>
                        )}
                        {/* Tag chip */}
                        {tag && (
                          <span className="absolute top-3 left-3 bg-[#0B1726]/90 backdrop-blur-sm border border-[#C98A2E]/40 text-[#C98A2E] text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
                            {tag}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
                        <div>
                          <h3 className="text-[#0B1726] font-bold text-[16px] sm:text-[17px] leading-snug mb-2.5 group-hover:text-[#C98A2E] transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h3>
                          {cleanExcerpt && (
                            <p className="text-[#5E6670] text-[13px] leading-relaxed mb-4 line-clamp-2 font-normal">
                              {cleanExcerpt}
                            </p>
                          )}
                        </div>
                        <span className="flex items-center gap-2 text-[#C98A2E] text-[11.5px] font-bold tracking-wider uppercase group-hover:gap-3 transition-all duration-200 pt-3 border-t border-[#E8E6E0]">
                          {ctaReadMore} <ArrowRight size={13} />
                        </span>
                      </div>

                    </Link>
                  </article>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile / Tablet Pagination Dots */}
        {hasSlider && (
          <div className="flex justify-center items-center gap-2 mt-8 md:hidden">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  currentIndex === idx ? "bg-[#C98A2E] w-6" : "bg-black/20 w-2 hover:bg-[#C98A2E]/50"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

