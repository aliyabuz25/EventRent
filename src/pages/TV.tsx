import React from 'react';
import TVHero from '../sections/tv/TVHero';
import TVChannels from '../sections/tv/TVChannels';
import TVProduction from '../sections/tv/TVProduction';

export default function TV() {
  return (
    <div className="space-y-32 pb-20">
      <TVHero />
      <TVChannels />
      <TVProduction />
    </div>
  );
}
