import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function FinalCTA() {
  const { content, locale } = useSiteContent();

  return (
    <section className="bg-brand-bg py-40 md:py-48 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-premium-orange/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10 md:space-y-12"
        >
          <h2 className="text-6xl md:text-9xl font-black tracking-ultra-tight uppercase leading-[0.88]">
            {t(locale, content.home.finalCta.title)} <br /> <span className="text-premium-orange">{t(locale, content.home.finalCta.titleAccent)}</span>
          </h2>

          <p className="text-lg md:text-2xl text-gray-300/90 font-medium max-w-2xl mx-auto leading-[1.75]">
            {t(locale, content.home.finalCta.description)}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 pt-6 md:pt-8">
            <button className="w-full md:w-auto min-h-14 px-8 md:px-12 py-4 md:py-6 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.24em] hover:bg-premium-orange hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
              {t(locale, content.home.finalCta.primaryCta)} <ArrowRight className="w-5 h-5" />
            </button>

            <button className="w-full md:w-auto min-h-14 px-8 md:px-12 py-4 md:py-6 glass text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.24em] hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-4">
              {t(locale, content.home.finalCta.secondaryCta)}
            </button>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
