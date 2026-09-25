import React, { useMemo, useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function HomeTeam() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();

  const members = useMemo(() => {
    return (content.home.team?.members || []).map((member) => ({
      name: t(locale, member.name),
      role: t(locale, member.role),
      description: t(locale, member.description),
      image: member.image,
    }));
  }, [content.home.team, locale]);

  useGsap(() => {
    if (members.length === 0) return;
    const totalSlides = members.length;
    const scrollDistance = (totalSlides - 1) * window.innerWidth;
    const snapPoints = Array.from({ length: totalSlides }, (_, i) => i / (totalSlides - 1));

    gsap.to(sectionRef.current, {
      x: () => `-${(totalSlides - 1) * 100}vw`,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: snapPoints,
          delay: 0,
          ease: 'power1.inOut',
        },
        invalidateOnRefresh: true,
      },
    });
  }, { dependencies: [members.length], scope: triggerRef });

  if (members.length === 0) return null;

  return (
    <div ref={triggerRef} className="overflow-hidden bg-black">
      <div
        ref={sectionRef}
        className="flex h-screen relative"
        style={{ width: `${members.length * 100}vw` }}
      >
        {members.map((member, i) => (
          <div
            key={i}
            className="h-screen w-screen shrink-0 relative flex items-center justify-center px-6 md:px-20"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={member.image}
                className="w-full h-full object-cover opacity-20 grayscale"
                referrerPolicy="no-referrer"
                alt={member.name}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Sol: Mətn */}
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.26em] text-premium-orange">
                    {t(locale, content.home.team.badge)} 0{i + 1}
                  </span>
                  <div className="h-px flex-1 bg-white/10 max-w-[100px]" />
                </div>

                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.95]">
                  {member.name}
                </h2>

                <p className="text-xl md:text-2xl font-bold text-premium-orange tracking-tight">
                  {member.role}
                </p>

                <p className="text-base md:text-lg text-white/70 max-w-md font-light leading-[1.75]">
                  {member.description}
                </p>
              </div>

              {/* Sağ: Şəkil */}
              <div className="hidden lg:block relative aspect-[3/4] max-w-md">
                <div className="absolute inset-0 border border-white/10 rounded-[2.75rem] rotate-3" />
                <div className="absolute inset-0 border border-premium-orange/20 rounded-[2.75rem] -rotate-2" />
                <img
                  src={member.image}
                  className="w-full h-full object-cover rounded-[2.75rem] shadow-[0_28px_80px_rgba(0,0,0,0.32)] relative z-10 grayscale"
                  referrerPolicy="no-referrer"
                  alt={member.name}
                />
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-12 left-6 md:left-20 flex items-center gap-4 z-20">
              <span className="text-xs font-bold text-white">0{i + 1}</span>
              <div className="w-40 h-px bg-white/10 relative">
                <div
                  className="absolute inset-0 bg-premium-orange origin-left"
                  style={{ transform: `scaleX(${(i + 1) / members.length})` }}
                />
              </div>
              <span className="text-xs font-bold text-white/50">0{members.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
