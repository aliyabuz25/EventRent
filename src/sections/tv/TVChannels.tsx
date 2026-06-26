import React from 'react';
import { motion } from 'motion/react';
import { Tv } from 'lucide-react';

const CHANNELS = [
  { title: 'Canlı Yayım', desc: 'Tədbirlərinizin internet üzərinden canlı yayımı.' },
  { title: 'Video Arxiv', desc: 'Bütün tədbirlərinizin video yazısı və montajı.' },
  { title: 'Led Ekran Yayımı', desc: 'Məkan daxili led ekranlarda real-vaxt görüntülər.' },
  { title: 'Sosial Media', desc: 'Youtube, Facebook və Instagram üzərindən yayım.' },
];

export default function TVChannels() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {CHANNELS.map((channel, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group p-12 bg-gray-50 rounded-5xl hover:bg-black hover:text-white transition-all duration-700 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-black shadow-sm group-hover:bg-white/10 group-hover:text-white transition-colors">
            <Tv className="w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">{channel.title}</h3>
            <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed font-light">{channel.desc}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
