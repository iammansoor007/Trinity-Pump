"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import StatsSection from "@/components/StatsSection";
import Services from "@/components/Services";
import { useContent } from "@/hooks/useContent";

const Leadership = dynamic(() => import("@/components/Leadership"));
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const HowWeWork = dynamic(() => import("@/components/HowWeWork"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"), { ssr: false });
const CtaBanner = dynamic(() => import("@/components/CtaBanner"), { ssr: false });

export default function HomeTemplate({ pageData, params }: { pageData?: any; params?: any }) {
  const { allBlogs, blogSection } = useContent();

  const heroData = pageData?.content?.hero;
  const statsData = pageData?.content?.stats;
  const servicesData = pageData?.content?.services;
  const leadershipData = pageData?.content?.leadership;
  const processData = pageData?.content?.process || pageData?.content?.howWeWork;
  const testimonialsData = pageData?.content?.testimonials;
  const ctaBannerData = pageData?.content?.ctaBanner;
  const contactFaqData = pageData?.content?.contactFaq || {
    ...(pageData?.content?.quote || {}),
    formLabel: pageData?.content?.quote?.section?.badge || pageData?.content?.quote?.badge || pageData?.content?.quote?.formLabel,
    formTitle: pageData?.content?.quote?.section?.headline || pageData?.content?.quote?.title || pageData?.content?.quote?.formTitle,
    formServicesOptions: pageData?.content?.quote?.services,
    faqLabel: pageData?.content?.faq?.section?.badge || pageData?.content?.faq?.badge,
    faqTitle: pageData?.content?.faq?.section?.headline || pageData?.content?.faq?.section?.title || pageData?.content?.faq?.title,
    faqs: pageData?.content?.faq?.items
  };
  const blogData = pageData?.content?.blogSection || blogSection;

  return (
    <div className="relative">
      <Hero data={heroData} pageData={pageData} />
      <StatsBar data={statsData} pageData={pageData} />
      <section id="achievements">
        <StatsSection data={statsData} pageData={pageData} />
      </section>
      <section id="services">
        <Services data={servicesData} pageData={pageData} />
      </section>
      <section id="leadership">
        <Leadership data={leadershipData} pageData={pageData} />
      </section>
      <section id="about">
        <HowWeWork data={processData} pageData={pageData} />
      </section>
      <Testimonials data={testimonialsData} pageData={pageData} />
      <CtaBanner data={ctaBannerData} pageData={pageData} />
      <section id="contact">
        <QAForm data={contactFaqData} pageData={pageData} />
      </section>

      <BlogSection
        title={blogData?.title}
        subtitle={blogData?.subtitle}
        description={blogData?.description}
        ctaAll={blogData?.ctaAll}
        ctaReadMore={blogData?.ctaReadMore}
        viewAllLink={blogData?.viewAllLink}
        posts={(() => {
          const selected = blogData?.selectedPosts || [];
          const filtered = Array.isArray(selected) && selected.length > 0
            ? allBlogs.filter((p: any) => selected.map(String).includes(String(p._id)))
            : [];
          return filtered.length > 0 ? filtered : (allBlogs.length > 0 ? allBlogs.slice(0, 3) : []);
        })()}
      />
    </div>
  );
}
