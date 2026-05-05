import React from 'react';
import { motion } from 'motion/react';

const TEAM = [
  {
    name: 'Tural Rəhimov',
    role: 'Təsisçi & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Leyla Əliyeva',
    role: 'Tədbir Meneceri',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Rəşad Məmmədov',
    role: 'Texniki Direktor',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Günel Həsənova',
    role: 'Satış Meneceri',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  },
];

export default function AboutTeam() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Bizim Komanda</h2>
          <p className="text-xl text-gray-500 font-light">Tədbirlərinizin uğurunun arxasında duran peşəkar heyət.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {TEAM.map((member, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group space-y-6"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl relative border-8 border-gray-50">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-white font-bold text-lg">{member.name}</div>
                <div className="text-white/60 text-xs font-medium uppercase tracking-widest">{member.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
