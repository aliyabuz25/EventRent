import React from 'react';
import { Save, Shield } from 'lucide-react';
import { User } from 'firebase/auth';

interface ProfileSettingsProps {
  user: User | null;
  displayName: string;
  setDisplayName: (name: string) => void;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileSettings({
  user,
  displayName,
  setDisplayName,
  isSaving,
  onSubmit
}: ProfileSettingsProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl shadow-black/5 space-y-10">
      <h2 className="text-3xl font-bold tracking-tighter">Hesab Ayarları</h2>
      
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ad Soyad</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-premium-orange/5 focus:border-premium-orange transition-all"
              placeholder="Adınızı daxil edin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled
              className="w-full px-6 py-4 bg-gray-100 border border-transparent rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-premium-orange transition-all shadow-xl shadow-black/10 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </div>
      </form>

      <div className="pt-10 border-t border-gray-50 space-y-6">
        <h3 className="text-xl font-bold">Təhlükəsizlik</h3>
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Şifrəni dəyiş</p>
              <p className="text-xs text-gray-400">Hesabınızın təhlükəsizliyini təmin edin</p>
            </div>
          </div>
          <button className="text-premium-orange font-bold text-sm hover:underline">Yenilə</button>
        </div>
      </div>
    </div>
  );
}
