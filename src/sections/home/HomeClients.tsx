import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

const LOGOS = [
  { name: 'ABB', sub: 'Bank', img: '/logos/abb.png', url: 'https://abb-bank.az' },
  { name: 'SOCAR', sub: 'Enerji', img: '/logos/socar.svg', url: 'https://socar.az' },
  { name: 'Kapital', sub: 'Bank', img: '/logos/kapital-bank.svg', url: 'https://kapitalbank.az' },
  { name: 'AzərGold', sub: '', img: null, url: 'https://azergold.az' },
  { name: 'Bakcell', sub: '', img: '/logos/bakcell.svg', url: 'https://bakcell.com' },
  { name: 'Nar', sub: 'Mobile', img: null, url: 'https://nar.az' },
  { name: 'Silk Way', sub: 'Airlines', img: '/logos/silkway.svg', url: 'https://silkwayairlines.com' },
  { name: 'Atlas', sub: 'Group', img: null, url: 'https://atlasgroup.az' },
  { name: 'İpoteka', sub: 'Bank', img: null, url: 'https://ipotekabank.az' },
];

function LogoItem({ name, sub, img, url }: { name: string; sub: string; img: string | null; url: string }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const showImg = img && !imgFailed;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-center select-none transition-all duration-400 rounded-xl"
      style={{
        width: 176,
        height: 100,
        border: hovered ? '1px solid rgba(227,6,19,0.4)' : '1px solid rgba(255,255,255,0.07)',
        background: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.02)',
        opacity: hovered ? 1 : 0.42,
        boxShadow: hovered ? '0 8px 32px rgba(227,6,19,0.15), 0 0 0 1px rgba(227,6,19,0.1)' : 'none',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showImg ? (
        <img
          src={img}
          alt={name}
          onError={() => setImgFailed(true)}
          className="w-auto object-contain transition-all duration-400"
          style={{
            maxWidth: 140,
            height: 60,
            filter: hovered
              ? 'grayscale(0) brightness(1) contrast(1.1) drop-shadow(0 2px 8px rgba(227,6,19,0.2))'
              : 'grayscale(1) brightness(1.3) contrast(0.6)',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <span
            className="font-black tracking-tight uppercase leading-none transition-colors duration-300"
            style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: hovered ? '#e30613' : 'rgba(255,255,255,0.88)' }}
          >
            {name}
          </span>
          {sub && (
            <span
              className="text-[8px] font-bold tracking-[0.32em] uppercase leading-none transition-colors duration-300"
              style={{ color: hovered ? 'rgba(227,6,19,0.6)' : 'rgba(255,255,255,0.28)' }}
            >
              {sub}
            </span>
          )}
        </div>
      )}
    </a>
  );
}

