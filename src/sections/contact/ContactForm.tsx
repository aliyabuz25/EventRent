import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function ContactForm() {
  const inputClassName =
    'w-full min-h-11 px-0 py-4 bg-transparent border-b border-gray-200 text-xl transition-all placeholder:text-gray-300 focus:outline-none focus:border-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 rounded-sm';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white border border-gray-100 rounded-5xl p-12 md:p-20 shadow-2xl shadow-black/5">
        <form className="space-y-12" aria-label="Əlaqə formu">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label htmlFor="contact-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Ad Soyad</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Məs: Tural Rəhimov"
                className={inputClassName}
              />
            </div>
            <div className="space-y-4">
              <label htmlFor="contact-phone" className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Telefon</label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+994 -- --- -- --"
                className={inputClassName}
              />
            </div>
          </div>
          <div className="space-y-4">
            <label htmlFor="contact-email" className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nümunə@mail.com"
              className={inputClassName}
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="contact-message" className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Mesajınız</label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder="Tədbiriniz haqqında qısa məlumat..."
              className={`${inputClassName} resize-none`}
            />
          </div>
          <button type="submit" className="group min-h-11 bg-black text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
            Göndər <ArrowUpRight aria-hidden="true" className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </form>
      </div>

      <div className="space-y-8">
        {[
          { icon: Phone, title: 'Telefon', value: '+994 50 123 45 67', sub: 'Hər gün 09:00 - 21:00' },
          { icon: Mail, title: 'Email', value: 'sales@eventrent.az', sub: '24 saat ərzində cavab' },
          { icon: MapPin, title: 'Ünvan', value: 'Bakı, Əhməd Rəcəbli küç.', sub: 'Nərimanov rayonu' },
        ].map((info, i) => (
          <div key={i} className="p-10 bg-gray-50 rounded-5xl space-y-6 hover:bg-black hover:text-white transition-all duration-700 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm group-hover:bg-white/10 group-hover:text-white transition-colors">
              <info.icon className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-white/40">{info.title}</h4>
              <p className="text-2xl font-bold tracking-tight">{info.value}</p>
              <p className="text-sm text-gray-500 group-hover:text-gray-400 font-light">{info.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
