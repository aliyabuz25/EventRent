import React from 'react';
import CateringHero from '../sections/catering/CateringHero';
import CateringContent from '../sections/catering/CateringContent';

export default function Catering() {
  return (
    <div className="pb-20">
      <CateringHero />
      <CateringContent />
    </div>
  );
}
