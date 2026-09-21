import React, { useRef } from 'react';
import { Youtube, Radio, Share2, Monitor, ArrowUpRight, Play } from 'lucide-react';
import { useGsap, gsap } from '../../motion/useGsap';

export default function TVProduction() {
  const containerRef = useRef<HTMLElement>(null);

  useGsap(() => {
    gsap.fromTo('.tvp-text',
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 0.65, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo('.tvp-image',
      { x: 50, opacity: 0, scale: 0.96 },
      {
        x: 0, opacity: 1, scale: 1,
        duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { dependencies: [], scope: containerRef });

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[60px] bg-white/5 border border-white/8 p-12 md:p-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="tvp-text opacity-0 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">Canlı Yayım Texnologiyaları</h2>
              <p className="text-xl text-white/50 font-light leading-relaxed">
                Biz ən müasir yayım avadanlıqları və proqram təminatları ilə tədbirlərinizin kəsintisiz və yüksək keyfiyyətli yayımını təmin edirik.
                Çoxkameralı çəkiliş, peşəkar səs və qrafik həllərlə yayımınızı televiziya səviyyəsinə qaldırırıq.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              {[Youtube, Radio, Share2, Monitor].map((Icon, i) => (
                <div key={i} className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-premium-orange hover:bg-white/15 hover:scale-110 transition-all duration-300">
                  <Icon className="w-8 h-8" />
                </div>
              ))}
            </div>
            <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all text-white/60 hover:text-white">
              Daha çox məlumat <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="tvp-image opacity-0 relative aspect-square rounded-[60px] overflow-hidden shadow-2xl group border-4 border-white/10">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              alt="TV Production"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}