import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

export default function ProfileSupport() {
  const { locale } = useSiteContent();

  const labels = {
    supportCenter:   { az: 'Dəstək Mərkəzi',         en: 'Support Center',          ru: 'Центр поддержки',          tr: 'Destek Merkezi' },
    supportHint:     { az: 'Hər hansı bir sualınız və ya probleminiz varsa, bizimlə əlaqə saxlayın.', en: 'Contact us if you have any questions or issues.', ru: 'Свяжитесь с нами при любых вопросах или проблемах.', tr: 'Sorularınız veya sorunlarınız varsa bizimle iletişime geçin.' },
    faqTitle:        { az: 'Tez-tez verilən suallar',   en: 'Frequently Asked Questions', ru: 'Часто задаваемые вопросы',   tr: 'Sıkça Sorulan Sorular' },
    faqHint:         { az: 'Ən çox soruşulan sualların cavablarını burada tapa bilərsiniz.', en: 'Find answers to the most common questions here.', ru: 'Здесь вы найдёте ответы на самые частые вопросы.', tr: 'En sık sorulan soruların cevaplarını burada bulabilirsiniz.' },
    seeBtn:          { az: 'Baxın',                  en: 'See All',                ru: 'Смотреть',                tr: 'Tümünü gör' },
    liveSupportTitle:{ az: 'Canlı Dəstək',            en: 'Live Support',           ru: 'Онлайн поддержка',         tr: 'Canlı Destek' },
    liveSupportHint: { az: 'Operatorlarımız sizə kömək etməyə hazırdır.', en: 'Our operators are ready to help you.', ru: 'Наши операторы готовы помочь вам.', tr: 'Operatörlerimiz size yardımcı olmaya hazır.' },
    openChat:        { az: 'Çat aç',                  en: 'Open Chat',              ru: 'Открыть чат',              tr: 'Sohbeti aç' },
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-black/20 space-y-8">
      <h2 className="text-3xl font-bold tracking-tighter">{t(locale, labels.supportCenter)}</h2>
      <p className="text-white/50 font-medium">{t(locale, labels.supportHint)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 space-y-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-premium-orange shadow-sm">
            <Bell className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold">{t(locale, labels.faqTitle)}</h4>
          <p className="text-sm text-white/40 leading-relaxed">{t(locale, labels.faqHint)}</p>
          <button type="button" className="text-premium-orange font-bold text-sm hover:underline">{t(locale, labels.seeBtn)}</button>
        </div>
        <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 space-y-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-premium-orange shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold">{t(locale, labels.liveSupportTitle)}</h4>
          <p className="text-sm text-white/40 leading-relaxed">{t(locale, labels.liveSupportHint)}</p>
          <button type="button" className="text-premium-orange font-bold text-sm hover:underline">{t(locale, labels.openChat)}</button>
        </div>
      </div>
    </div>
  );
}
