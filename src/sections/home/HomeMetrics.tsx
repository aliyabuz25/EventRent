import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function Metrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();

  useGsap(() => {
    // Section fade-in
    gsap.from('.metrics-eyebrow', {
      y: 20, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 82%', once: true },
    });

    gsap.utils.toArray<HTMLElement>('.metric-item').forEach((item, i) => {
      // Card entrance
      gsap.from(item, {
        y: 50, opacity: 0, duration: 1.0, ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
      });

      // Number counter animation
      const valueEl = item.querySelector<HTMLElement>('.metric-value');
      if (valueEl) {
        const raw = valueEl.dataset.raw ?? '0';
        const suffix = valueEl.dataset.suffix ?? '';
        const numericVal = parseFloat(raw);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericVal,
          duration: 2.2,
          ease: 'power2.out',
          delay: i * 0.12 + 0.3,
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%', once: true },
          onUpdate() {
            const display = Number.isInteger(numericVal)
              ? Math.round(obj.val).toString()
              : obj.val.toFixed(1);
            if (valueEl) valueEl.textContent = display + suffix;
          },
        });
      }

      // Label slide
      const labelEl = item.querySelector<HTMLElement>('.metric-label');
      if (labelEl) {
        gsap.from(labelEl, {
          x: -20, opacity: 0, duration: 0.8, ease: 'power2.out',
          delay: 0.25 + i * 0.12,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
        });
      }

      // Accent bar
      const bar = item.querySelector<HTMLElement>('.metric-bar');
      if (bar) {
        gsap.fromTo(bar, { scaleX: 0 }, {
          scaleX: 1, duration: 1.4, ease: 'expo.out',
          delay: i * 0.1 + 0.4,
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%', once: true },
        });
      }
    });
  }, { scope: containerRef });

  // Parse stat values (e.g. "10+" -> raw=10, suffix="+")
  const parseValue = (v: string) => {
    const match = v.match(/^([\d.]+)(.*)$/);
    if (!match) return { raw: '0', suffix: v };
    return { raw: match[1], suffix: match[2] };
  };

  return (
    <section ref={containerRef} className="relative bg-[#050505] py-28 md:py-36 overflow-hidden">
      {/* top + bottom separators */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(227,6,19,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Eyebrow */}
        <div className="metrics-eyebrow flex items-center gap-4 mb-16 md:mb-20">
          <div className="h-px w-10 bg-premium-orange/60" />
          <span className="text-[9px] font-black tracking-[0.5em] uppercase text-premium-orange">
            Rəqəmlərlə
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {content.home.metrics.items.map((stat, i) => {
            const { raw, suffix } = parseValue(stat.value);
            return (
              <div
                key={`${stat.value}-${i}`}
                className="metric-item group relative px-6 md:px-10 py-8 md:py-10"
                style={{
                  borderRight: i < content.home.metrics.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                {/* Number */}
                <div className="mb-5">
                  <span
                    className="metric-value block font-black leading-none tracking-tight"
                    style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)' }}
                    data-raw={raw}
                    data-suffix={suffix}
                  >
                    0{suffix}
                  </span>
                </div>

                {/* Accent bar */}
                <div
                  className="metric-bar h-[2px] w-12 mb-4 origin-left"
                  style={{ background: 'linear-gradient(90deg, #e30613, transparent)' }}
                />

                {/* Label */}
                <div className="metric-label">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35 leading-relaxed">
                    {t(locale, stat.label)}
                  </p>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 30% 50%, rgba(227,6,19,0.05) 0%, transparent 70%)' }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
