import { useRef } from 'react';
import { useGsap, gsap, ScrollTrigger } from '../../motion/useGsap';

const STEPS = [
  {
    n: '01',
    title: 'Fərqli\nBaxış',
    text: 'Biz tədbirlərə sadəcə təşkil olunacaq bir iş kimi baxmırıq.',
    accent: '#e30613',
  },
  {
    n: '02',
    title: 'Atmosfer\nYaradan',
    text: 'Çünki insanlar bir tədbirin tərtibatını yox, atmosferini xatırlayırlar. Orada özünü necə hiss etdiklərini. Məhz buna görə bizim üçün hər layihə fərqli yanaşma tələb edir.',
    accent: '#ffffff',
  },
  {
    n: '03',
    title: 'Şablon\nYoxdur',
    text: 'Biz inanırıq ki, hər müştərinin ehtiyacı, hər tədbirin ritmi və hər brendin öz xarakteri var. Bu səbəbdən Eventrent-də heç bir layihəyə şablon şəkildə yanaşılmır.',
    accent: '#e30613',
  },
  {
    n: '04',
    title: 'Dərin\nAnlama',
    text: 'Biz müştərinin məqsədini, auditoriyasını, korporativ mədəniyyətini və yaratmaq istədiyi hissi anlamağa çalışırıq. Çünki eyni texniki imkanlarla tamamilə fərqli atmosferlər yaratmaq mümkündür.',
    accent: '#ffffff',
  },
  {
    n: '05',
    title: 'Dinamik\nFərq',
    text: 'Bəzən tədbir yüksək protokol və dəqiqlik tələb edir. Bəzən isə emosional enerji və dinamik atmosfer. Bizim yanaşmamız məhz həmin fərqi hiss etmək üzərində qurulub.',
    accent: '#e30613',
  },
  {
    n: '06',
    title: 'Vahid\nSistem',
    text: 'İlk ideyadan son saniyəyə qədər prosesin hər detalını düşünür, kreativlik, texnologiya və operativ təminatı vahid sistemdə birləşdiririk.',
    accent: '#ffffff',
  },
];

