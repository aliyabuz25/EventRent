import React from 'react';
import EventgardenHero from '../sections/eventgarden/EventgardenHero';
import EventgardenContent from '../sections/eventgarden/EventgardenContent';
import EventgardenGallery from '../sections/eventgarden/EventgardenGallery';

export default function Eventgarden() {
  return (
    <div className="pb-20 space-y-20">
      <EventgardenHero />
      <EventgardenContent />
      <EventgardenGallery />
    </div>
  );
}
