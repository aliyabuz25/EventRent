import React, { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';

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
      className="flex flex-col items-center justify-center select-none transition-all duration-300"
      style={{
        width: 160,
        height: 88,
        border: hovered ? '1px solid rgba(227,6,19,0.45)' : '1px solid rgba(255,255,255,0.07)',
        background: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.02)',
        borderRadius: 6,
        opacity: hovered ? 1 : 0.45,
        boxShadow: hovered ? '0 0 18px rgba(227,6,19,0.12)' : 'none',
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
            maxWidth: 130,
            height: 56,
            filter: hovered
              ? 'grayscale(0) brightness(1.15) contrast(1.05) drop-shadow(0 0 8px rgba(227,6,19,0.3))'
              : 'grayscale(1) brightness(1.35) contrast(0.65)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-[5px]">
          <span
            className="text-[22px] font-black tracking-[-0.03em] uppercase leading-none transition-colors duration-300"
            style={{ color: hovered ? '#e30613' : 'rgba(255,255,255,0.85)' }}
          >
            {name}
          </span>
          {sub && (
            <span
              className="text-[8px] font-bold tracking-[0.28em] uppercase leading-none transition-colors duration-300"
              style={{ color: hovered ? 'rgba(227,6,19,0.55)' : 'rgba(255,255,255,0.3)' }}
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

  useGsap(() => {
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
  }, { scope: outerRef });

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

        {/* Eyebrow */}
        <div className="cl-eyebrow flex items-center gap-4 mb-16 md:mb-20">
          <div className="h-px w-12 bg-premium-orange/60" />
          <span className="text-[9px] font-black tracking-[0.5em] uppercase text-premium-orange">
            Etibar Edənlər
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
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
          <span className="uppercase text-white/15 ml-[0.08em]">Holding</span>
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
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-7">
            {LOGOS.map((l) => (
              <LogoItem key={l.name} name={l.name} sub={l.sub} img={l.img} url={l.url} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}