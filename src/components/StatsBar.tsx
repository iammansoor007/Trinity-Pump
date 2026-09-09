"use client";

import { useContent } from "../hooks/useContent";

interface StatsBarProps {
  data?: any;
  pageData?: any;
}

export default function StatsBar({ data, pageData }: StatsBarProps = {}) {
  const content = useContent();
  const stats = data || pageData?.content?.stats || content?.stats || {};
  const items = Array.isArray(stats?.items) ? stats.items : (Array.isArray(stats?.barItems) ? stats.barItems : []);

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-ink-900 relative z-10">
      <div className="site-container">
        <div className="grid grid-cols-2 md:grid-cols-4 rule-grid-ink border-b-0">
          {items.map((stat: any, idx: number) => {
            const indexLabel = stat.tag || stat.index || (stats.indexPrefix ? `${stats.indexPrefix} ${idx + 1}` : "");

            return (
              <div key={idx} className="px-6 py-8 md:px-8 md:py-10">
                {indexLabel && (
                  <div className="meta meta-on-ink mb-4">
                    {indexLabel}
                  </div>
                )}

                {stat.value && (
                  <span className="figure-xl figure-on-ink block mb-2.5">
                    {stat.value}
                  </span>
                )}

                {stat.label && (
                  <span className="block text-[13px] leading-snug text-white/60">
                    {stat.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
