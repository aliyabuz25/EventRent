import React from 'react';
import ServicesHero from '../sections/services/ServicesHero';
import ServicesGrid from '../sections/services/ServicesGrid';

export default function Services() {
  return (
    <div className="space-y-32 pb-20">
      <ServicesHero />
      <ServicesGrid />
    </div>
  );
}
