import React from 'react';
import { Package } from 'lucide-react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

interface CartEmptyProps {
  onNavigate: () => void;
}

export default function CartEmpty({ onNavigate }: CartEmptyProps) {
  const { content, locale } = useSiteContent();
  const c = content.cart;
  return (
    <div className="bg-white/5 rounded-[60px] p-20 text-center space-y-6" role="status" aria-live="polite">
      <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto text-white/50 shadow-sm">
        <Package aria-hidden="true" className="w-10 h-10" />
      </div>
      <p id="empty-cart-message" className="text-xl text-white/70 font-light">{t(locale, c.empty)}</p>
      <button
        type="button"
        onClick={onNavigate}
        aria-describedby="empty-cart-message"
        className="min-h-11 bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        {t(locale, c.browseCatalog)}
      </button>
    </div>
  );
}