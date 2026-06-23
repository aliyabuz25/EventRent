import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();

  useGsap(() => {
    // Parallax glow
    gsap.to(glowRef.current, {
      y: -80,
      scale: 1.3,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    // Content reveal — runs immediately on mount
    gsap.from('.cta-badge', {
      y: 30,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      toggleActions: 'play none none none',
    });

    gsap.from('.cta-title', {
      y: 50,
      opacity: 0,
      duration: 1.3,
      ease: 'power4.out',
      toggleActions: 'play none none none',
    });

    gsap.from('.cta-description', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.2,
      toggleActions: 'play none none none',
    });

    gsap.from('.cta-buttons', {
      y: 30,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      delay: 0.35,
      toggleActions: 'play none none none',
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-brand-bg py-40 md:py-48 relative overflow-hidden">
      {/* Background Parallax Glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-premium-orange/10 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="space-y-10 md:space-y-12">
          <h2 className="cta-title text-6xl md:text-9xl font-black tracking-ultra-tight uppercase leading-[0.88]">
            {t(locale, content.home.finalCta.title)} <br />
            <span className="text-premium-orange">{t(locale, content.home.finalCta.titleAccent)}</span>
          </h2>

          <p className="cta-description text-lg md:text-2xl text-gray-300/90 font-medium max-w-2xl mx-auto leading-[1.75]">
            {t(locale, content.home.finalCta.description)}
          </p>

          <div className="cta-buttons flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 pt-6 md:pt-8">
            <button className="w-full md:w-auto min-h-14 px-8 md:px-12 py-4 md:py-6 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.24em] hover:bg-premium-orange hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
              {t(locale, content.home.finalCta.primaryCta)} <ArrowRight className="w-5 h-5" />
            </button>

            <button className="w-full md:w-auto min-h-14 px-8 md:px-12 py-4 md:py-6 glass text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.24em] hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-4">
              {t(locale, content.home.finalCta.secondaryCta)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}