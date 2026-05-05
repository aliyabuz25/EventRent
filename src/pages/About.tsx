import React from 'react';
import AboutHero from '../sections/about/AboutHero';
import AboutBento from '../sections/about/AboutBento';
import AboutTeam from '../sections/about/AboutTeam';
import AboutValues from '../sections/about/AboutValues';

export default function About() {
  return (
    <div className="space-y-32 pb-20">
      <AboutHero />
      <AboutBento />
      <AboutTeam />
      <AboutValues />
    </div>
  );
}
