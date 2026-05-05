import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';

export default function ProfileSupport() {
  return (
    <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl shadow-black/5 space-y-8">
      <h2 className="text-3xl font-bold tracking-tighter">Dəstək Mərkəzi</h2>
      <p className="text-gray-500 font-medium">Hər hansı bir sualınız və ya probleminiz varsa, bizimlə əlaqə saxlayın.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-premium-orange shadow-sm">
            <Bell className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold">Tez-tez verilən suallar</h4>
          <p className="text-sm text-gray-400 leading-relaxed">Ən çox soruşulan sualların cavablarını burada tapa bilərsiniz.</p>
          <button className="text-premium-orange font-bold text-sm hover:underline">Baxın</button>
        </div>
        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-premium-orange shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold">Canlı Dəstək</h4>
          <p className="text-sm text-gray-400 leading-relaxed">Operatorlarımız sizə kömək etməyə hazırdır.</p>
          <button className="text-premium-orange font-bold text-sm hover:underline">Çat aç</button>
        </div>
      </div>
    </div>
  );
}
