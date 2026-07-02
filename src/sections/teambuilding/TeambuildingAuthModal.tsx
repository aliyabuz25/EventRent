import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Send, Lock } from 'lucide-react';

interface TeambuildingAuthModalProps {
  step: 'register' | 'otp' | 'list' | 'details' | 'concept-select';
  setStep: (step: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  phone: string;
  setPhone: (phone: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  handleRegister: (e: React.FormEvent) => void;
  handleVerifyOtp: (e: React.FormEvent) => void;
}

export default function TeambuildingAuthModal({
  step,
  setStep,
  formData,
  setFormData,
  phone,
  setPhone,
  otp,
  setOtp,
  handleRegister,
  handleVerifyOtp
}: TeambuildingAuthModalProps) {
  return (
    <AnimatePresence>
      {(step === 'register' || step === 'otp') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setStep('list')}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-brand-card rounded-[2.5rem] shadow-2xl relative overflow-hidden border-2 w-full max-w-[400px] p-10 border-premium-orange/20"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-premium-orange transition-all z-10"
              onClick={() => setStep('list')}
            >
              <X className="w-5 h-5" />
            </button>

            {step === 'register' && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-premium-orange/10 rounded-2xl flex items-center justify-center text-premium-orange mx-auto mb-4 border border-premium-orange/20">
                    <Users className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight uppercase text-white">Məlumatlar</h2>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Zəhmət olmasa anket məlumatlarını doldurun
                  </p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <input
                    required
                    type="text"
                    placeholder="Ad Soyad"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Telefon"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Şirkət"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                  />
                  <button type="submit" className="group relative overflow-hidden w-full bg-white text-black py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors duration-500 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] mt-6">
                    <div className="absolute inset-0 bg-premium-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center gap-3">
                      Kod göndər <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </button>
                </form>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-premium-orange/10 rounded-2xl flex items-center justify-center text-premium-orange mx-auto mb-4 border border-premium-orange/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight uppercase text-white">OTP Təsdiq</h2>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest text-white/40">Telefon nömrənizə SMS kodu göndəriləcək</p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <input
                    required
                    maxLength={6}
                    type="text"
                    className="w-full px-6 py-6 bg-white/5 rounded-2xl border-2 border-transparent focus:border-premium-orange focus:bg-white/10 transition-all text-center text-4xl font-black tracking-[0.5em] text-premium-orange"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                  />
                  <button type="submit" className="group relative overflow-hidden w-full bg-white text-black py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] mt-6">
                    <div className="absolute inset-0 bg-premium-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10">Təsdiqlə</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
