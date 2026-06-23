import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';

export default function ServicesHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    // Parallax on background image
    gsap.to(bgRef.current, {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Badge reveal — runs immediately on mount
    gsap.from('.services-hero-badge', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      toggleActions: 'play none none none',
    });

    // Title reveal — runs immediately on mount
    gsap.from('.services-hero-title', {
      y: 60,
      opacity: 0,
      duration: 1.3,
      ease: 'power4.out',
      toggleActions: 'play none none none',
    });

    // Subtitle reveal — runs immediately on mount
    gsap.from('.services-hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.3,
      toggleActions: 'play none none none',
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-[600px] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden flex items-center justify-center text-center">
      <div ref={bgRef} className="absolute inset-0 bg-black will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop"
          className="w-full h-[130%] object-cover opacity-30"
          alt="Services Hero"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-8">
        <div className="services-hero-badge inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-[0.3em]">
          Ne Teqdim Edirik?
        </div>
        <h1 className="services-hero-title text-6xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9]">
          Pesakar <br />
          <span className="text-white/40 italic">Xidmetler.</span>
        </h1>
        <p className="services-hero-subtitle text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
          Tedbirinizin mukemmel kecmesi ucun lazim olan herseyi bir mekanda teqdim edirik.
        </p>
      </div>
    </section>
  );
}