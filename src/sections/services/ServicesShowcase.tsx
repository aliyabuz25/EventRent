import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Monitor, Volume2, Layers, Lightbulb, Printer, Palette, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  led: Monitor,
  sound: Volume2,
  stage: Layers,
  lighting: Lightbulb,
  printing: Printer,
  decor: Palette,
};

const SERVICES = [
  {
    num: '01',
    eyebrow: 'Səhnə avadanlıqları',
    title: 'Peşəkar\nSəhnə Qurğusu',
    description: 'Hər ölçüdə tədbirlər üçün yüksək keyfiyyətli səhnə, truss sistemləri, LED ekranlar və texniki infrasturktura.',
    tags: ['Səhnə', 'Truss', 'LED Ekran', 'Texniki Rider'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000',
    iconKey: 'stage',
  },
  {
    num: '02',
    eyebrow: 'Səs sistemləri',
    title: 'Kristal Səs\nHər Nöqtəyə',
    description: 'Line array sistemlərdən monitor qurğularına — peşəkar audio mühəndisliyi ilə hər məkanda mükəmməl akustika.',
    tags: ['Line Array', 'Subwoofer', 'Monitor', 'Audio Mix'],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
    iconKey: 'sound',
  },
  {
    num: '03',
    eyebrow: 'Çap xidmətləri',
    title: 'Brendinizi\nGörünən Edin',
    description: 'Banner, rollup, backdrop, branding materialları — yüksək çözünürlüklü geniş format çap, sürətli çatdırılma.',
    tags: ['Banner', 'Rollup', 'Backdrop', 'Branding'],
    image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1000',
    iconKey: 'printing',
  },
  {
    num: '04',
    eyebrow: 'Dekor xidməti',
    title: 'Məkanı\nMəkana Çevir',
    description: 'Fərdi konsept dekorasiya, floral dizayn, tematik qurğular — hər tədbirə özəl estetik atmosfer.',
    tags: ['Floral', 'Tematik', 'Fərdi Konsept'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
    iconKey: 'decor',
  },
  {
    num: '05',
    eyebrow: 'İşıqlandırma',
    title: 'Atmosferi\nYaradın',
    description: 'Dinamik və ssenariyə uyğun işıq dizaynı — məkanı atmosferə çevirən peşəkar işıqlandırma həlləri.',
    tags: ['Moving Head', 'LED Par', 'Wash', 'Spot'],
    image: 'https://images.unsplash.com/photo-1511578314322-d37980f25207?auto=format&fit=crop&q=80&w=1000',
    iconKey: 'lighting',
  },
];

export default function ServicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) { tickingRef.current = false; return; }
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const p = Math.max(0, Math.min(1, -rect.top / scrollable));
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
        // Detect active service by scroll progress
        const idx = Math.min(SERVICES.length - 1, Math.floor(p * SERVICES.length));
        if (idx !== activeIdxRef.current) {
          activeIdxRef.current = idx;
          setActiveIdx(idx);
        }
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ height: '600vh' }} className="relative">
      <div className="sticky top-0 h-screen flex" style={{ background: '#080808' }}>

        {/* LEFT — text panel */}
        <div className="relative z-10 w-full md:w-[46%] flex flex-col justify-center px-8 md:px-12 shrink-0"
          style={{ background: 'linear-gradient(to right, #080808 0%, #080808 85%, transparent 100%)' }}>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-px bg-premium-orange" />
            <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">
              Xidmətlər
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Cards */}
          <div className="relative" style={{ minHeight: '260px' }}>
            {SERVICES.map((svc, i) => {
              const Icon = ICONS[svc.iconKey] || Monitor;
              return (
                <div
                  key={svc.num}
                  className="absolute inset-0"
                  style={{
                    opacity: i === activeIdx ? 1 : 0,
                    transform: i === activeIdx ? 'translateY(0)' : activeIdx > i ? 'translateY(-20px)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    pointerEvents: i === activeIdx ? 'auto' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-premium-orange/10 border border-premium-orange/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-premium-orange" />
                    </div>
                    <span className="text-[9px] font-black tracking-[0.3em] uppercase font-inter" style={{ color: '#e30613' }}>
                      {svc.num}
                    </span>
                    <span className="text-[9px] tracking-[0.2em] uppercase font-inter text-white/60">
                      {svc.eyebrow}
                    </span>
                  </div>

                  <h2
                    className="font-black tracking-ultra-tight text-white leading-tight mb-4"
                    style={{ fontSize: 'clamp(30px, 3.5vw, 52px)', whiteSpace: 'pre-line' }}
                  >
                    {svc.title}
                  </h2>

                  <p className="font-inter text-white/70 leading-relaxed mb-5" style={{ fontSize: '13px', maxWidth: '360px' }}>
                    {svc.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {svc.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 text-[9px] tracking-wider uppercase font-inter rounded-full"
                        style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.03)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a href="/services" className="inline-flex items-center gap-2 group">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 group-hover:bg-premium-orange group-hover:border-premium-orange"
                      style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M1.5 5.5h8M6.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[9px] tracking-[0.2em] uppercase font-inter text-white/60 group-hover:text-white transition-colors">
                      Ətraflı
                    </span>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-2.5 mt-8">
            {SERVICES.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-500"
                style={{
                  width: i === activeIdx ? '24px' : '5px',
                  height: '3px',
                  background: i === activeIdx ? '#e30613' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
            <span className="ml-2 text-[9px] font-inter text-white/50 tracking-wider">
              {String(activeIdx + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* RIGHT — image panel (video əvəzinə) */}
        <div className="hidden md:block relative flex-1 overflow-hidden">
          {/* Loading shimmer yoxdur — artıq şəkil dərhal görünür */}

          {/* Şəkillər stack — scroll'a görə crossfade */}
          {SERVICES.map((svc, i) => (
            <div
              key={svc.num}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === activeIdx ? 1 : 0 }}
            >
              <img
                src={svc.image}
                className="w-full h-full object-cover"
                alt={svc.eyebrow}
                referrerPolicy="no-referrer"
              />
              {/* İkon overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {(() => {
                  const Icon = ICONS[svc.iconKey] || Monitor;
                  return (
                    <div className="w-32 h-32 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center"
                      style={{ opacity: i === activeIdx ? 0.9 : 0, transition: 'opacity 0.5s ease' }}>
                      <Icon className="w-16 h-16 text-white/80" />
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}

          {/* Subtle left fade into the text panel */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #080808 0%, transparent 18%)' }} />
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div ref={progressRef} className="h-full origin-left"
            style={{ background: '#e30613', transform: 'scaleX(0)', willChange: 'transform' }} />
        </div>
      </div>
    </section>
  );
}
