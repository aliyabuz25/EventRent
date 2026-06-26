import React from 'react';
import AboutBento from '../sections/about/AboutBento';
import AboutTeam from '../sections/about/AboutTeam';
import AboutValues from '../sections/about/AboutValues';
import AboutVisionMission from '../sections/about/AboutVisionMission';
import AboutApproach from '../sections/about/AboutApproach';
import AboutPartnerIntro from '../sections/about/AboutPartnerIntro';

export default function About() {
  return (
    <div className="pb-20">
      <AboutPartnerIntro />
      <AboutApproach />
      <AboutVisionMission />
      <AboutBento />
      <AboutTeam />
      <AboutValues />
    </div>
  );
}
