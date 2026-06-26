import React from 'react';
import PortfolioGrid from '../sections/portfolio/PortfolioGrid';

export default function Portfolio() {
  return (
    <div className="pb-20">
      <PortfolioGrid />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-5 h-px bg-premium-orange" />
          <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/30">Qalereya</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
          Tədbirlər<br />
          <span className="text-white/20 italic">Salnaməsi.</span>
        </h1>
      </div>
    </div>
  );
}