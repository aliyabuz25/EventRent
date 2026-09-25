import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();
  const s = content.about.hero;

  useGsap(() => {
    gsap.from('.about-hero-badge', {
      y: 30, opacity: 0, duration: 1.1, ease: 'power3.out',
      toggleActions: 'play none none none',
    });
    gsap.from('.about-hero-title-line', {
      y: 60, opacity: 0, duration: 1.3, stagger: 0.15, ease: 'power4.out',
      toggleActions: 'play none none none',
    });
    gsap.from('.about-hero-subtitle', {
      y: 30, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.3,
      toggleActions: 'play none none none',
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative -mt-[72px] pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-brand-bg via-brand-bg to-brand-card overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div
          className="absolute top-0 left-1/4 w-[40vw] h-[50%]"
          style={{ background: 'radial-gradient(ellipse, rgba(227,6,19,0.06) 0%, transparent 70%)' }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-white/5" />
        <div className="absolute top-2/4 left-0 right-0 h-px bg-white/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="about-hero-badge flex items-center gap-3 mb-8">
          <div className="w-5 h-px bg-premium-orange" />
          <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">
            {t(locale, s.badge)}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-8">
          <span className="about-hero-title-line block">{t(locale, s.titleLine1)}</span>
          <span className="about-hero-title-line block text-white/50 italic">{t(locale, s.titleLine2)}</span>
        </h1>

        <p className="about-hero-subtitle text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed">
          {t(locale, s.subtitle)}
        </p>
      </div>
    </section>
  );
}