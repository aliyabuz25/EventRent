import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';

export default function AboutHero() {
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
    gsap.from('.about-hero-badge', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      toggleActions: 'play none none none',
    });

    // Title lines reveal — runs immediately on mount
    gsap.from('.about-hero-title-line', {
      y: 60,
      opacity: 0,
      duration: 1.3,
      stagger: 0.15,
      ease: 'power4.out',
      toggleActions: 'play none none none',
    });

    // Subtitle reveal — runs immediately on mount
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
    <section ref={containerRef} className="relative h-[600px] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden flex items-center justify-center text-center">
      <div ref={bgRef} className="absolute inset-0 bg-black will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1920&auto=format&fit=crop"
          className="w-full h-[130%] object-cover opacity-30"
          alt="About Us Hero"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-8">
        <div className="about-hero-badge inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-[0.3em]">
          Bizim Hekayəmiz
        </div>
        <h1 className="text-6xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9]">
          <span className="about-hero-title-line block">Keyfiyyət.</span>
          <span className="about-hero-title-line block text-white/40 italic">Təcrübə.</span>
        </h1>
        <p className="about-hero-subtitle text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
          Tədbiriniz üçün hər şey - Operativlik və Bol çeşidin vəhdəti.
        </p>
      </div>
    </section>
  );
}