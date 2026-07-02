import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../../types';

interface ProductInfoProps {
  product: Product;
  onOpenModal: () => void;
}

export default function ProductInfo({ product, onOpenModal }: ProductInfoProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-premium-orange text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-premium-orange/20">
            {product.category}
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white leading-tight">{product.name}</h1>
        <p className="text-xl text-white/50 leading-relaxed font-medium">{product.description}</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Texniki Xüsusiyyətlər</h3>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(product.technicalSpecs).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-premium-orange/5 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-premium-orange" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">{key}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onOpenModal}
          className="w-full sm:w-auto flex items-center justify-center gap-4 bg-black text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-premium-orange transition-all active:scale-95 shadow-2xl shadow-black/10 group"
        >
          <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
          Sorğuya əlavə et
        </button>
      </div>
    </div>
  );
}
