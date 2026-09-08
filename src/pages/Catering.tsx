import React from 'react';
import CateringContent from '../sections/catering/CateringContent';

export default function Catering() {
  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-5 h-px bg-premium-orange" />
          <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">Catering</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
          Peşəkar<br />
          <span className="text-white/50 italic">Ketrinq.</span>
        </h1>
      </div>
      <CateringContent />
    </div>
  );
}
