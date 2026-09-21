import { useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function AboutVisionMission() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();
  const s = content.about.visionMission;

  useGsap(() => {
    gsap.fromTo('.vm-v-char',
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' } }
    );
    gsap.from('.vm-v-body', {
      x: -50, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.15,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-v-rule', { scaleX: 0 }, {
      scaleX: 1, transformOrigin: 'left', duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-m-char',
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' } }
    );
    gsap.from('.vm-m-body', {
      x: 50, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.15,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-m-rule', { scaleX: 0 }, {
      scaleX: 1, transformOrigin: 'right', duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
    });
    gsap.fromTo('.vm-divider', { scaleY: 0 }, {
      scaleY: 1, transformOrigin: 'top', duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
    });
    gsap.utils.toArray<HTMLElement>('.vm-stat-num').forEach((el) => {
      const target = parseInt(el.dataset.target ?? '0', 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2.2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate() { if (el) el.textContent = String(Math.round(obj.val)); },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative bg-[#080808] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[50%] opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(227,6,19,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[50%] opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(255,120,0,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-36">
        <div className="flex items-center gap-4 mb-16 md:mb-20">
          <div className="h-px w-10 bg-premium-orange/60" />
          <span className="flex items-center gap-2 text-[9px] font-black tracking-[0.5em] uppercase text-premium-orange">
            {t(locale, s.badge)}
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative pr-0 md:pr-12 lg:pr-20 pb-16 md:pb-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="vm-v-rule h-px w-10 bg-premium-orange" style={{ transform: 'scaleX(0)', transformOrigin: 'left' }} />
              <span className="text-[9px] font-black tracking-[0.45em] uppercase text-premium-orange">{t(locale, s.visionLabel)}</span>
            </div>
            <div className="overflow-hidden mb-8">
              <h2
                className="vm-v-char font-black tracking-tight leading-[0.9] uppercase text-white"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 6rem)' }}
              >
                {t(locale, s.visionTitle)}
              </h2>
            </div>
            <div className="vm-v-body space-y-6 max-w-md">
              <p className="font-inter text-white/50 text-base md:text-lg font-light leading-[1.85]">
                {t(locale, s.visionBody)}
              </p>
              <div className="flex items-center gap-3 text-white/50 pt-2">
                <div className="w-6 h-px bg-white/20" />
                <span className="text-[9px] font-bold uppercase tracking-[0.35em]">{t(locale, s.visionTagline)}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px">
            <div className="vm-divider h-full bg-white/[0.07]" style={{ transform: 'scaleY(0)', transformOrigin: 'top' }} />
          </div>

          <div className="relative pl-0 md:pl-12 lg:pl-20 pt-16 md:pt-0 border-t border-white/[0.07] md:border-t-0">
            <div className="md:hidden absolute top-0 left-0 right-0 h-px bg-white/[0.07]" />
            <div className="flex items-center gap-3 mb-8 justify-end">
              <span className="text-[9px] font-black tracking-[0.45em] uppercase text-premium-orange">{t(locale, s.missionLabel)}</span>
              <div className="vm-m-rule h-px w-10 bg-premium-orange" style={{ transform: 'scaleX(0)', transformOrigin: 'right' }} />
            </div>
            <div className="overflow-hidden mb-8 text-right">
              <h2
                className="vm-m-char font-black tracking-tight leading-[0.9] uppercase text-white"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 6rem)' }}
              >
                {t(locale, s.missionTitle)}
              </h2>
            </div>
            <div className="vm-m-body space-y-6 ml-auto max-w-md">
              <p className="font-inter text-white/50 text-base md:text-lg font-light leading-[1.85] text-right">
                {t(locale, s.missionBody)}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08]">
                {s.stats.map((stat) => (
                  <div key={stat.target} className="text-right space-y-1">
                    <div className="font-black tracking-tight leading-none"
                      style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.5rem)' }}>
                      <span className="vm-stat-num text-white" data-target={stat.target}>0</span>
                      <span className="text-premium-orange">{stat.suffix}</span>
                    </div>
                    <div className="text-[10px] font-bold text-white/65 leading-snug tracking-wide uppercase">
                      {t(locale, stat.label)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}