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
    'w-full min-h-[60px] px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xl text-white transition-all duration-300 placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_30px_rgba(227,6,19,0.15)]';

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
      <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-16 shadow-2xl shadow-black relative overflow-hidden">
        {/* Glow behind the form */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-premium-orange/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">Mesajınız göndərildi!</h3>
              <p className="text-white/50 mt-2">Ən qısa zamanda sizinlə əlaqə saxlanılacaq.</p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 border-2 border-white text-white rounded-full font-bold text-sm hover:bg-white hover:text-premium-orange transition-all"
            >
              Yeni mesaj yaz
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12" aria-label="Əlaqə formu">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label htmlFor="contact-name" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Ad Soyad</label>
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
                <label htmlFor="contact-phone" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Telefon</label>
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
              <label htmlFor="contact-email" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Email</label>
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
              <label htmlFor="contact-message" className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Mesajınız</label>
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
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium backdrop-blur-md">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden cursor-pointer bg-premium-orange text-white px-12 py-5 rounded-full font-black text-lg hover:text-black transition-colors duration-500 flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(227,6,19,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-4">
                {loading ? (
                  <span className="h-6 w-6 border-2 border-white group-hover:border-black border-t-transparent rounded-full animate-spin transition-colors" />
                ) : (
                  <>Göndər <ArrowUpRight aria-hidden="true" className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </span>
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
          <div key={i} className="relative p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] space-y-6 hover:bg-white/10 hover:border-white/20 transition-all duration-700 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-premium-orange shadow-sm group-hover:bg-premium-orange group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <info.icon className="w-7 h-7" />
            </div>
            <div className="relative z-10 space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">{info.title}</h4>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-white">{info.value}</p>
              <p className="text-sm text-white/40 group-hover:text-white/60 font-light transition-colors">{info.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}