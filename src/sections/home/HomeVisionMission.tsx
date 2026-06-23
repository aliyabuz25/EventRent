import { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';

export default function HomeVisionMission() {
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  
  useGsap(() => {
    gsap.from('.vm-v-char', {
      y: '105%', opacity: 0, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: visionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-img-1',
      { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' },
      { clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'power3.inOut',
        scrollTrigger: { trigger: visionRef.current, start: 'top 70%', toggleActions: 'play none none none' } }
    );
    gsap.from('.vm-v-body', {
      x: -40, opacity: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: visionRef.current, start: 'top 65%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-v-rule', { scaleX: 0 }, {
      scaleX: 1, transformOrigin: 'left', duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: visionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
    });
    gsap.to('.vm-ghost-1', {
      y: '-25%', ease: 'none',
      scrollTrigger: { trigger: visionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    gsap.from('.vm-m-char', {
      y: '105%', opacity: 0, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: missionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-img-2',
      { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
      { clipPath: 'polygon(0% 0%, 88% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'power3.inOut',
        scrollTrigger: { trigger: missionRef.current, start: 'top 70%', toggleActions: 'play none none none' } }
    );
    gsap.from('.vm-m-body', {
      x: 40, opacity: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: missionRef.current, start: 'top 65%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-m-rule', { scaleX: 0 }, {
      scaleX: 1, transformOrigin: 'right', duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: missionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
    });
    gsap.to('.vm-ghost-2', {
      y: '-25%', ease: 'none',
      scrollTrigger: { trigger: missionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.utils.toArray<HTMLElement>('.vm-stat-num').forEach((el) => {
      const target = parseInt(el.dataset.target ?? '0', 10);
      gsap.fromTo(el, { textContent: '0' }, {
        textContent: target, duration: 2, ease: 'power2.out', snap: { textContent: 1 },
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });

      });

  return (
    <>
      {/* ══ VİZYONUMUZ ══ */}
      <div ref={visionRef} className="relative bg-brand-bg flex items-center overflow-hidden">
        <span className="vm-ghost-1 absolute -left-[5vw] top-1/2 -translate-y-1/2 text-[55vw] font-black leading-none select-none pointer-events-none text-white/[0.018] tracking-tighter z-0">
          01
        </span>
        <div className="vm-img-1 absolute right-0 top-0 bottom-0 w-[48%] z-0"
          style={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}>
          <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80"
            alt="" className="w-full h-full object-cover grayscale brightness-[0.35]" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-bg/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="flex items-center gap-4 mb-10">
            <div className="vm-v-rule h-px w-16 bg-premium-orange" style={{ transformOrigin: 'left', transform: 'scaleX(0)' }} />
            <span className="text-[9px] font-black tracking-[0.45em] uppercase text-premium-orange">01 — Vizyon</span>
          </div>

          {/* Full-width heading */}
          <div className="overflow-hidden mb-12">
            <h2 className="vm-v-char font-black tracking-tight leading-[0.9] uppercase text-white whitespace-nowrap"
              style={{ fontSize: 'clamp(3rem, 8.5vw, 8rem)' }}>
              VİZYONUMUZ
            </h2>
          </div>

          <div className="vm-v-body max-w-xl">
            <p className="font-inter text-white/55 text-xl md:text-2xl font-light leading-[1.75] mb-10">
              Tədbir üçün bütün{' '}
              <em className="not-italic font-semibold text-white">infrastruktur</em>,{' '}
              <em className="not-italic font-semibold text-white">avadanlıq</em>{' '}
              və həlləri bir mərkəzdə birləşdirən komandayıq.
            </p>
            <div className="flex items-center gap-3 text-white/20">
              <div className="w-8 h-px bg-white/20" />
              <span className="text-[9px] font-bold uppercase tracking-[0.35em]">Bir Mərkəz · Tam Həll</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
      </div>

      {/* ══ MİSSİYAMIZ ══ */}
      <div ref={missionRef} className="relative bg-[#060606] flex items-center overflow-hidden">
        <span className="vm-ghost-2 absolute -right-[5vw] top-1/2 -translate-y-1/2 text-[55vw] font-black leading-none select-none pointer-events-none text-white/[0.018] tracking-tighter z-0">
          02
        </span>
        <div className="vm-img-2 absolute left-0 top-0 bottom-0 w-[45%] z-0"
          style={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}>
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80"
            alt="" className="w-full h-full object-cover grayscale brightness-[0.3]" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-linear-to-l from-[#060606] via-[#060606]/55 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="flex items-center gap-4 mb-10 justify-end">
            <span className="text-[9px] font-black tracking-[0.45em] uppercase text-premium-orange">02 — Missiya</span>
            <div className="vm-m-rule h-px w-16 bg-premium-orange" style={{ transformOrigin: 'right', transform: 'scaleX(0)' }} />
          </div>

          {/* Full-width heading — right aligned */}
          <div className="overflow-hidden mb-12 text-right">
            <h2 className="vm-m-char font-black tracking-tight leading-[0.9] uppercase text-white whitespace-nowrap"
              style={{ fontSize: 'clamp(3rem, 8.5vw, 8rem)' }}>
              MİSSİYAMIZ
            </h2>
          </div>

          <div className="vm-m-body max-w-xl ml-auto space-y-10">
            <p className="font-inter text-white/55 text-xl md:text-2xl font-light leading-[1.75] text-right">
              Hər ideyanın reallaşması üçün lazım olan{' '}
              <em className="not-italic font-semibold text-white">texniki</em> və{' '}
              <em className="not-italic font-semibold text-white">fiziki imkanları</em>{' '}
              bir mərkəzdə birləşdirərək{' '}
              <em className="not-italic font-semibold text-premium-orange">etibarlı tərəfdaşa</em>{' '}
              çevrilmək.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {[
                { target: 10, suffix: '+', label: 'İllik Təcrübə' },
                { target: 1200, suffix: '+', label: 'Uğurlu Layihə' },
                { target: 50, suffix: '+', label: 'Tərəfdaş Brend' },
              ].map((s) => (
                <div key={s.label} className="text-right space-y-2">
                  <div className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                    <span className="vm-stat-num text-white" data-target={s.target}>0</span>
                    <span className="text-premium-orange">{s.suffix}</span>
                  </div>
                  <div className="text-sm font-bold text-white/70 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
      </div>

          </>
  );
}