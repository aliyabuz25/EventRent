import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    // Badge reveal
    gsap.from('.about-hero-badge', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      toggleActions: 'play none none none',
    });

    // Title lines reveal
    gsap.from('.about-hero-title-line', {
      y: 60,
      opacity: 0,
      duration: 1.3,
      stagger: 0.15,
      ease: 'power4.out',
      toggleActions: 'play none none none',
    });

    // Subtitle reveal
    gsap.from('.about-hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.3,
      toggleActions: 'play none none none',
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-brand-bg via-brand-bg to-brand-card overflow-hidden"
    >
      {/* Nazik ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div
          className="absolute top-0 left-1/4 w-[40vw] h-[50%]"
          style={{ background: 'radial-gradient(ellipse, rgba(227,6,19,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-white/5" />
        <div className="absolute top-2/4 left-0 right-0 h-px bg-white/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Badge */}
        <div className="about-hero-badge flex items-center gap-3 mb-8">
          <div className="w-5 h-px bg-premium-orange" />
          <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">
            Bizim Hekayəmiz
          </span>
        </div>

        {/* Başlıq */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-8">
          <span className="about-hero-title-line block">Keyfiyyət.</span>
          <span className="about-hero-title-line block text-white/50 italic">Təcrübə.</span>
        </h1>

        {/* Alt başlıq */}
        <p className="about-hero-subtitle text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed">
          Tədbiriniz üçün hər şey — Operativlik və Bol çeşidin vəhdəti.
        </p>
      </div>
    </section>
  );
}
