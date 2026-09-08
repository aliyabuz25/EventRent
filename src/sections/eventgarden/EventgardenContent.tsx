import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tent, Lightbulb, Volume2, Trees, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Tent,
    title: 'Çadır və Məkan Qurğusu',
    desc: 'Hər ölçüdə çadırların qurulması — bağça, terras və açıq hava məkanları üçün uyğun həllər.',
  },
  {
    icon: Lightbulb,
    title: 'Açıq Hava İşıqlandırma',
    desc: 'Bağça və terraslar üçün xüsusi işıq dizaynı — atmosferi tamamlayan dinamik işıqlandırma.',
  },
  {
    icon: Volume2,
    title: 'Səs Sistemləri',
    desc: 'Açıq hava üçün optimallaşdırılmış səs sistemləri — hər nöqtədə kristal səs keyfiyyəti.',
  },
  {
    icon: Trees,
    title: 'Dekor və Yaşıl Çərçivə',
    desc: 'Təbiətlə uyğun dekorasiya, floral dizayn və yaşıl çərçivə yaratma həlləri.',
  },
];

export default function EventgardenContent() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.eg-feature-card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo('.eg-image',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo('.eg-cta',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.eg-cta-section',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Feature kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="eg-feature-card opacity-0 group p-10 bg-white/5 border border-white/8 rounded-[40px] hover:bg-white/10 hover:border-white/15 transition-all duration-500 flex items-start gap-6"
          >
            <div className="shrink-0 w-16 h-16 bg-premium-orange/10 border border-premium-orange/20 rounded-2xl flex items-center justify-center text-premium-orange group-hover:bg-premium-orange/20 transition-colors duration-400">
              <feature.icon className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-white">{feature.title}</h3>
              <p className="text-base text-white/60 font-light leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Şəkil qalereya */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="eg-image opacity-0 aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10">
          <img
            src="https://images.unsplash.com/photo-1464366409647-53c3f6b2a0a0?q=80&w=600&auto=format&fit=crop"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
            alt="Eventgarden 1"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="eg-image opacity-0 aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10 mt-12">
          <img
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600&auto=format&fit=crop"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
            alt="Eventgarden 2"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="eg-image opacity-0 aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10">
          <img
            src="https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=600&auto=format&fit=crop"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
            alt="Eventgarden 3"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="eg-cta-section">
        <div className="eg-cta opacity-0 relative overflow-hidden rounded-[40px] bg-premium-orange p-10 md:p-16 group shadow-[0_32px_90px_rgba(0,0,0,0.28)]">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Bağça Etkinliyiniz <br />
                <span className="text-black/40">Üçün Hazırdır?</span>
              </h2>
              <p className="text-lg text-white/85 font-medium leading-relaxed max-w-md">
                Açıq hava etkinliyiniz üçün tam həll — çadırdan işıqlandırmaya qədər. Bizimlə əlaqə saxlayın.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                to="/catering"
                className="inline-flex min-h-14 items-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.24em] hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
              >
                Ketrinq Sifariş Et <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-14 items-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-black/20 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.24em] hover:bg-black/40 transition-all duration-300 active:scale-95 border border-white/20"
              >
                Əlaqə Saxla <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
