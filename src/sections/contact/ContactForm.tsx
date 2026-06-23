import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClassName =
    'w-full min-h-11 px-0 py-4 bg-transparent border-b text-xl transition-all placeholder:text-gray-300 focus:outline-none focus:border-black focus-visible:ring-2 focus:ring-black/10 focus-visible:ring-offset-2 rounded-sm';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setError('Bütün sahələri doldurun');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, 'contact-submissions'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setError(`Xəta baş verdi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white border border-gray-100 rounded-5xl p-12 md:p-20 shadow-2xl shadow-black/5">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">Mesajınız göndərildi!</h3>
              <p className="text-gray-500 mt-2">Ən qısa zamanda sizinlə əlaqə saxlanılacaq.</p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 border-2 border-black rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all"
            >
              Yeni mesaj yaz
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12" aria-label="Əlaqə formu">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label htmlFor="contact-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Ad Soyad</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
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
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tədbiriniz haqqında qısa məlumat..."
                className={`${inputClassName} resize-none`}
              />
            </div>
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="group min-h-11 bg-black text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Göndər <ArrowUpRight aria-hidden="true" className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>
          </form>
        )}
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