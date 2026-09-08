import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const SERVICES = [
  {
    num: '01',
    eyebrow: 'Səhnə avadanlıqları',
    title: 'Peşəkar\nSəhnə Qurğusu',
    description: 'Hər ölçüdə tədbirlər üçün yüksək keyfiyyətli səhnə, truss sistemləri, LED ekranlar və texniki infrasturktura.',
    tags: ['Səhnə', 'Truss', 'LED Ekran', 'Texniki Rider'],
    from: 0,
    to: 2,
  },
  {
    num: '02',
    eyebrow: 'Səs sistemləri',
    title: 'Kristal Səs\nHər Nöqtəyə',
    description: 'Line array sistemlərdən monitor qurğularına — peşəkar audio mühəndisliyi ilə hər məkanda mükəmməl akustika.',
    tags: ['Line Array', 'Subwoofer', 'Monitor', 'Audio Mix'],
    from: 2,
    to: 4,
  },
  {
    num: '03',
    eyebrow: 'Çap xidmətləri',
    title: 'Brendinizi\nGörünən Edin',
    description: 'Banner, rollup, backdrop, branding materialları — yüksək çözünürlüklü geniş format çap, sürətli çatdırılma.',
    tags: ['Banner', 'Rollup', 'Backdrop', 'Branding'],
    from: 4,
    to: 6,
  },
  {
    num: '04',
    eyebrow: 'Dekor xidməti',
    title: 'Məkanı\nMəkana Çevir',
    description: 'Fərdi konsept dekorasiya, floral dizayn, tematik qurğular — hər tədbirə özəl estetik atmosfer.',
    tags: ['Floral', 'Tematik', 'Fərdi Konsept'],
    from: 6,
    to: 7,
  },
  {
    num: '05',
    eyebrow: 'Rahat oturacaqlar',
    title: 'Qonaqlarınız\nRahat Olsun',
    description: 'Premium stul, masa, lounge divan, bar stolu — tədbirə uyğun oturacaq planlaması və montaj xidməti.',
    tags: ['Stul & Masa', 'Lounge', 'Bar Stolu', 'Montaj'],
    from: 7,
    to: 8,
  },
];

export default function ServicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tickingRef = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);

  const handleCanPlay = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        const video = videoRef.current;
        if (!section || !video) { tickingRef.current = false; return; }
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const p = Math.max(0, Math.min(1, -rect.top / scrollable));
        if (video.duration) video.currentTime = p * video.duration;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
        // Detect active service by currentTime
        const t = video.currentTime;
        const idx = SERVICES.findIndex((s) => t >= s.from && t < s.to);
        const newIdx = idx === -1 ? SERVICES.length - 1 : idx;
        if (newIdx !== activeIdxRef.current) { activeIdxRef.current = newIdx; setActiveIdx(newIdx); }
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ready]);

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
            {SERVICES.map((svc, i) => (
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

                <p className="font-inter text-white/50 leading-relaxed mb-5" style={{ fontSize: '13px', maxWidth: '360px' }}>
                  {svc.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {svc.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-[9px] tracking-wider uppercase font-inter rounded-full"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.03)' }}>
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
                  <span className="text-[9px] tracking-[0.2em] uppercase font-inter text-white/70 group-hover:text-white transition-colors">
                    Ətraflı
                  </span>
                </a>
              </div>
            ))}
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
            <span className="ml-2 text-[9px] font-inter text-white/55 tracking-wider">
              {String(activeIdx + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* RIGHT — video panel */}
        <div className="hidden md:block relative flex-1">
          {/* Loading shimmer */}
          <AnimatePresence>
            {!ready && (
              <motion.div key="l" initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: '#0d0d0d' }}>
                <div className="w-32 h-px bg-white/10 overflow-hidden rounded">
                  <motion.div className="h-full bg-premium-orange"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video */}
          <video
            ref={videoRef}
            src="/videos/services-bg.mp4"
            muted playsInline preload="auto"
            onCanPlay={handleCanPlay}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

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