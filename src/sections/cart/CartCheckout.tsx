import React from 'react';
import { User as UserIcon, Phone, MapPin, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CartCheckoutProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error: string | null;
  itemsCount: number;
}

export default function CartCheckout({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  error,
  itemsCount
}: CartCheckoutProps) {
  return (
    <aside className="lg:w-[450px]">
      <div className="bg-white/5 border border-white/10 rounded-[60px] p-10 shadow-2xl shadow-black/20 sticky top-32 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Sifarişi Tamamla</h2>
          <p className="text-sm text-white/40 font-medium">Məlumatları daxil edərək sifarişi yekunlaşdırın.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Ad Soyad / Şirkət</label>
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[24px] text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                  placeholder="Tural Rəhimov"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[24px] text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                  placeholder="+994 50 000 00 00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Məkan</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[24px] text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                  placeholder="Tədbir keçiriləcək məkan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Tarix</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[24px] text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold backdrop-blur-md">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || itemsCount === 0}
            onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`); }} className="group relative overflow-hidden cursor-pointer w-full bg-white text-black py-6 rounded-[24px] font-black text-lg hover:text-white transition-colors duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-premium-orange pointer-events-none z-0 [clip-path:circle(0px_at_var(--x,50%)_var(--y,50%))] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))] transition-[clip-path] duration-500 ease-out" />
            <span className="relative z-10 flex items-center gap-3">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black group-hover:border-white border-t-transparent rounded-full animate-spin transition-colors" />
                  Göndərilir...
                </>
              ) : (
                <>
                  Sifarişi Tamamla <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </aside>
  );
}
