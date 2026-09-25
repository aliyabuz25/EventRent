import React, { useRef } from 'react';
import { Tv } from 'lucide-react';
import { useGsap, gsap } from '../../motion/useGsap';

const CHANNELS = [
  { title: 'Canlı Yayım', desc: 'Tədbirlərinizin internet üzərinden canlı yayımı.' },
  { title: 'Video Arxiv', desc: 'Bütün tədbirlərinizin video yazısı və montajı.' },
  { title: 'Led Ekran Yayımı', desc: 'Məkan daxili led ekranlarda real-vaxt görüntülər.' },
  { title: 'Sosial Media', desc: 'Youtube, Facebook və Instagram üzərindən yayım.' },
];

export default function TVChannels() {
  const containerRef = useRef<HTMLElement>(null);

  useGsap(() => {
    gsap.fromTo('.tvc-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.55, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { dependencies: [], scope: containerRef });

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {CHANNELS.map((channel, i) => (
        <div
          key={i}
          className="tvc-card opacity-0 group p-12 bg-white/5 border border-white/8 rounded-5xl hover:bg-white/10 hover:border-white/15 transition-all duration-500 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto text-premium-orange transition-colors group-hover:bg-white/15">
            <Tv className="w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-white">{channel.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed font-light">{channel.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}