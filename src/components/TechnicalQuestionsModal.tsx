import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useSiteContent } from '../content.context';
import { t } from '../content';

interface TechnicalQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (answers: Record<string, string>) => void;
  productName: string;
  category: string;
}

export default function TechnicalQuestionsModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  category
}: TechnicalQuestionsModalProps) {
  const { content, locale } = useSiteContent();
  const c = content.product;
  const [quantity, setQuantity] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({
    size: '', material: '', lamination: '', installation: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    onConfirm({ ...answers, quantity: quantity.toString() });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-brand-card/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black overflow-hidden"
          >
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">{t(locale, c.modalTitle)}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-white/70 hover:text-white" />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest">{t(locale, c.qty)}</label>
                <div className="flex items-center justify-between w-32 bg-white/5 rounded-2xl p-2 border border-white/10">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white/70 hover:text-white">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-black text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white/70 hover:text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest">{t(locale, c.size)}</label>
                <input type="text" value={answers.size} onChange={e => handleInputChange('size', e.target.value)} placeholder={t(locale, c.sizePlaceholder)} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/50" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest">{t(locale, c.material)}</label>
                <input type="text" value={answers.material} onChange={e => handleInputChange('material', e.target.value)} placeholder={t(locale, c.materialPlaceholder)} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/50" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest">{t(locale, c.lamination)}</label>
                <input type="text" value={answers.lamination} onChange={e => handleInputChange('lamination', e.target.value)} placeholder={t(locale, c.laminationPlaceholder)} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/50" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/70 uppercase tracking-widest">{t(locale, c.installation)}</label>
                <input type="text" value={answers.installation} onChange={e => handleInputChange('installation', e.target.value)} placeholder={t(locale, c.installationPlaceholder)} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/50" />
              </div>

              <button
                onClick={handleConfirm}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
                }}
                onMouseLeave={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
                }}
                className="group relative overflow-hidden cursor-pointer w-full bg-white text-black py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:text-white transition-colors duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] mt-8"
              >
                <div className="absolute inset-0 bg-premium-orange pointer-events-none z-0 [clip-path:circle(0px_at_var(--x,50%)_var(--y,50%))] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))] transition-[clip-path] duration-500 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t(locale, c.addToCartBtn)} <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}