import React from 'react';
import { motion } from 'motion/react';
import Hero from '../sections/Hero';
import HomeVisionMission from '../sections/home/HomeVisionMission';
import HomeApproach from '../sections/home/HomeApproach';
import HomeClients from '../sections/home/HomeClients';
import HomeContact from '../sections/home/HomeContact';
import Capabilities from '../sections/Capabilities';
import HomeServices3D from '../sections/home/HomeServices3D';
import EventTypes from '../sections/EventTypes';
import FeaturedSetups from '../sections/FeaturedSetups';
import Process from '../sections/Process';
import CatalogGateway from '../sections/CatalogGateway';
import HomeMetrics from '../sections/home/HomeMetrics';
import HomeFinalCTA from '../sections/home/HomeFinalCTA';

export default function Home() {
  return (
    <div className="bg-black">
      <div id="hero-section">
        <Hero />
      </div>

      <div id="vision-mission-section">
        <HomeVisionMission />
      </div>

      <div id="approach-section">
        <HomeApproach />
      </div>

      <div id="clients-section">
        <HomeClients />
      </div>

      <div id="contact-cta-section">
        <HomeContact />
      </div>

      <div id="capabilities-section">
        <Capabilities />
      </div>

      <div id="services-3d-section">
        <HomeServices3D />
      </div>

      <motion.div
        id="event-types-section"
        initial={{ rotateX: 45, opacity: 0, y: 100 }}
        whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 1.2, ease: 'circOut' }}
        style={{ perspective: '1000px' }}
      >
        <EventTypes />
      </motion.div>

      <div id="portfolio-section">
        <FeaturedSetups />
      </div>

      <div id="services-section">
        <Process />
      </div>

      <div id="metrics-section">
        <HomeMetrics />
      </div>

      <div id="catalog-section">
        <CatalogGateway />
      </div>

      <div id="contact-section">
        <HomeFinalCTA />
      </div>
    </div>
  );
}