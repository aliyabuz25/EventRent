import React, { useRef } from 'react';
import { Star, CheckCircle2, Users } from 'lucide-react';
import { useGsap, gsap } from '../../motion/useGsap';

const VALUES = [
  { icon: Star, title: 'Mukemmellik', desc: 'Her bir isde en yukssek neticeye can atiriq.' },
  { icon: CheckCircle2, title: 'Etibarliliq', desc: 'Verdiyimiz vende ve keyfiyyete tam zemanet veririk.' },
  { icon: Users, title: 'Musteri Memnuniyyeti', desc: 'Sizin sevinciniz bizim en boyuk ugurumuzdur.' },
];

export default function AboutValues() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    // Cards staggered reveal — runs immediately on mount
    gsap.from('.value-card', {
      y: 60,
      opacity: 0,
      duration: 1.1,
      stagger: 0.15,
      ease: 'power3.out',
      toggleActions: 'play none none none',
    });

    // Subtle float animation on icons — runs immediately on mount
    const icons = gsap.utils.toArray('.value-icon');
    icons.forEach((icon: any) => {
      gsap.to(icon, {
        y: -8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        toggleActions: 'play none none none',
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {VALUES.map((value, i) => (
          <div
            key={i}
            className="value-card space-y-8 p-12 bg-gray-50 rounded-5xl hover:bg-black hover:text-white transition-all duration-700 group"
          >
            <div className="value-icon w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm group-hover:bg-white/10 group-hover:text-white transition-colors">
              <value.icon className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tight">{value.title}</h3>
              <p className="text-gray-500 group-hover:text-gray-400 font-light leading-relaxed">{value.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}