import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGsap, gsap } from '../motion/useGsap';
import { Building2, Music, Heart } from 'lucide-react';
import { useSiteContent } from '../content.context';
import { t } from '../content';

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

export default function EventTypes() {
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
    // Header animation timeline
    const headerEl = containerRef.current?.querySelector('.event-types-header');
    if (headerEl) {
      const badge = headerEl.querySelector('span');
      const title = headerEl.querySelector('h2');
      const desc = headerEl.querySelector('p');
      const line = headerEl.querySelector('.event-types-line');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerEl,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // 1. Line draws first
      if (line) {
        tl.fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }
        );
      }

      // 2. Badge pops in
      if (badge) {
        tl.fromTo(badge,
          { opacity: 0, scale: 0.8, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.6'
        );
      }

      // 3. Title skew reveals upwards
      if (title) {
        tl.fromTo(title,
          { 
            y: 60,
            opacity: 0,
            skewY: 4,
            transformOrigin: 'left top'
          },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1.2,
            ease: 'power4.out'
          },
          '-=0.8'
        );
      }

      // 4. Description fades and moves in
      if (desc) {
        tl.fromTo(desc,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' },
          '-=0.8'
        );
      }
    }

    const sections = gsap.utils.toArray('.event-type-section');
    
    sections.forEach((section: any) => {
      const content = section.querySelector('.event-content');
      const img = section.querySelector('.event-card-img');
      
      // 1. Text Content Animation (Smooth scroll reveal)
      gsap.fromTo(content,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.5,
          }
        }
      );

      // 2. Combined Image Animation: Scale, Opacity, and Parallax (yPercent)
      if (img) {
        gsap.fromTo(img,
          { 
            scale: 1.15, 
            opacity: 0.3,
            yPercent: -10
          },
          {
            scale: 1,
            opacity: 1,
            yPercent: 10,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            }
          }
        );
      }
    });
  }, { dependencies: [eventTypes.length], scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black pt-8 pb-12 md:pt-10 md:pb-16">
      {/* Self-contained styling for infinite loop marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-ribbon {
          display: inline-flex;
          animation: marquee-scroll 25s linear infinite;
        }
      `}} />

      {/* Infinite scrolling ticker ribbon separating from previous section */}
      <div className="w-full bg-premium-orange py-4 overflow-hidden select-none border-y border-white/10 mb-16 -rotate-1 relative z-20">
        <div className="animate-marquee-ribbon flex gap-16 text-[10px] font-black uppercase tracking-[0.26em] text-black whitespace-nowrap">
          <span>Tədbirlər • Hər Layihəyə Özəl Yanaşma • Corporate Events • Live Concerts • Premium Weddings • Creative Production • State of the Art Lighting • Expert Sound Systems • Digital Design •</span>
          <span>Tədbirlər • Hər Layihəyə Özəl Yanaşma • Corporate Events • Live Concerts • Premium Weddings • Creative Production • State of the Art Lighting • Expert Sound Systems • Digital Design •</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-24 md:mb-28">
        <div className="event-types-header flex flex-col md:flex-row justify-between items-end gap-8 relative pb-6">
          <div className="space-y-5">
            <span className="text-[10px] font-black uppercase tracking-[0.26em] text-premium-orange">{t(locale, content.home.eventTypes.badge)}</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-ultra-tight uppercase leading-[0.94]">
              {t(locale, content.home.eventTypes.title)} <br /> <span className="text-premium-orange">{t(locale, content.home.eventTypes.titleAccent)}</span>
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-400 max-w-sm font-medium leading-[1.75]">
            {t(locale, content.home.eventTypes.description)}
          </p>
          {/* Animated Accent Line */}
          <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-premium-orange/60 via-premium-orange to-transparent w-full origin-left scale-x-0 event-types-line" />
        </div>
      </div>

      <div className="space-y-0">
        {eventTypes.map((type, i) => (
          <div 
            key={type.id} 
            className="event-type-section relative h-[80vh] flex items-center overflow-hidden border-t border-white/5"
          >
            <div className="event-image absolute inset-0 z-0 overflow-hidden">
              <img 
                src={type.image} 
                className="event-card-img w-full h-[120%] absolute top-[-10%] left-0 object-cover"
                referrerPolicy="no-referrer"
                alt={type.title}
              />
              <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-black/20" />
            </div>

            <div className="event-content relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2">
              <div className="space-y-6 md:space-y-7">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/7 backdrop-blur-sm flex items-center justify-center border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
                    <type.icon className="w-6 h-6 text-premium-orange" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-gray-300/85">{type.subtitle}</span>
                </div>
                
                <h3 className="text-5xl md:text-7xl font-black tracking-ultra-tight uppercase leading-[0.94]">{type.title}</h3>
                <p className="text-lg text-gray-300/90 max-w-md font-medium leading-[1.75]">
                  {type.description}
                </p>
                
                <Link to="/portfolio" className="inline-flex min-h-12 items-center px-8 py-3.5 border border-white/20 rounded-full text-[11px] font-black uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-all duration-300">
                  {t(locale, content.home.eventTypes.cta)}
                </Link>
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
