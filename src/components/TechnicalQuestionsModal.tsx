import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

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
  const [quantity, setQuantity] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({
    size: '',
    material: '',
    lamination: '',
    installation: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    onConfirm({
      ...answers,
      quantity: quantity.toString()
    });
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
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Sifariş detalları</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">SAY</label>
                <div className="flex items-center justify-between w-32 bg-white/5 rounded-2xl p-2 border border-white/10">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-black text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Size */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">ÖLÇÜ (M²)</label>
                <input
                  type="text"
                  value={answers.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="Ölçü (m²) daxil edin..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                />
              </div>

              {/* Material */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">MATERIAL NÖVÜ</label>
                <input
                  type="text"
                  value={answers.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="Material növü daxil edin..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                />
              </div>

              {/* Lamination */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">LAMINASIYA</label>
                <input
                  type="text"
                  value={answers.lamination}
                  onChange={(e) => handleInputChange('lamination', e.target.value)}
                  placeholder="Laminasiya daxil edin..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                />
              </div>

              {/* Installation */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">MONTAJ XİDMƏTİ</label>
                <input
                  type="text"
                  value={answers.installation}
                  onChange={(e) => handleInputChange('installation', e.target.value)}
                  placeholder="Montaj xidməti daxil edin..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                />
              </div>

              <button
                onClick={handleConfirm}
                className="group relative overflow-hidden cursor-pointer w-full bg-premium-orange text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:text-black transition-colors duration-500 shadow-[0_0_40px_rgba(227,6,19,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] mt-8"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Səbətə əlavə et <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
