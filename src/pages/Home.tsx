import React from 'react';
import { motion } from 'motion/react';
import Hero from '../sections/Hero';
import Capabilities from '../sections/Capabilities';
import EventTypes from '../sections/EventTypes';
import FeaturedSetups from '../sections/FeaturedSetups';
import Process from '../sections/Process';
import CatalogGateway from '../sections/CatalogGateway';
import HomeMetrics from '../sections/home/HomeMetrics';
import HomeFinalCTA from '../sections/home/HomeFinalCTA';

export default function Home() {
  return (
    <div className="bg-black">
      {/* 1. Hero Section: Açılış */}
      <div id="hero-section">
        <Hero />
      </div>

      {/* 2. Capabilities: Uzmanlık Alanları */}
      <div id="capabilities-section">
        <Capabilities />
      </div>

      {/* 3. Event Types: Etkinlik Kategorileri (Flip-Up Animation) */}
      <motion.div 
        id="event-types-section"
        initial={{ rotateX: 45, opacity: 0, y: 100 }}
        whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "circOut" }}
        style={{ perspective: "1000px" }}
      >
        <EventTypes />
      </motion.div>

      {/* 4. Portfolio: Portfolyo Galerisi */}
      <div id="portfolio-section">
        <FeaturedSetups />
      </div>

      {/* 5. Process: Hizmetler / Yapıtaşları */}
      <div id="services-section">
        <Process />
      </div>

      {/* 6. Metrics: Başarı İstatistikleri */}
      <div id="metrics-section">
        <HomeMetrics />
      </div>

      {/* 7. Catalog: Ürün Kataloğu */}
      <div id="catalog-section">
        <CatalogGateway />
      </div>

      {/* 8. Contact: İletişim */}
      <div id="contact-section">
        <HomeFinalCTA />
      </div>
    </div>
  );
}
