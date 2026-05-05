import React from 'react';
import { Clock, Package, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Lead } from '../../types';
import { cn } from '../../lib/utils';
import { MOCK_PRODUCTS } from '../../mockData';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants';

interface ProfileOrdersProps {
  orders: Lead[];
}

export default function ProfileOrders({ orders }: ProfileOrdersProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tighter">Sifarişlərim</h2>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl shadow-black/5 group">
            <div className="p-8 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {order.id.slice(0, 8)}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm')}
                  </div>
                </div>
                <div className={cn("px-6 py-2 rounded-2xl text-xs font-bold border", STATUS_COLORS[order.status])}>
                  {STATUS_LABELS[order.status]}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((item, idx) => {
                  const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product?.images?.[0] ? (
                          <img src={product.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-200" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{product?.name || 'Məhsul'}</p>
                        <p className="text-[10px] text-gray-400">{item.quantity} ədəd</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Məkan</p>
                    <p className="text-sm text-gray-900 font-bold">{order.location || 'Qeyd edilməyib'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tarix</p>
                    <p className="text-sm text-gray-900 font-bold">
                      {order.eventDate ? format(new Date(order.eventDate), 'dd MMMM yyyy') : 'Qeyd edilməyib'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center space-y-6 shadow-2xl shadow-black/5">
            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto text-gray-300">
              <Package className="w-10 h-10" />
            </div>
            <p className="text-xl text-gray-400 font-light">Hələ heç bir sifarişiniz yoxdur.</p>
          </div>
        )}
      </div>
    </div>
  );
}
