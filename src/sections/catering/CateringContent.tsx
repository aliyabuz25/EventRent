import React from 'react';
import { ChefHat, CheckCircle2 } from 'lucide-react';

const MENU_ITEMS = [
  { title: 'Soyuq Qəlyanaltılar', desc: 'Müxtəlif pendir, ət və tərəvəz çeşidləri.' },
  { title: 'İsti Yeməklər', desc: 'Milli və Avropa mətbəxinin ən dadlı nümunələri.' },
  { title: 'Desertlər', desc: 'Şirniyyat və meyvə çeşidləri ilə zəngin süfrə.' },
  { title: 'İçkilər', desc: 'Alkoqollu və alkoqolsuz içki menyusu.' },
];

export default function CateringContent() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
            <ChefHat className="w-4 h-4" /> Peşəkar Mətbəx
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
            Keyfiyyətli Qidalanma, Peşəkar Xidmət
          </h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            "Event Rent" olaraq biz, tədbirlərinizin ləzzətini artırmaq üçün ən yüksək keyfiyyətli ketrinq xidmətini təklif edirik. 
            Peşəkar aşpazlarımız və təcrübəli ofisiant heyətimizlə hər bir qonağınızın məmnuniyyətini təmin edirik.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {MENU_ITEMS.map((item, i) => (
            <div key={i} className="space-y-4 p-8 bg-gray-50 rounded-5xl hover:bg-black hover:text-white transition-all duration-700 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm group-hover:bg-white/10 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-2xl font-bold tracking-tight">{item.title}</h4>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-gray-50">
            <img 
              src="https://images.unsplash.com/photo-1558636508-e0ee97247067?q=80&w=600&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="Catering 1"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-gray-50">
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="Catering 2"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="space-y-6 pt-12">
          <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-gray-50">
            <img 
              src="https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=600&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="Catering 3"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-gray-50">
            <img 
              src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="Catering 4"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
