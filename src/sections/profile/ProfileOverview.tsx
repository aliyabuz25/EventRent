import React from 'react';
import { Package, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Lead } from '../../types';
import { cn } from '../../lib/utils';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants';

interface ProfileOverviewProps {
  orders: Lead[];
  onViewAll: () => void;
}

export default function ProfileOverview({ orders, onViewAll }: ProfileOverviewProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-2xl shadow-black/5">
          <Package className="w-8 h-8 text-red-500 mb-4" />
          <p className="text-3xl font-bold">{orders.length}</p>
          <p className="text-sm text-gray-400 font-medium">Ümumi Sifariş</p>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-2xl shadow-black/5">
          <Clock className="w-8 h-8 text-blue-500 mb-4" />
          <p className="text-3xl font-bold">{orders.filter(o => o.status === 'new').length}</p>
          <p className="text-sm text-gray-400 font-medium">Gözləyən</p>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-2xl shadow-black/5">
          <CheckCircle2 className="w-8 h-8 text-green-500 mb-4" />
          <p className="text-3xl font-bold">{orders.filter(o => o.status === 'won').length}</p>
          <p className="text-sm text-gray-400 font-medium">Tamamlanmış</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-2xl shadow-black/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold tracking-tight">Son Sifarişlər</h3>
          <button onClick={onViewAll} className="text-red-500 font-bold text-sm hover:underline">Hamısına bax</button>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sifariş #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                </div>
              </div>
              <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold border capitalize", STATUS_COLORS[order.status])}>
                {STATUS_LABELS[order.status]}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center py-10 text-gray-400">Hələ heç bir sifarişiniz yoxdur.</p>
          )}
        </div>
      </div>
    </div>
  );
}
