import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

interface ProductRelatedProps {
  relatedProducts: Product[];
}

export default function ProductRelated({ relatedProducts }: ProductRelatedProps) {
  const { content, locale } = useSiteContent();
  const c = content.product;
  if (relatedProducts.length === 0) return null;
  return (
    <section className="pt-20 border-t border-white/10 space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            {t(locale, c.relatedTitle1)} <span className="text-premium-orange">{t(locale, c.relatedTitle2)}</span>
          </h2>
          <p className="text-sm text-white/50 font-medium">{t(locale, c.relatedSub)}</p>
        </div>
        <Link to="/catalog" className="px-6 py-3 bg-white/5 text-white/70 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-premium-orange hover:text-white transition-all flex items-center gap-2">
          {t(locale, c.viewAll)} <ChevronRight className="w-4 h-4" />
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