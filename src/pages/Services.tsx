import React from 'react';
import { motion } from 'motion/react';
import ServicesGrid from '../sections/services/ServicesGrid';
import ServicesCatalogGateway from '../sections/services/ServicesCatalogGateway';
import ServicesProcess from '../sections/services/ServicesProcess';
import HomeEventTypes from '../sections/home/HomeEventTypes';

export default function Services() {
  return (
    <div className="bg-black">
      <div className="pt-24 pb-20">
        <ServicesGrid />
      </div>

      <HomeEventTypes />
      <ServicesProcess />
      <div className="mt-0">
        <ServicesCatalogGateway />
      </div>
    </div>
  );
}
