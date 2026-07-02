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
        <div className="w-24 h-24 bg-premium-orange/10 border border-premium-orange/20 rounded-[40px] flex items-center justify-center mx-auto text-premium-orange shadow-inner">
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
            onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
              }}
              onMouseLeave={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
              }} className="group relative overflow-hidden cursor-pointer w-full sm:w-auto bg-white text-black px-12 py-5 rounded-[24px] font-black text-lg hover:text-white transition-colors duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-premium-orange pointer-events-none z-0 [clip-path:circle(0px_at_var(--x,50%)_var(--y,50%))] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))] transition-[clip-path] duration-500 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              Daxil ol <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
