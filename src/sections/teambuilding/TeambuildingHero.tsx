import React from 'react';
import { motion } from 'motion/react';

export default function TeambuildingHero() {
  return (
    <section className="relative h-[500px] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden flex items-center justify-center text-center">
      <div className="absolute inset-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30"
          alt="Teambuilding Hero"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-[0.3em]"
        >
          Komanda Ruhu
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
          Timbildinq <br /> <span className="text-white/70 italic">Həlləri.</span>
        </h1>
      </div>
    </section>
  );
}
