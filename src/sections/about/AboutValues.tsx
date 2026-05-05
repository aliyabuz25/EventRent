import React from 'react';
import { Star, CheckCircle2, Users } from 'lucide-react';

const VALUES = [
  { icon: Star, title: 'Mükəmməllik', desc: 'Hər bir işdə ən yüksək nəticəyə can atırıq.' },
  { icon: CheckCircle2, title: 'Etibarlılıq', desc: 'Verdiyimiz vədə və keyfiyyətə tam zəmanət veririk.' },
  { icon: Users, title: 'Müştəri Məmnuniyyəti', desc: 'Sizin sevinciniz bizim ən böyük uğurumuzdur.' },
];

export default function AboutValues() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {VALUES.map((value, i) => (
          <div key={i} className="space-y-8 p-12 bg-gray-50 rounded-5xl hover:bg-black hover:text-white transition-all duration-700 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm group-hover:bg-white/10 group-hover:text-white transition-colors">
              <value.icon className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tight">{value.title}</h3>
              <p className="text-gray-500 group-hover:text-gray-400 font-light leading-relaxed">{value.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
