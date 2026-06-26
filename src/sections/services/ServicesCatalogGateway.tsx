import React, { useRef } from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';
import { useGsap, gsap } from '../../motion/useGsap';

export default function ServicesCatalogGateway() {
  const { content, locale } = useSiteContent();
  const containerRef = useRef<HTMLElement>(null);

  useGsap(() => {
    gsap.from('.cgw-card', {
      y: 80,
      opacity: 0,
      scale: 0.97,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from('.cgw-text', {
      x: -40,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from('.cgw-image', {
      x: 40,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.3,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black py-32 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="cgw-card relative rounded-[3.5rem] overflow-hidden bg-premium-red p-10 md:p-16 lg:p-20 group shadow-[0_32px_90px_rgba(0,0,0,0.28)]">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 md:gap-16 lg:gap-20 items-center">
            <div className="cgw-text space-y-7 md:space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/20 rounded-full text-white text-[11px] font-black uppercase tracking-[0.24em] backdrop-blur-sm">
                <Package className="w-4 h-4" />
                {t(locale, content.home.catalogGateway.badge)}
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-white tracking-ultra-tight uppercase leading-[0.94]">
                {t(locale, content.home.catalogGateway.title)} <br /> <span className="text-black/40">{t(locale, content.home.catalogGateway.titleAccent)}</span>
              </h2>

              <p className="text-lg md:text-xl text-white/85 font-medium max-w-md leading-[1.75]">
                {t(locale, content.home.catalogGateway.description)}
              </p>

              <Link
                to="/catalog"
                className="inline-flex min-h-14 items-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.24em] hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
              >
                {t(locale, content.home.catalogGateway.cta)} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="cgw-image relative aspect-video lg:aspect-square">
              <div className="absolute inset-0 bg-black/24 rounded-[2.75rem] blur-[88px] group-hover:scale-105 transition-transform duration-1000" />
              <img
                src={content.home.catalogGateway.image}
                className="w-full h-full object-cover rounded-[2.75rem] shadow-[0_28px_80px_rgba(0,0,0,0.32)] relative z-10 transition-transform duration-1000 group-hover:-translate-y-3"
                referrerPolicy="no-referrer"
                alt={t(locale, content.home.catalogGateway.titleAccent)}
              />

              {content.home.catalogGateway.stats[0] && (
                <div className="absolute -top-5 -right-5 z-20 bg-black/92 backdrop-blur-md text-white p-5 rounded-[1.75rem] shadow-[0_20px_60px_rgba(0,0,0,0.28)] hidden md:block border border-white/8">
                  <p className="text-2xl font-black">{content.home.catalogGateway.stats[0].value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">{t(locale, content.home.catalogGateway.stats[0].label)}</p>
                </div>
              )}

              {content.home.catalogGateway.stats[1] && (
                <div className="absolute -bottom-5 -left-5 z-20 bg-white/95 backdrop-blur-md text-black p-5 rounded-[1.75rem] shadow-[0_20px_60px_rgba(0,0,0,0.22)] hidden md:block border border-black/5">
                  <p className="text-2xl font-black">{content.home.catalogGateway.stats[1].value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">{t(locale, content.home.catalogGateway.stats[1].label)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}