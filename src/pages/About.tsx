import React from 'react';
import AboutHero from '../sections/about/AboutHero';
import AboutBento from '../sections/about/AboutBento';
import AboutTeam from '../sections/about/AboutTeam';
import AboutValues from '../sections/about/AboutValues';
import AboutVisionMission from '../sections/about/AboutVisionMission';
import AboutPartnerIntro from '../sections/about/AboutPartnerIntro';
import HomeTeam from '../sections/home/HomeTeam';

export default function About() {
  return (
    <div className="pb-20">
      <AboutHero />
      <AboutPartnerIntro />
      <AboutVisionMission />
      <AboutBento />
      <HomeTeam />
      <AboutValues />
    </div>
  );
}
