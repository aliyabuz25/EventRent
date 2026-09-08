import React from 'react';
import { motion } from 'motion/react';

export default function PortfolioHero() {
  return (
    <section className="relative h-[600px] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden flex items-center justify-center text-center">
      <div className="absolute inset-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30"
          alt="Portfolio Hero"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-[0.3em]"
        >
          Uğurlu Layihələr
        </motion.div>
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9]"
        >
          Bizim <br /> <span className="text-white/70 italic">Portfolio.</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Həyata keçirdiyimiz ən uğurlu və miqyaslı layihələrdən bəziləri.
        </motion.p>
      </div>
    </section>
  );
}