export default function HomeClients() {
  const outerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();
  const metrics = content?.home?.metrics?.items || [];

  const parseValue = (v: string) => {
    const match = v.match(/^([\d.,]+)(.*)$/);
    if (!match) return { raw: '0', suffix: v };
    return { raw: match[1], suffix: match[2] };
  };

  useGsap(() => {
    // Metrics Animation
    gsap.utils.toArray<HTMLElement>('.cl-metric-item').forEach((item, i) => {
      const valueEl = item.querySelector<HTMLElement>('.cl-metric-val');
      if (valueEl) {
        const raw = valueEl.dataset.raw ?? '0';
        const suffix = valueEl.dataset.suffix ?? '';
        const numericVal = parseFloat(raw.replace(/,/g, ''));
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericVal,
          duration: 2.5,
          ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: { trigger: outerRef.current, start: 'top 85%', once: true },
          onUpdate() {
            const display = Math.round(obj.val).toLocaleString('en-US');
            if (valueEl) valueEl.innerHTML = display + suffix;
          },
        });
      }
    });

    gsap.fromTo('.cl-metric-item',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: outerRef.current, start: 'top 85%', once: true }
      }
    );
    // Row 1 — slides from left all the way through
    gsap.fromTo('.cl-row-1',
      { x: '-22%' },
      {
        x: '4%', ease: 'none',
        scrollTrigger: { trigger: outerRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      }
    );
    // Row 2 — slides from right all the way through
    gsap.fromTo('.cl-row-2',
      { x: '18%' },
      {
        x: '-5%', ease: 'none',
        scrollTrigger: { trigger: outerRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      }
    );
    // Row 3 — slides from left all the way through
    gsap.fromTo('.cl-row-3',
      { x: '-15%' },
      {
        x: '6%', ease: 'none',
        scrollTrigger: { trigger: outerRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      }
    );
    // Row 4 — slides from right all the way through
    gsap.fromTo('.cl-row-4',
      { x: '12%' },
      {
        x: '-4%', ease: 'none',
        scrollTrigger: { trigger: outerRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      }
    );

    // Fade in once section enters
    gsap.from(['.cl-row-1', '.cl-row-2', '.cl-row-3', '.cl-row-4'],
      {
        opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: outerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      }
    );

      // Eyebrow + rule
      gsap.from('.cl-eyebrow', {
        y: 20, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: outerRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      });
    }, { scope: outerRef, dependencies: [metrics] });

  return (
    <section ref={outerRef} className="relative bg-[#060606] overflow-hidden py-28 md:py-40">
      {/* top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Warm ambient glow — bottom right */}
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vh] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(227,6,19,0.09) 0%, transparent 65%)' }} />
      {/* Top left cool */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vh] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(255,120,0,0.05) 0%, transparent 60%)' }} />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {/* --- Metrics Section Integrated --- */}
        <div className="mb-28 md:mb-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {metrics.map((stat, i) => {
              const val = stat?.value || '0';
              const { raw, suffix } = parseValue(val);
              return (
                <div key={i} className="cl-metric-item flex flex-col items-center text-center group">
                  <span
                    className="cl-metric-val font-black tracking-tighter italic transition-all duration-500 group-hover:scale-105"
                    style={{
                      fontSize: 'clamp(3rem, 6vw, 6rem)',
                      WebkitTextStroke: '1.5px rgba(255,255,255,0.3)',
                      color: 'transparent',
                      lineHeight: 1,
                    }}
                    data-raw={raw}
                    data-suffix={suffix}
                    dangerouslySetInnerHTML={{ __html: `0${suffix}` }}
                  />
                  <span className="mt-4 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-premium-orange/80">
                    {t(locale, stat.label)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* -------------------------------- */}

        {/* Eyebrow */}
        <div className="cl-eyebrow flex items-center gap-4 mb-16 md:mb-20">
          <div className="h-px w-12 bg-premium-orange/60" />
          <span className="text-[9px] font-black tracking-[0.5em] uppercase text-premium-orange">
            Etibar Edənlər
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/50">
            50+ Brend
          </span>
        </div>

        {/* Row 1 — giant, outlined + solid mix */}
        <div className="cl-row-1 flex items-baseline gap-[0.12em] overflow-hidden mb-1"
          style={{ fontSize: 'clamp(3.2rem, 8.5vw, 9rem)', lineHeight: 0.88, letterSpacing: '-0.04em', fontWeight: 900 }}>
          <span className="uppercase text-white">ABB</span>
          <span className="uppercase mx-[0.18em] text-premium-orange/30 font-light text-[0.35em] self-center tracking-[0.2em]">×</span>
          <span className="uppercase italic"
            style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.25)', color: 'transparent' }}>SOCAR</span>
          <span className="uppercase mx-[0.18em] text-premium-orange/30 font-light text-[0.35em] self-center tracking-[0.2em]">×</span>
          <span className="uppercase text-premium-orange">PASHA</span>
          <span className="uppercase text-white/45 ml-[0.08em]">Holding</span>
        </div>

        {/* Row 2 — medium, right-pushed */}
        <div className="cl-row-2 flex items-baseline justify-end gap-[0.14em] overflow-hidden mb-1"
          style={{ fontSize: 'clamp(2.4rem, 6.5vw, 7rem)', lineHeight: 0.88, letterSpacing: '-0.04em', fontWeight: 900 }}>
          <span className="uppercase italic"
            style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.18)', color: 'transparent' }}>Kapital</span>
          <span className="uppercase text-white/80">Bank</span>
          <span className="uppercase mx-[0.2em] text-premium-orange/25 font-light text-[0.32em] self-center tracking-[0.2em]">×</span>
          <span className="uppercase"
            style={{ color: '#e30613' }}>Bakcell</span>
        </div>

        {/* Thin rule */}
        <div className="h-px bg-white/[0.06] my-4" />

        {/* Row 3 — mixed sizes */}
        <div className="cl-row-3 flex items-baseline flex-wrap gap-x-[0.14em] overflow-hidden mb-1"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.035em', fontWeight: 900 }}>
          <span className="uppercase text-white/90">AzərGold</span>
          <span className="uppercase mx-[0.18em] text-premium-orange/25 font-light text-[0.32em] self-center tracking-[0.2em]">×</span>
          <span className="uppercase italic"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>Azərenerji</span>
          <span className="uppercase mx-[0.18em] text-premium-orange/25 font-light text-[0.32em] self-center tracking-[0.2em]">×</span>
          <span className="uppercase text-premium-orange/80">Silk Way</span>
        </div>

        {/* Row 4 — smallest, dense */}
        <div className="cl-row-4 flex items-baseline flex-wrap gap-x-[0.2em] overflow-hidden"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 3.2rem)', lineHeight: 0.92, letterSpacing: '-0.025em', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>
          {['Nar Mobile', 'Atlas Group', 'Bravo', 'İpoteka Bank'].map((n, i) => (
            <span key={n} className="uppercase">
              {n}{i < 3 && <span className="text-premium-orange/30 mx-[0.25em]">·</span>}
            </span>
          ))}
        </div>

        {/* Logo strip — img with text fallback */}
        <div className="mt-20 pt-10 border-t border-white/[0.05]">
          <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white/50 mb-8 text-center">
            Güvənilən Brendlər
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-6">
            {LOGOS.map((l) => (
              <LogoItem key={l.name} name={l.name} sub={l.sub} img={l.img} url={l.url} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}