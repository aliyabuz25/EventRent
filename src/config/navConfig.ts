import { Locale } from '../types';

export type NavLink = {
  path: string;
  name: { az: string; en: string; ru: string; tr: string };
  hiddenByDefault?: boolean;
};

export const navLinks: NavLink[] = [
  { path: '/', name: { az: 'Ana səhifə', en: 'Home', ru: 'Главная', tr: 'Ana Sayfa' } },
  { path: '/services', name: { az: 'Xidmətlər', en: 'Services', ru: 'Услуги', tr: 'Hizmetler' } },
  { path: '/catalog', name: { az: 'Kataloq', en: 'Catalog', ru: 'Каталог', tr: 'Katalog' } },
  { path: '/teambuilding', name: { az: 'Teambuilding', en: 'Teambuilding', ru: 'Тибилдинг', tr: 'Takım Oluşturma' } },
  { path: '/catering', name: { az: 'Katering', en: 'Catering', ru: 'Кейтеринг', tr: 'Catering' } },
  { path: '/tv', name: { az: 'TV&LED', en: 'TV&LED', ru: 'ТВ&LED', tr: 'TV&LED' }, hiddenByDefault: true },
  { path: '/portfolio', name: { az: 'Portfolio', en: 'Portfolio', ru: 'Портфолио', tr: 'Portföy' } },
  { path: '/about', name: { az: 'Haqqımızda', en: 'About', ru: 'О нас', tr: 'Hakkımızda' } },
  { path: '/contact', name: { az: 'Əlaqə', en: 'Contact', ru: 'Kontakt', tr: 'İletişim' } },
];

export const langLabels: Record<Locale, string> = {
  az: 'Azərbaycan',
  en: 'English',
  ru: 'Русский',
  tr: 'Türkçe',
};
