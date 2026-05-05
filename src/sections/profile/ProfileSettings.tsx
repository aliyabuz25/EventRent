import React from 'react';
import { Save, Shield } from 'lucide-react';
import { User } from 'firebase/auth';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

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
  const { locale } = useSiteContent();

  const labels = {
    accountSettings: { az: 'Hesab Ayarları',      en: 'Account Settings',     ru: 'Настройки аккаунта',       tr: 'Hesap Ayarları' },
    fullName:        { az: 'Ad Soyad',             en: 'Full Name',             ru: 'Имя Фамилия',               tr: 'Ad Soyad' },
    namePlaceholder: { az: 'Adınızı daxil edin',   en: 'Enter your name',       ru: 'Введите ваше имя',         tr: 'Adınızı girin' },
    email:           { az: 'Email',                en: 'Email',                 ru: 'Эл. почта',                tr: 'E-posta' },
    saving:          { az: 'Yadda saxlanılır...', en: 'Saving...',             ru: 'Сохранение...',            tr: 'Kaydediliyor...' },
    save:            { az: 'Yadda saxla',          en: 'Save',                 ru: 'Сохранить',                tr: 'Kaydet' },
    security:        { az: 'Təhlükəsizlik',        en: 'Security',             ru: 'Безопасность',              tr: 'Güvenlik' },
    changePassword:  { az: 'Şifrəni dəyiş',        en: 'Change Password',     ru: 'Изменить пароль',          tr: 'Şifreyi değiştir' },
    securityHint:    { az: 'Hesabınızın təhlükəsizliyini təmin edin', en: 'Secure your account', ru: 'Обеспечьте безопасность аккаунта', tr: 'Hesabınızın güvenliğini sağlayın' },
    update:          { az: 'Yenilə',                en: 'Update',               ru: 'Обновить',                  tr: 'Güncelle' },
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl shadow-black/5 space-y-10">
      <h2 className="text-3xl font-bold tracking-tighter">{t(locale, labels.accountSettings)}</h2>
      
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t(locale, labels.fullName)}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-premium-orange/5 focus:border-premium-orange transition-all"
              placeholder={t(locale, labels.namePlaceholder)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t(locale, labels.email)}</label>
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
            {isSaving ? t(locale, labels.saving) : t(locale, labels.save)}
          </button>
        </div>
      </form>

      <div className="pt-10 border-t border-gray-50 space-y-6">
        <h3 className="text-xl font-bold">{t(locale, labels.security)}</h3>
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{t(locale, labels.changePassword)}</p>
              <p className="text-xs text-gray-400">{t(locale, labels.securityHint)}</p>
            </div>
          </div>
          <button type="button" className="text-premium-orange font-bold text-sm hover:underline">{t(locale, labels.update)}</button>
        </div>
      </div>
    </div>
  );
}
