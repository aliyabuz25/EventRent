import React, { useMemo, useRef } from 'react';
import { useGsap, gsap } from '../../motion/useGsap';
import { MessageSquare, ClipboardList, Settings, Rocket } from 'lucide-react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

const stepIcons = [MessageSquare, ClipboardList, Settings, Rocket];

const fallbackSteps = [
  {
    title: 'Expert Consultation',
    description: 'We dive deep into your project vision, analyzing spatial constraints, acoustic requirements, and visual impact to ensure a solid foundation.',
    icon: MessageSquare,
    bg: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000'
  },
  {
    title: 'Precise Engineering',
    description: 'Our technical designers craft detailed blueprints and 3D renderings using industry-leading software (CAD, Vectorworks, Wysiwyg).',
    icon: ClipboardList,
    bg: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000'
  },
  {
    title: 'Seamless Setup',
    description: 'A dedicated team of certified riggers, technicians, and engineers manages the complete load-in and precision installation.',
    icon: Settings,
    bg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000'
  },
  {
    title: 'Flawless Execution',
    description: 'Live mission control. We manage every technical transition, from real-time lighting cues to complex audio mixes, with total precision.',
    icon: Rocket,
    bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000'
  },
];

export default function ServicesProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content, locale } = useSiteContent();

  const steps = useMemo(() => {
    const contentSteps = content.home.process.steps || [];
    if (!contentSteps.length) {
      return fallbackSteps;
    }

    return contentSteps.map((step, index) => ({
      title: t(locale, step.title),
      description: t(locale, step.description),
      bg: step.bg,
      icon: stepIcons[index] || MessageSquare,
    }));
  }, [content.home.process.steps, locale]);

  useGsap(() => {
    const cards = gsap.utils.toArray('.process-card');

    cards.forEach((card: any, i: number) => {
      if (i < cards.length - 1) {
        gsap.to(card, {
          scale: 0.66,
          opacity: 0,
          y: -160,
          rotationX: -12,
          transformOrigin: "center top",
          filter: 'blur(16px)',
          scrollTrigger: {
            trigger: card,
            start: 'top 28%',
            end: 'bottom top',
            scrub: 0.9,
          }
        });
      }

      gsap.from(card, {
        y: 72,
        opacity: 0,
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          end: 'top 64%',
          scrub: 0.9,
        }
      });
    });

    gsap.from('.process-header', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-brand-bg relative py-20 md:py-24 overflow-hidden border-t border-white/5">
      <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5 hidden xl:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="process-header mb-14 md:mb-16 flex flex-col md:flex-row justify-between items-end gap-10 md:gap-12">
          <div className="space-y-5">
            <span className="text-premium-orange text-[10px] font-black uppercase tracking-[0.26em]">{t(locale, content.home.process.badge)}</span>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-ultra-tight leading-[0.94]">
              {t(locale, content.home.process.title)} <span className="text-stroke-solid text-white/40 italic">{t(locale, content.home.process.titleAccent)}</span>
            </h2>
          </div>
          <div className="max-w-xs space-y-6">
            <div className="h-px w-20 bg-premium-orange" />
            <p className="text-gray-400 font-medium leading-[1.75]">
              {t(locale, content.home.process.description)}
            </p>
          </div>
        </div>

        <div className="space-y-10 md:space-y-28 pb-8 md:pb-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="process-card sticky top-24 w-full flex flex-col md:flex-row bg-brand-card rounded-[2.75rem] overflow-hidden border border-white/8 shadow-[0_28px_80px_rgba(0,0,0,0.32)] group transition-colors duration-300 hover:border-premium-orange/20"
            >
              <div className="w-full md:w-24 bg-white/5 flex flex-col items-center justify-between py-12 order-3 md:order-1 border-t md:border-t-0 md:border-r border-white/5">
                <span className="text-sm font-black text-white/20 select-none">{t(locale, content.home.process.phase)}</span>
                <span className="text-4xl font-black text-premium-orange select-none">0{i + 1}</span>
                <div className="w-1 h-32 bg-white/5 rounded-full overflow-hidden hidden md:block">
                  <div
                    className="w-full bg-premium-orange"
                    style={{ height: `${(i + 1) * 25}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 p-8 md:p-14 lg:p-18 order-2 md:order-2 flex flex-col justify-center gap-8 md:gap-10">
                <div className="space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-premium-orange/10 border border-premium-orange/20 shadow-[0_18px_40px_rgba(227,6,19,0.12)] backdrop-blur-sm flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-premium-orange" />
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-ultra-tight text-white leading-[0.98]">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xl md:text-2xl text-gray-300/90 font-medium leading-[1.7] max-w-2xl">
                  {step.description}
                </p>

                <div className="flex items-center gap-6 md:gap-8 text-[10px] font-black uppercase tracking-[0.24em] text-white/25">
                  <span>{t(locale, content.home.process.phase)} {i + 1} of {steps.length}</span>
                  <div className="h-px flex-1 bg-white/10" />
                  <span>{t(locale, content.home.process.footer)}</span>
                </div>
              </div>

              <div className="w-full md:w-[40%] h-[40vh] md:h-auto overflow-hidden order-1 md:order-3 relative">
                <img
                  src={step.bg}
                  className="w-full h-full object-cover grayscale brightness-75 transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                  alt={step.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-l from-transparent via-brand-card/20 to-brand-card hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-1/4 w-96 h-96 bg-premium-orange/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
}