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
      <div className="bg-white border border-gray-100 rounded-[60px] p-10 shadow-2xl shadow-black/5 sticky top-32 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Sifarişi Tamamla</h2>
          <p className="text-sm text-gray-400 font-medium">Məlumatları daxil edərək sifarişi yekunlaşdırın.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Ad Soyad / Şirkət</label>
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all"
                  placeholder="Tural Rəhimov"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all"
                  placeholder="+994 50 000 00 00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Məkan</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all"
                  placeholder="Tədbir keçiriləcək məkan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Tarix</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || itemsCount === 0}
            className="w-full bg-red-600 text-white py-6 rounded-[24px] font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Göndərilir...
              </>
            ) : (
              <>
                Sifarişi Tamamla <CheckCircle2 className="w-6 h-6" />
              </>
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