export default function HomeApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsap(() => {
    // Header reveal
    gsap.from('.ap-eyebrow', {
      y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.ap-heading-line', { y: '110%' }, {
      y: '0%', duration: 1.1, stagger: 0.12, ease: 'power4.out',
      scrollTrigger: { trigger: '.ap-title-block', start: 'top 78%', toggleActions: 'play none none none' },
    });

    // Each row: slide in from side on scroll
    gsap.utils.toArray<HTMLElement>('.ap-row').forEach((row, i) => {
      const isEven = i % 2 === 0;
      gsap.fromTo(row,
        { x: isEven ? -60 : 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Number counter
      const numEl = row.querySelector<HTMLElement>('.ap-num-display');
      if (numEl) {
        gsap.fromTo(numEl, { opacity: 0, scale: 0.6 }, {
          opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }

      // Progress bar
      const bar = row.querySelector<HTMLElement>('.ap-bar');
      if (bar) {
        gsap.fromTo(bar, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 75%', toggleActions: 'play none none none' },
        });
      }
    });

    // Final CTA — cinematic word reveal
    gsap.fromTo('.ap-quote-mark', { opacity: 0, scale: 0.4 }, {
      opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.ap-cta', start: 'top 80%', toggleActions: 'play none none none' },
    });

    gsap.fromTo('.ap-cta-label', { x: -30, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.ap-cta', start: 'top 78%', toggleActions: 'play none none none' },
    });

    gsap.fromTo('.ap-quote-rule', { scaleX: 0 }, {
      scaleX: 1, transformOrigin: 'left', duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.ap-cta', start: 'top 76%', toggleActions: 'play none none none' },
    });

    // Word-by-word scrub reveal — index-based, driven by single ScrollTrigger
    const words = gsap.utils.toArray<HTMLElement>('.ap-word');
    gsap.set(words, { opacity: 0.08, y: 18 });

    const logoEl = document.querySelector<HTMLElement>('.ap-logo-text');
    let logoFired = false;

    const spawnBurst = (cx: number, cy: number, count: number, distMult: number, sizeMult: number) => {
      const colors = ['#e30613', '#ff4a53', '#ffffff', '#ff8c00', '#ffcc00', '#e30613', '#ffffff'];
      for (let k = 0; k < count; k++) {
        const p = document.createElement('div');
        p.className = 'ap-particle';
        const size = (3 + Math.random() * 6) * sizeMult;
        p.style.cssText = `width:${size}px;height:${size}px;background:${colors[k % colors.length]};left:${cx}px;top:${cy}px;border-radius:${Math.random() > 0.35 ? '50%' : '2px'};`;
        document.body.appendChild(p);

        const angle = (k / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const dist = (70 + Math.random() * 160) * distMult;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const dur = 1.8 + Math.random() * 1.4;

        gsap.fromTo(p,
          { x: 0, y: 0, opacity: 1, scale: 1 },
          {
            x: tx, y: ty, opacity: 0, scale: 0.15,
            duration: dur,
            ease: 'power2.out',
            delay: Math.random() * 0.25,
            onComplete: () => p.remove(),
          }
        );
      }
    };

    const fireFireworks = (originEl: HTMLElement) => {
      const rect = originEl.getBoundingClientRect();
      // partlama nöqtəsi yazının üstündə ~120px yuxarıda
      const burstY = rect.top - 120;

      const points = [0.08, 0.25, 0.42, 0.58, 0.75, 0.92].map(
        (t) => rect.left + rect.width * t
      );

      points.forEach((cx, idx) => {
        const isMain = idx % 2 === 0;
        const count = isMain ? 22 : 14;
        const colors = ['#e30613', '#ff4a53', '#ffffff', '#ff8c00', '#ffcc00', '#e30613', '#ffffff'];

        for (let k = 0; k < count; k++) {
          const p = document.createElement('div');
          p.className = 'ap-particle';
          const size = (3 + Math.random() * 7) * (isMain ? 1 : 0.8);
          p.style.cssText = `
            width:${size}px;height:${size}px;
            background:${colors[k % colors.length]};
            left:${cx}px;top:${burstY}px;
            border-radius:${Math.random() > 0.35 ? '50%' : '2px'};
            position:fixed;pointer-events:none;z-index:9999;
          `;
          document.body.appendChild(p);

          // Yayılma açısı: aşağıya doğru (90° ətrafında) — EVENTRENT üstünə tökülsün
          const spread = Math.PI * 0.75; // 135° yelpazə
          const baseAngle = Math.PI * 0.5; // aşağı
          const angle = baseAngle - spread / 2 + Math.random() * spread;
          const dist = (80 + Math.random() * 180) * (isMain ? 1 : 0.75);
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist; // müsbət = aşağı

          gsap.fromTo(p,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: tx,
              y: ty,
              opacity: 0,
              scale: 0.1,
              duration: 1.6 + Math.random() * 1.2,
              ease: 'power2.out',
              delay: Math.random() * 0.3,
              onComplete: () => p.remove(),
            }
          );
        }
      });
    };

    ScrollTrigger.create({
      trigger: '.ap-quote-text',
      start: 'top 100%',
      end: 'bottom 55%',
      scrub: 1,
      onUpdate: (self) => {
        const total = words.length;
        const lit = Math.round(self.progress * total);
        words.forEach((w, i) => {
          const target = i < lit ? 1 : 0.08;
          const targetY = i < lit ? 0 : 18;
          gsap.to(w, { opacity: target, y: targetY, duration: 0.25, overwrite: true });
        });

        if (!logoFired && lit > 5 && logoEl) {
          logoFired = true;
          fireFireworks(logoEl);
        }
        if (logoFired && lit <= 5) {
          logoFired = false;
        }
      },
    });

    gsap.fromTo('.ap-cta-sub', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ap-cta-sub', start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative bg-[#060606] overflow-hidden">
      {/* Faint grid */}
      <div className="absolute inset-0 grid-lines opacity-[0.06] pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-40 pb-20 md:pb-28">
        <div className="ap-eyebrow flex items-center gap-4 mb-12 md:mb-16">
          <span className="text-[9px] font-black tracking-[0.45em] uppercase text-premium-orange">03</span>
          <div className="h-px w-16 bg-white/15" />
          <span className="text-[9px] font-black tracking-[0.45em] uppercase text-white/30">Yanaşmamız</span>
        </div>

        <div className="ap-title-block overflow-hidden">
          <div className="overflow-hidden">
            <h2 className="ap-heading-line font-black uppercase tracking-tighter leading-[0.88] text-white"
              style={{ fontSize: 'clamp(2.8rem, 7.5vw, 7.5rem)' }}>
              HƏR LAYİHƏYƏ
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="ap-heading-line font-black uppercase tracking-tighter leading-[0.88] text-white/10 italic"
              style={{ fontSize: 'clamp(2.8rem, 7.5vw, 7.5rem)', WebkitTextStroke: '1px rgba(255,255,255,0.18)' }}>
              FƏRQLİ BAXIŞ
            </h2>
          </div>
        </div>
      </div>

      {/* ── Rows ── */}
      <div className="relative">
        {STEPS.map((step, i) => {
          const isEven = i % 2 === 0;
          const isOrange = step.accent === '#e30613';
          return (
            <div
              key={step.n}
              className="ap-row group relative border-t border-white/[0.06] overflow-hidden cursor-default"
            >
              {/* Hover background fill */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: isOrange ? 'rgba(227,6,19,0.04)' : 'rgba(255,255,255,0.02)' }}
              />

              {/* Progress bar on hover */}
              <div
                className="ap-bar absolute bottom-0 left-0 h-[2px] w-full origin-left"
                style={{ background: isOrange ? '#e30613' : 'rgba(255,255,255,0.2)', transform: 'scaleX(0)' }}
              />

              <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14 grid grid-cols-12 items-center gap-6 md:gap-10">

                {/* Ghost number — alternating sides */}
                <div className={`hidden lg:flex col-span-2 ${isEven ? 'order-first justify-start' : 'order-last justify-end'}`}>
                  <span
                    className="ap-num-display font-black leading-none select-none"
                    style={{
                      fontSize: 'clamp(5rem, 9vw, 10rem)',
                      color: isOrange ? 'rgba(227,6,19,0.12)' : 'rgba(255,255,255,0.04)',
                      WebkitTextStroke: isOrange ? '1px rgba(227,6,19,0.25)' : '1px rgba(255,255,255,0.1)',
                      letterSpacing: '-0.05em',
                    }}
                  >
                    {step.n}
                  </span>
                </div>

                {/* Step index badge */}
                <div className={`col-span-12 lg:col-span-1 ${isEven ? 'order-first lg:order-none' : ''} flex lg:flex-col items-center lg:items-start gap-3 lg:gap-2`}>
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[10px] font-black border"
                    style={{
                      borderColor: isOrange ? 'rgba(227,6,19,0.4)' : 'rgba(255,255,255,0.15)',
                      color: isOrange ? '#e30613' : 'rgba(255,255,255,0.5)',
                      background: isOrange ? 'rgba(227,6,19,0.08)' : 'transparent',
                    }}
                  >
                    {step.n}
                  </span>
                  <div className="h-px w-8 lg:w-0 lg:h-8 bg-white/10 flex-shrink-0" />
                </div>

                {/* Title */}
                <div className={`col-span-12 lg:col-span-4 ${isEven ? '' : 'lg:order-first'}`}>
                  <h3
                    className="font-black uppercase tracking-tighter leading-[0.9] text-white group-hover:translate-x-2 transition-transform duration-500"
                    style={{ fontSize: 'clamp(1.6rem, 3.2vw, 3rem)', whiteSpace: 'pre-line' }}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* Text */}
                <div className="col-span-12 lg:col-span-4 lg:ml-auto">
                  <p className="font-inter text-white/70 group-hover:text-white/90 transition-colors duration-500 text-[15px] md:text-[17px] font-normal leading-[1.85] tracking-[0.01em]">
                    {step.text}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
        {/* Last border */}
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── Final CTA ── */}
      <div className="ap-cta relative max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-16 md:pb-24">

        {/* top rule + label */}
        <div className="flex items-center gap-5 mb-6 md:mb-8">
          <div className="ap-quote-rule h-px bg-white/15 flex-1" style={{ transform: 'scaleX(0)', transformOrigin: 'left' }} />
          <span className="ap-cta-label text-[9px] font-black tracking-[0.45em] uppercase text-premium-orange whitespace-nowrap">
            Bizim Yanaşma
          </span>
        </div>

        {/* quote mark */}
        <span className="ap-quote-mark block font-serif text-premium-orange/20 leading-none select-none mb-3"
          style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', opacity: 0 }}>
          "
        </span>

        {/* word-by-word text */}
        <p className="ap-quote-text"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 4.2rem)', lineHeight: 1.25, letterSpacing: '-0.02em', fontWeight: 300 }}>
          {[
            { text: 'Bizim', accent: false },
            { text: 'əməkdaşlar', accent: false },
            { text: 'tədbir', accent: false },
            { text: 'zamanı', accent: false },
            { text: 'sadəcə', accent: false },
            { text: '', accent: false, isLogo: true },
            { text: 'təmsil', accent: false },
            { text: 'etmir.', accent: false },
            { text: 'Onlar', accent: false },
            { text: 'sizin', accent: false },
            { text: 'qarşınızda', accent: false },
            { text: 'məhz', accent: false },
            { text: 'sizin', accent: true },
            { text: 'komandanızın', accent: true },
            { text: 'bir', accent: true },
            { text: 'üzvünə', accent: true },
            { text: 'çevrilirlər.', accent: false },
          ].map((w, i) => (
            <span
              key={i}
              className="ap-word inline-block mr-[0.28em]"
              style={{
                opacity: 0.08,
                willChange: 'opacity, transform',
                ...(!w.isLogo && { color: w.accent ? '#e30613' : 'rgba(255,255,255,0.92)' }),
              }}
            >
              {w.isLogo ? (
                <span className="ap-logo-text"
                  style={{ fontSize: '1.15em', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  <span style={{ color: 'rgba(255,255,255,0.92)' }}>EVENT</span>
                  <span style={{ color: '#e30613' }}>RENT</span>
                  <span style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 300, fontSize: '0.75em', letterSpacing: 0 }}>-i</span>
                </span>
              ) : w.text}
            </span>
          ))}
        </p>

        {/* sub note */}
        <p className="ap-cta-sub mt-14 text-white/20 text-sm font-normal tracking-[0.2em] uppercase">
          Eventrent · İlk ideyadan son saniyəyə
        </p>
      </div>
    </section>
  );
}