"use client";

import { useContent } from "../hooks/useContent";

export default function StatsBar() {
  const { stats } = useContent();
  const items = stats?.items || [];

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-[#08101C] border-y border-white/[0.08] py-8 md:py-10 relative z-20">
      <div className="site-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.slice(0, 4).map((stat: any, idx: number) => (
            <div 
              key={idx} 
              className="relative flex flex-col items-center sm:items-start text-center sm:text-left p-5 md:p-6 bg-[#0B1726]/60 border border-white/[0.06] hover:border-[#C98A2E]/40 hover:bg-[#14243A]/50 transition-all duration-300 group rounded-sm"
            >
              {/* Technical corner accent */}
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#C98A2E]/40 group-hover:border-[#C98A2E] transition-colors" />

              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
                INDEX // 0{idx + 1}
              </div>

              <span className="text-[#C98A2E] font-serif text-[32px] sm:text-[36px] md:text-[40px] font-bold block leading-none mb-2 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </span>
              <span className="text-[#A9AFB5] text-[11px] sm:text-[12px] font-mono uppercase tracking-wider font-semibold leading-snug">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
