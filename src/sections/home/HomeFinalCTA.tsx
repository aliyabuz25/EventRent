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
      y: -80, scale: 1.3, ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom', end: 'bottom top', scrub: 1.2,
      },
    });

    // Badge
    gsap.from('.cta-badge', {
      y: 30, opacity: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
    });

    // Title — mask reveal per line
    gsap.fromTo('.cta-title-line',
      { yPercent: 110 },
      {
        yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: containerRef.current, start: 'top 76%', once: true },
      }
    );

    // Description
    gsap.from('.cta-description', {
      y: 30, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.2,
      scrollTrigger: { trigger: containerRef.current, start: 'top 74%', once: true },
    });

    // Buttons
    gsap.from('.cta-buttons', {
      y: 30, opacity: 0, duration: 1.0, ease: 'power3.out', delay: 0.35,
      scrollTrigger: { trigger: containerRef.current, start: 'top 72%', once: true },
    });

    // Bottom bar rule
    gsap.fromTo('.cta-rule', { scaleX: 0 }, {
      scaleX: 1, transformOrigin: 'left', duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: '.cta-rule', start: 'top 90%', once: true },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-brand-bg relative overflow-hidden">
      {/* top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Background Parallax Glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(227,6,19,0.12) 0%, transparent 65%)', filter: 'blur(80px)' }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 grid-lines opacity-[0.04] pointer-events-none" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-32 md:pt-44 pb-16 md:pb-20 text-center">

        {/* Badge */}
        <div className="cta-badge inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full"
          style={{ background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.2)' }}>
          <span className="block w-1.5 h-1.5 rounded-full bg-[#e30613] animate-pulse" />
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#e30613]">
            Sifariş Ver
          </span>
        </div>

        {/* Title — mask-reveal per line */}
        <div className="mb-10 md:mb-12">
          <div className="overflow-hidden">
            <h2 className="cta-title-line font-black uppercase tracking-ultra-tight leading-[0.88] text-white inline-block"
              style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              {t(locale, content.home.finalCta.title)}
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="cta-title-line font-black uppercase tracking-ultra-tight leading-[0.88] text-premium-orange inline-block"
              style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
              {t(locale, content.home.finalCta.titleAccent)}
            </h2>
          </div>
        </div>

        <p className="cta-description text-lg md:text-xl text-white/40 font-normal max-w-xl mx-auto leading-[1.8] mb-12">
          {t(locale, content.home.finalCta.description)}
        </p>

        <div className="cta-buttons flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <a
            href="/contact"
            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.24em] text-black bg-white transition-all duration-300 hover:bg-premium-orange hover:text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            {t(locale, content.home.finalCta.primaryCta)}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="/catalog"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.24em] text-white/70 transition-all duration-300 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            {t(locale, content.home.finalCta.secondaryCta)}
          </a>
        </div>
      </div>

      {/* BOTTOM INFO BAR */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <div className="cta-rule h-px bg-white/[0.08] mb-8" style={{ transformOrigin: 'left', transform: 'scaleX(0)' }} />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            Eventrent · Bakı · Azerbaijan
          </p>
          <div className="flex items-center gap-6">
            <a href="tel:+994102553555" className="text-[13px] font-medium text-white/30 hover:text-white transition-colors duration-200">
              010-255-35-55
            </a>
            <span className="text-white/10">·</span>
            <a href="mailto:sales@eventrent.az" className="text-[13px] font-medium text-white/30 hover:text-white transition-colors duration-200">
              sales@eventrent.az
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}