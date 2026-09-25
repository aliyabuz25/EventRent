import React from 'react';
import HomeHero from '../sections/home/HomeHero';
import HomeVisionMissionCompact from '../sections/home/HomeVisionMissionCompact';
import HomeTeam from '../sections/home/HomeTeam';
import HomeCapabilities from '../sections/home/HomeCapabilities';
import ServicesShowcase from '../sections/services/ServicesShowcase';
import HomeEventTypes from '../sections/home/HomeEventTypes';
import HomeMetrics from '../sections/home/HomeMetrics';
import HomeClients from '../sections/home/HomeClients';
import HomeFeaturedSetups from '../sections/home/HomeFeaturedSetups';
import HomeFinalCTA from '../sections/home/HomeFinalCTA';

export default function Home() {
  return (
    <div className="bg-black">
      <section id="hero-section" aria-label="Hero">
        <HomeHero />
      </section>

      <section id="vision-mission-section" aria-label="Vizyon & Missiya">
        <HomeVisionMissionCompact />
      </section>

      <section id="team-section" aria-label="Komanda">
        <HomeTeam />
      </section>

      <section id="capabilities-section" aria-label="Xidmətlər">
        <HomeCapabilities />
      </section>

      <ServicesShowcase />

      <section id="event-types-section" aria-label="Tədbir Növləri">
        <HomeEventTypes />
      </section>

      <section id="metrics-section" aria-label="Rəqəmlər">
        <HomeMetrics />
      </section>

      <section id="clients-section" aria-label="Müştərilər">
        <HomeClients />
      </section>

      <section id="portfolio-section" aria-label="Portfolio">
        <HomeFeaturedSetups />
      </section>

      <section id="contact-section" aria-label="Əlaqə">
        <HomeFinalCTA />
      </section>
    </div>
  );
}
