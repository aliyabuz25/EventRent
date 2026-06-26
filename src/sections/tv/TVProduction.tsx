import React from 'react';
import { Youtube, Radio, Share2, Monitor, ArrowUpRight, Play } from 'lucide-react';

export default function TVProduction() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[60px] bg-gray-50 p-12 md:p-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Canlı Yayım Texnologiyaları</h2>
              <p className="text-xl text-gray-500 font-light leading-relaxed">
                Biz ən müasir yayım avadanlıqları və proqram təminatları ilə tədbirlərinizin kəsintisiz və yüksək keyfiyyətli yayımını təmin edirik. 
                Çoxkameralı çəkiliş, peşəkar səs və qrafik həllərlə yayımınızı televiziya səviyyəsinə qaldırırıq.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              {[Youtube, Radio, Share2, Monitor].map((Icon, i) => (
                <div key={i} className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-black shadow-sm hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
              ))}
            </div>
            <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              Daha çox məlumat <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl group border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              alt="TV Production"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
