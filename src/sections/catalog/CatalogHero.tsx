import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export default function CatalogHero() {
  return (
    <section className="relative h-[80vh] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-b-[4rem] bg-brand-bg">
      <img 
        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070" 
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
        alt="Catalog Hero"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/60 to-transparent" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-dark rounded-full text-white/80 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-4 h-4 text-premium-orange fill-current" />
              Professional Production Gear
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-ultra-tight uppercase italic">
              THE <span className="text-premium-orange">TECHNICAL</span> <br />
              <span className="text-stroke-solid">INVENTORY</span>
            </h1>
            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed">
              Premium audio-visual equipment from the world's leading manufacturers, maintained to the highest industry standards.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-premium-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-premium-orange/20">
                Explore Catalog
              </button>
              <button className="px-10 py-5 glass-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-premium-orange transition-all active:scale-95">
                Request Info
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
