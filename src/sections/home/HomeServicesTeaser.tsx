import { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function HomeServicesTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();
  const s = content.home.servicesTeaser;

  useGsap(() => {
    gsap.to(bgRef.current, {
      y: '30%', ease: 'none',
      scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.hst-badge', {
      y: 30, opacity: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.from('.hst-title', {
      y: 60, opacity: 0, duration: 1.3, ease: 'power4.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 75%', toggleActions: 'play none none none' },
    });
    gsap.from('.hst-subtitle', {
      y: 30, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.2,
      scrollTrigger: { trigger: containerRef.current, start: 'top 72%', toggleActions: 'play none none none' },
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-[600px] overflow-hidden flex items-center justify-center text-center"
    >
      <div ref={bgRef} className="absolute inset-0 bg-black will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop"
          className="w-full h-[130%] object-cover opacity-30"
          alt="Professional Services"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-8">
        <div className="hst-badge inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-[0.3em]">
          {t(locale, s.badge)}
        </div>
        <h2 className="hst-title text-6xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9]">
          {t(locale, s.titleLine1)} <br />
          <span className="text-white/70 italic">{t(locale, s.titleLine2)}</span>
        </h2>
        <p className="hst-subtitle text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
          {t(locale, s.subtitle)}
        </p>
      </div>
    </section>
  );
}