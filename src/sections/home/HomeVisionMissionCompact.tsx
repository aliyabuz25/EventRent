import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function HomeVisionMissionCompact() {
  const { content, locale } = useSiteContent();
  const s = content.home.visionMissionCompact;

  return (
    <section className="relative bg-[#080808] border-y border-white/[0.06] overflow-hidden py-12 md:py-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[50%] opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(227,6,19,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-6 bg-premium-orange" />
              <span className="text-[11px] md:text-xs font-black tracking-[0.3em] uppercase text-white/50">{t(locale, s.visionLabel)}</span>
            </div>
            <p className="font-inter text-white/75 text-lg md:text-xl lg:text-[22px] xl:text-[26px] font-light leading-relaxed lg:leading-[1.6] flex-1 text-balance pr-4 xl:pr-12">
              {t(locale, s.visionBody)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-6 bg-premium-orange" />
              <span className="text-[11px] md:text-xs font-black tracking-[0.3em] uppercase text-white/50">{t(locale, s.missionLabel)}</span>
            </div>
            <p className="font-inter text-white/75 text-lg md:text-xl lg:text-[22px] xl:text-[26px] font-light leading-relaxed lg:leading-[1.6] flex-1 text-balance pr-4 xl:pr-12">
              {t(locale, s.missionBody)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}