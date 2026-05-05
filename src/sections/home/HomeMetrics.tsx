import React from 'react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function Metrics() {
  const { content, locale } = useSiteContent();

  return (
    <section className="bg-black py-32 md:py-36 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 lg:gap-20">
          {content.home.metrics.items.map((stat, i) => (
            <div key={`${stat.value}-${i}`} className="space-y-4 md:space-y-5">
              <p className="text-6xl md:text-8xl font-black text-white tracking-ultra-tight leading-[0.94]">{stat.value}</p>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-px bg-premium-orange" />
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 leading-relaxed">{t(locale, stat.label)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
