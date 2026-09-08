import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';

interface ProductRelatedProps {
  relatedProducts: Product[];
}

export default function ProductRelated({ relatedProducts }: ProductRelatedProps) {
  if (relatedProducts.length === 0) return null;

  return (
    <section className="pt-20 border-t border-white/10 space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">Birlikdə <span className="text-premium-orange">İstifadə Olunur</span></h2>
          <p className="text-sm text-white/50 font-medium">Bu məhsulla tamamlanan digər avadanlıqlar.</p>
        </div>
        <Link to="/" className="px-6 py-3 bg-white/5 text-white/70 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-premium-orange hover:text-white transition-all flex items-center gap-2">
          Hamısına bax <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
