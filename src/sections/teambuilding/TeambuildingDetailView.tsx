import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TeambuildingDetailViewProps {
  selectedGame: any;
  selectedConcept: any;
  setSelectedConcept: (concept: any) => void;
  orderExtraData: any;
  setOrderExtraData: (data: any) => void;
  handleOrder: () => void;
  setStep: (step: any) => void;
  concepts: any[];
}

export default function TeambuildingDetailView({
  selectedGame,
  selectedConcept,
  setSelectedConcept,
  orderExtraData,
  setOrderExtraData,
  handleOrder,
  setStep,
  concepts
}: TeambuildingDetailViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12"
    >
      <button 
        onClick={() => setStep('list')}
        className="flex items-center gap-2 text-gray-400 hover:text-premium-orange font-bold uppercase text-[10px] tracking-widest mb-12 transition-colors group"
      >
        <X className="w-4 h-4 transition-transform group-hover:rotate-90" /> Oyunlara qayıt
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
            <img src={selectedGame.image} className="w-full h-full object-cover" alt={selectedGame.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                {selectedGame.category}
              </div>
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">{selectedGame.name}</h1>
            </div>
          </div>
        </div>

        <div className="space-y-16 py-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-premium-orange rounded-full" />
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Oyun Haqqında</h2>
            </div>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              {selectedGame.details}
            </p>
          </div>

          <div className="space-y-12 pt-12 border-t border-white/5">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-premium-orange rounded-full" />
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Konsepsiya Seçin</h2>
                </div>
                {selectedConcept && (
                  <span className="text-[10px] font-black text-premium-orange uppercase tracking-widest bg-premium-orange/5 px-4 py-2 rounded-full border border-premium-orange/10">
                    {selectedConcept.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-4">
                {concepts.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept)}
                    className={cn(
                      "relative aspect-square rounded-3xl overflow-hidden border-2 transition-all group",
                      selectedConcept?.id === concept.id ? "border-premium-orange scale-95 shadow-2xl shadow-premium-orange/20" : "border-transparent opacity-40 hover:opacity-100"
                    )}
                  >
                    <img src={concept.image} className="w-full h-full object-cover" alt={concept.name} />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] text-white font-black uppercase text-center px-1 leading-tight">{concept.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-premium-orange rounded-full" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Tədbir Detalları</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Məkan</label>
                  <input 
                    type="text"
                    placeholder="Məs: Şamaxı, Meşə ərazisi"
                    className="w-full px-8 py-5 bg-white/5 rounded-[2rem] border-2 border-transparent focus:border-premium-orange focus:bg-white/10 transition-all text-sm font-bold text-white"
                    value={orderExtraData.location}
                    onChange={e => setOrderExtraData({...orderExtraData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">İştirakçı sayı</label>
                  <input 
                    type="text"
                    placeholder="Məs: 50 nəfər"
                    className="w-full px-8 py-5 bg-white/5 rounded-[2rem] border-2 border-transparent focus:border-premium-orange focus:bg-white/10 transition-all text-sm font-bold text-white"
                    value={orderExtraData.participants}
                    onChange={e => setOrderExtraData({...orderExtraData, participants: e.target.value})}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Tarix</label>
                  <input 
                    type="date"
                    className="w-full px-8 py-5 bg-white/5 rounded-[2rem] border-2 border-transparent focus:border-premium-orange focus:bg-white/10 transition-all text-sm font-bold text-white"
                    value={orderExtraData.date}
                    onChange={e => setOrderExtraData({...orderExtraData, date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-12">
              <button 
                disabled={!selectedConcept || !orderExtraData.location || !orderExtraData.participants || !orderExtraData.date}
                onClick={handleOrder}
                className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-premium-orange hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_32px_64px_-16px_rgba(227,6,19,0.3)] flex items-center justify-center gap-6 group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Sifarişi Tamamla
              </button>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-8">
                Sifarişiniz səbətə əlavə olunacaq
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
