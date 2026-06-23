import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function Metrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();

  useGsap(() => {
    const stats = gsap.utils.toArray('.metric-item');

    stats.forEach((item: any, i) => {
      const valueEl = item.querySelector('.metric-value');
      const labelEl = item.querySelector('.metric-label');

      gsap.from(item, {
        y: 50,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      if (valueEl) {
        gsap.from(valueEl, {
          y: 30,
          opacity: 0,
          duration: 1.2,
          ease: 'power4.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      if (labelEl) {
        gsap.from(labelEl, {
          x: -20,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2 + i * 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black py-32 md:py-36 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 lg:gap-20">
          {content.home.metrics.items.map((stat, i) => (
            <div key={`${stat.value}-${i}`} className="metric-item space-y-4 md:space-y-5">
              <p className="metric-value text-6xl md:text-8xl font-black text-white tracking-ultra-tight leading-[0.94]">{stat.value}</p>
              <div className="metric-label flex items-center gap-3 md:gap-4">
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
