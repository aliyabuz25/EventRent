import React, { useRef } from 'react';
import { Printer, Palette, Star, CheckCircle2, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t, getServiceCategories } from '../../content';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  printing: Printer,
  decor: Palette,
  other: Star,
};

export default function ServicesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();
  const categories = getServiceCategories(content);

  useGsap(() => {
    // Cards staggered reveal — runs immediately on mount
    gsap.from('.service-card', {
      y: 80,
      opacity: 0,
      duration: 1.1,
      stagger: 0.15,
      ease: 'power3.out',
      toggleActions: 'play none none none',
    });

    // Image scale-in
    gsap.from('.service-card-img', {
      scale: 1.15,
      opacity: 0,
      duration: 1.4,
      stagger: 0.15,
      ease: 'power3.out',
      toggleActions: 'play none none none',
    });

    // Icon appear
    gsap.from('.service-card-icon', {
      scale: 0,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      toggleActions: 'play none none none',
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-px bg-premium-orange" />
          <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/30">Xidmətlər</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
          Nə Təklif<br />
          <span className="text-white/25 italic">Edirik?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.id] ?? Star;
        const title = t(locale, category.title);
        const description = t(locale, category.description);
        const path = category.path ?? `/services/${category.id}`;
        const subItems = (category.subItems ?? []).map((item) => t(locale, item.name));

        return (
          <div key={category.id} className="service-card group flex flex-col">
            <Link to={path} className="relative aspect-square rounded-[60px] overflow-hidden bg-black shadow-2xl border-8 border-gray-50 mb-8">
              <img
                src={category.image}
                alt={title}
                className="service-card-img absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <div className="service-card-icon w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500 mb-6">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold text-white tracking-tighter">{title}</h3>
              </div>
            </Link>

            <div className="px-4 space-y-6 flex flex-col flex-1">
              <p className="text-white/60 font-light leading-relaxed">
                {description}
              </p>

              <div className="space-y-3 flex-1">
                {subItems.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-premium-orange shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>

              <Link
                to={path}
                className="inline-flex items-center gap-3 px-6 py-3 mt-auto rounded-full border border-premium-orange/60 text-xs font-black uppercase tracking-widest text-premium-orange hover:bg-premium-orange hover:text-white transition-all duration-300 shadow-[0_8px_24px_rgba(227,6,19,0.2)] hover:shadow-[0_12px_32px_rgba(227,6,19,0.35)]"
              >
                Bütün alt başlıqlar <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })}
      </div>
    </section>
  );
}
