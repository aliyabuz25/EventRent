import React from 'react';
import { Award } from 'lucide-react';

export default function AboutBento() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-gray-50 rounded-5xl p-12 md:p-20 space-y-12">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Event Rent - Sizin Tədbir Tərəfdaşınız</h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            "Event Rent" olaraq biz, tədbirlərin təşkili və texniki təchizatı sahəsində uzun illərdir ki, peşəkar xidmət göstəririk. 
            Missiyamız müştərilərimizə ən müasir texnologiyaları və yaradıcı həlləri təqdim edərək, onların tədbirlərini unudulmaz etməkdir.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-5xl font-bold">500+</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Uğurlu Tədbir</div>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">1000+</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Avadanlıq Çeşidi</div>
          </div>
        </div>
      </div>
      <div className="bg-black rounded-5xl p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="space-y-8 relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">10 İllik Təcrübə</h3>
          <p className="text-gray-400 font-light leading-relaxed">
            Bazarda lider mövqeyimizi qoruyaraq, hər zaman ən yaxşısını təklif edirik.
          </p>
        </div>
        <div className="aspect-square rounded-[40px] overflow-hidden border-4 border-white/10 mt-12 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1505373633569-e083a4634fd0?q=80&w=600&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
            alt="Experience"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}
