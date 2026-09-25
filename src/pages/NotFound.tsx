import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../content.context';
import { t } from '../content';

export default function NotFound() {
  const { content, locale } = useSiteContent();
  const c = content.notFound;
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center space-y-8">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-premium-orange">404</p>
        <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none text-white uppercase">
          {t(locale, c.title)}
        </h1>
        <p className="text-white/50 text-lg font-medium max-w-sm mx-auto leading-relaxed">
          {t(locale, c.body)}
        </p>
        <Link to="/" className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 rounded-full text-[11px] font-black uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-all duration-300">
          {t(locale, c.home)}
        </Link>
      </div>
    </div>
  );
}