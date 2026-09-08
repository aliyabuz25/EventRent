import { useRef } from 'react';
import { Star, CheckCircle2, Users } from 'lucide-react';
import { useGsap, gsap } from '../../motion/useGsap';

const VALUES = [
  { icon: Star,         title: 'Mükəmməllik',         desc: 'Hər bir işdə ən yüksək nəticəyə can atırıq. Standart bizim üçün başlanğıc nöqtəsidir, hədəf deyil.' },
  { icon: CheckCircle2, title: 'Etibarlılıq',          desc: 'Verdiyimiz vəd və keyfiyyətə tam zəmanət veririk. Müştərimiz narahat olmamalıdır.' },
  { icon: Users,        title: 'Müştəri Məmnuniyyəti', desc: 'Sizin sevincinizdən böyük uğur tanımırıq. Hər tədbiri sizinlə birlikdə yaradırıq.' },
];

export default function AboutValues() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    gsap.from('.val-eyebrow', {
      y: 16, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.from('.val-card', {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: '.val-grid', start: 'top 78%', toggleActions: 'play none none none' },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-[#060606]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">

        <div className="val-eyebrow flex items-center gap-3 mb-6">
          <div className="w-5 h-px bg-premium-orange" />
          <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">Dəyərlərimiz</span>
        </div>

        <h2 className="val-eyebrow text-4xl md:text-6xl font-black tracking-tighter text-white leading-none mb-14">
          Prinsiplərimiz<br />
          <span className="text-white/50 italic">Əsasımız.</span>
        </h2>

        <div className="val-grid grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.07]">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className="val-card group bg-[#060606] hover:bg-white/[0.03] transition-all duration-500 p-10 md:p-12 space-y-6 overflow-hidden relative"
            >
              <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full bg-premium-orange transition-all duration-500 ease-out" />
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] group-hover:bg-premium-orange/10 flex items-center justify-center transition-colors duration-400">
                <v.icon className="w-5 h-5 text-white/70 group-hover:text-premium-orange transition-colors duration-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white leading-snug group-hover:translate-x-1 transition-transform duration-400">
                {v.title}
              </h3>
              <p className="text-[15px] text-[#a0a0a0] group-hover:text-[#c0c0c0] leading-[1.8] font-normal transition-colors duration-400">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}