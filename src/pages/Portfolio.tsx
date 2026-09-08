import React from 'react';
import PortfolioHero from '../sections/portfolio/PortfolioHero';
import PortfolioGrid from '../sections/portfolio/PortfolioGrid';

export default function Portfolio() {
  return (
    <div className="pb-20">
      <PortfolioHero />
      <PortfolioGrid />
    </div>
  );
}
