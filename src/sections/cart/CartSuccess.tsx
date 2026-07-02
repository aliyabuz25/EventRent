import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function CartSuccess() {
  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-6">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/10"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>
      <h2 className="text-4xl font-bold tracking-tighter">Təşəkkür edirik!</h2>
      <p className="text-white/50 text-lg font-light">Sifarişiniz qəbul olundu. Tezliklə sizinlə əlaqə saxlayacağıq. Profilinizdən sifarişi izləyə bilərsiniz.</p>
      <Link to="/profile" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all">Profilə keç</Link>
    </div>
  );
}
