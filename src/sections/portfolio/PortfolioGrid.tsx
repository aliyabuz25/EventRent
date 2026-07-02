import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

type Project = {
  title: string;
  client: string;
  date: string;
  location: string;
  category: string;
  videoId?: string;
  image?: string;
};

const PROJECTS: Project[] = [
  {
    title: 'Beynəlxalq Enerji Forumu',
    client: 'Energetika Nazirliyi',
    date: 'İyun 2023',
    location: 'Bakı Konqres Mərkəzi',
    videoId: '8WZuhCIjUO4',
    category: 'Konfrans',
  },
  {
    title: 'Yeni İl Korporativ Gecəsi',
    client: 'PASHA Bank',
    date: 'Dekabr 2023',
    location: 'Four Seasons Hotel',
    videoId: '8LD3hIJrUSk',
    category: 'Korporativ',
  },
  {
    title: 'Məhsul Təqdimatı',
    client: 'Samsung Azerbaijan',
    date: 'Mart 2024',
    location: 'JW Marriott Absheron',
    videoId: '8MROU3iLkVM',
    category: 'Təqdimat',
  },
  {
    title: 'Yay Festivalı',
    client: 'Mədəniyyət Nazirliyi',
    date: 'Avqust 2023',
    location: 'Dənizkənarı Bulvar',
    videoId: 'vZP0vyFGQGg',
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
          <div className="w-[85%] mx-auto">
          <div className="relative aspect-[9/16] rounded-[40px] overflow-hidden shadow-2xl group-hover:shadow-black/10 transition-all duration-700 border-8 border-gray-50">
            {project.videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${project.videoId}?rel=0&playsinline=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={project.title}
              />
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute top-10 left-10 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/20 uppercase tracking-widest">
              {project.category}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8 pointer-events-none">
              <div className="space-y-2 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-black text-white tracking-tight leading-tight drop-shadow-lg">{project.title}</h3>
                <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                  {project.client} <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-white/40 font-bold uppercase tracking-widest px-4">
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