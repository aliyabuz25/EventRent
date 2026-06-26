import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    title: 'Beynəlxalq Enerji Forumu',
    client: 'Energetika Nazirliyi',
    date: 'İyun 2023',
    location: 'Bakı Konqres Mərkəzi',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    category: 'Konfrans',
  },
  {
    title: 'Yeni İl Korporativ Gecəsi',
    client: 'PASHA Bank',
    date: 'Dekabr 2023',
    location: 'Four Seasons Hotel',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    category: 'Korporativ',
  },
  {
    title: 'Məhsul Təqdimatı',
    client: 'Samsung Azerbaijan',
    date: 'Mart 2024',
    location: 'JW Marriott Absheron',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=800&auto=format&fit=crop',
    category: 'Təqdimat',
  },
  {
    title: 'Yay Festivalı',
    client: 'Mədəniyyət Nazirliyi',
    date: 'Avqust 2023',
    location: 'Dənizkənarı Bulvar',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    category: 'Festival',
  },
  {
    title: 'Teambuilding Günü',
    client: 'SOCAR',
    date: 'Sentyabr 2023',
    location: 'Quba Palace',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    category: 'Teambuilding',
  },
  {
    title: 'Musiqi Mükafatları',
    client: 'İTV',
    date: 'Yanvar 2024',
    location: 'Heydər Əliyev Sarayı',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    category: 'Konsert',
  },
];

export default function PortfolioGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
      {PROJECTS.map((project, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group space-y-8"
        >
          <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl group-hover:shadow-black/10 transition-all duration-700 border-8 border-gray-50">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-10 left-10 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/20 uppercase tracking-widest">
              {project.category}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-12">
              <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">{project.title}</h3>
                <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                  {project.client} <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest px-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {project.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {project.location}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
