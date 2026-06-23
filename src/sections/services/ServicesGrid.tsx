import React, { useRef } from 'react';
import { Printer, Palette, Star, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGsap, gsap } from '../../motion/useGsap';

const SERVICE_CATEGORIES = [
  {
    id: 'printing',
    title: 'Cap xidmetleri',
    desc: 'Bloknot, Vinil, Roll-Up, Qelem ve diger cap mehsullari.',
    icon: Printer,
    image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=800&auto=format&fit=crop',
    path: '/services/printing',
    subItems: ['Bloknot', 'Vinil', 'Roll-Up', 'Qelem'],
  },
  {
    id: 'decor',
    title: 'Dekor xidmetleri',
    desc: 'Cadirov, Masa Ve Oturacaclar, Qab-Qacag ve estetik dekorasiya.',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    path: '/services/decor',
    subItems: ['Cadirov', 'Masa Ve Oturacaclar', 'Qab-Qacag'],
  },
  {
    id: 'other',
    title: 'Diger xidmetler',
    desc: 'DJ, Mugenisi, Aparici, Tedbirlerin Teskilati ve Dizayner xidmetleri.',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    path: '/services/other',
    subItems: ['DJ Xidmeti', 'Mugenisi Xidmeti', 'Aparici Xidmeti', 'Tedbirlerin Teskilati', 'Dizayner Xidmeti'],
  },
];

export default function ServicesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
      {SERVICE_CATEGORIES.map((service, i) => (
        <div key={i} className="service-card group flex flex-col">
          <Link to={service.path} className="relative aspect-square rounded-[60px] overflow-hidden bg-black shadow-2xl border-8 border-gray-50 mb-8">
            <img
              src={service.image}
              alt={service.title}
              className="service-card-img absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <div className="service-card-icon w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500 mb-6">
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-white tracking-tighter">{service.title}</h3>
            </div>
          </Link>

          <div className="px-4 space-y-6">
            <p className="text-gray-500 font-light leading-relaxed">
              {service.desc}
            </p>

            <div className="space-y-3">
              {service.subItems.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-900">
                  <CheckCircle2 className="w-4 h-4 text-premium-orange" />
                  {sub}
                </div>
              ))}
            </div>

            <Link
              to={service.path}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:translate-x-2 transition-transform"
            >
              Butun alt basliqlar <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}