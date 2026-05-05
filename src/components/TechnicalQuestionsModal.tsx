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
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Sifariş detalları</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SAY</label>
                <div className="flex items-center justify-between w-32 bg-gray-50 rounded-2xl p-2 border border-gray-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-black text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Size */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ÖLÇÜ (M²)</label>
                <input
                  type="text"
                  value={answers.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="Ölçü (m²) daxil edin..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-premium-red/10 focus:border-premium-red transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Material */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MATERIAL NÖVÜ</label>
                <input
                  type="text"
                  value={answers.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="Material növü daxil edin..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-premium-red/10 focus:border-premium-red transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Lamination */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LAMINASIYA</label>
                <input
                  type="text"
                  value={answers.lamination}
                  onChange={(e) => handleInputChange('lamination', e.target.value)}
                  placeholder="Laminasiya daxil edin..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-premium-red/10 focus:border-premium-red transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Installation */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MONTAJ XİDMƏTİ</label>
                <input
                  type="text"
                  value={answers.installation}
                  onChange={(e) => handleInputChange('installation', e.target.value)}
                  placeholder="Montaj xidməti daxil edin..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-premium-red/10 focus:border-premium-red transition-all placeholder:text-gray-300"
                />
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-3 mt-4"
              >
                Səbətə əlavə et <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
