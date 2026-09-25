import React, { useMemo, useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { Building2, Music, Heart } from 'lucide-react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

const eventTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  corporate: Building2,
  concerts: Music,
  weddings: Heart,
};

const fallbackEventTypes = [
  {
    id: 'corporate',
    title: 'Corporate Events',
    subtitle: 'Conferences & Summits',
    description: 'Technical production for high-stakes corporate gatherings where reliability is paramount.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'concerts',
    title: 'Live Concerts',
    subtitle: 'Arena & Festival Scale',
    description: 'Immersive sound and lighting systems designed for the ultimate audience experience.',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'weddings',
    title: 'Premium Weddings',
    subtitle: 'Cinematic Celebrations',
    description: 'Bespoke lighting and visual setups that transform your special day into a masterpiece.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
  },
];

export default function HomeEventTypes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();

  const eventTypes = useMemo(() => {
    const contentItems = content.home.eventTypes.items || [];
    if (!contentItems.length) {
      return fallbackEventTypes;
    }

    return contentItems.map((item) => ({
      id: item.id,
      title: t(locale, item.title),
      subtitle: t(locale, item.subtitle),
      description: t(locale, item.description),
      image: item.image,
      icon: eventTypeIcons[item.id] || Building2,
    }));
  }, [content.home.eventTypes.items, locale]);

  useGsap(() => {
    const headerTrigger = containerRef.current?.querySelector('.et-badge')?.closest('.max-w-7xl') ?? containerRef.current;

    gsap.from('.et-badge', {
      y: 20, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: headerTrigger, start: 'top 85%', toggleActions: 'play none none none' },
    });

    gsap.from('.et-title', {
      y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.1,
      scrollTrigger: { trigger: headerTrigger, start: 'top 82%', toggleActions: 'play none none none' },
    });

    gsap.from('.et-desc', {
      y: 30, opacity: 0, duration: 1.0, ease: 'power3.out', delay: 0.25,
      scrollTrigger: { trigger: headerTrigger, start: 'top 80%', toggleActions: 'play none none none' },
    });

    const sections = gsap.utils.toArray('.event-type-section');

    sections.forEach((section: any) => {
      const content = section.querySelector('.event-content');
      const image = section.querySelector('.event-image');

      gsap.fromTo(content,
        { y: 88, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            end: 'top 24%',
            scrub: 0.85,
          }
        }
      );

      gsap.fromTo(image,
        { scale: 1.14, opacity: 0.08 },
        {
          scale: 1,
          opacity: 0.48,
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            end: 'top 24%',
            scrub: 0.85,
          }
        }
      );

      const img = section.querySelector('.event-image img');
      if (img) {
        gsap.fromTo(img,
          { yPercent: -20 },
          {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }
    });
  }, { dependencies: [eventTypes.length], scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black py-36 md:py-40">
      <div className="max-w-7xl mx-auto px-6 mb-24 md:mb-28">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-5">
            <span className="et-badge block text-[10px] font-black uppercase tracking-[0.26em] text-premium-orange">{t(locale, content.home.eventTypes.badge)}</span>
            <h2 className="et-title text-6xl md:text-8xl font-black tracking-ultra-tight uppercase leading-[0.94]">
              {t(locale, content.home.eventTypes.title)} <br /> <span className="text-premium-orange">{t(locale, content.home.eventTypes.titleAccent)}</span>
            </h2>
          </div>
          <p className="et-desc text-lg md:text-xl text-white/70 max-w-sm font-medium leading-[1.75]">
            {t(locale, content.home.eventTypes.description)}
          </p>
        </div>
      </div>

      <div className="space-y-0">
        {eventTypes.map((type, i) => (
          <div
            key={type.id}
            className="event-type-section relative h-[60vh] flex items-center overflow-hidden border-t border-white/5"
          >
            <div className="event-image absolute inset-y-0 right-0 w-[55%] z-0 overflow-hidden">
              <img
                src={type.image}
                className="w-full h-[130%] absolute top-[-15%] left-0 object-cover"
                style={i >= 1 ? { objectPosition: 'right center' } : undefined}
                referrerPolicy="no-referrer"
                alt={type.title}
              />
              <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
            </div>

            <div className="event-content relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2">
              <div className="space-y-6 md:space-y-7">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/7 backdrop-blur-sm flex items-center justify-center border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
                    <type.icon className="w-6 h-6 text-premium-orange" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-white/65">{type.subtitle}</span>
                </div>

                <h3 className="text-5xl md:text-7xl font-black tracking-ultra-tight uppercase leading-[0.94]">{type.title}</h3>
                <p className="text-lg text-white/70 max-w-md font-medium leading-[1.75]">
                  {type.description}
                </p>

                <button className="min-h-12 px-8 py-3.5 border border-white/20 rounded-full text-[11px] font-black uppercase tracking-[0.24em] hover:bg-white hover:text-premium-orange transition-all duration-300">
                  {t(locale, content.home.eventTypes.cta)}
                </button>
              </div>
            </div>

            <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block">
              <span className="text-[12rem] font-black text-white/5 leading-none select-none">0{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}