import React from 'react';
import { motion } from 'motion/react';
import { LogIn, ArrowRight } from 'lucide-react';

export default function CartLoginPrompt() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-[60px] p-12 text-center space-y-8 shadow-2xl shadow-black/20"
      >
        <div className="w-24 h-24 bg-red-50 rounded-[40px] flex items-center justify-center mx-auto text-red-500">
          <LogIn className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tighter">Sifarişi tamamlamaq üçün daxil olun</h2>
          <p className="text-white/50 text-lg font-light max-w-md mx-auto">
            Səbətinizdəki məhsulları görmək və sifarişi tamamlamaq üçün zəhmət olmasa hesabınıza daxil olun.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={async () => {
              localStorage.setItem('demo_mode', 'true');
              localStorage.setItem('demo_user_name', 'Tural Rəhimov');
              window.location.reload();
            }}
            className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3"
          >
            Daxil ol <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
