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
  saveMsg?: 'ok' | 'err' | null;
}

export default function ProfileSettings({
  user,
  displayName,
  setDisplayName,
  isSaving,
  onSubmit,
  saveMsg = null,
}: ProfileSettingsProps) {
  const { locale } = useSiteContent();

  const labels = {
    accountSettings: { az: 'Hesab Ayarlari', en: 'Account Settings', ru: 'Nastroyki akkaunta', tr: 'Hesap Ayarlari' },
    fullName:        { az: 'Ad Soyad', en: 'Full Name', ru: 'Imya Familiya', tr: 'Ad Soyad' },
    namePlaceholder: { az: 'Adinizi daxil edin', en: 'Enter your name', ru: 'Vvedite vashe imya', tr: 'Adinizi girin' },
    email:           { az: 'Email', en: 'Email', ru: 'El. pochta', tr: 'E-posta' },
    saving:          { az: 'Yadda saxlanilir...', en: 'Saving...', ru: 'Sokhranenie...', tr: 'Kaydediliyor...' },
    savedOk:         { az: 'Yadda saxlandi ✓', en: 'Saved ✓', ru: 'Sokhraneno ✓', tr: 'Kaydedildi ✓' },
    savedErr:        { az: 'Xeta bas verdi', en: 'Error saving', ru: 'Oshibka sokhraneniya', tr: 'Kaydetme hatasi' },
    save:            { az: 'Yadda saxla', en: 'Save', ru: 'Sokhranit', tr: 'Kaydet' },
    security:        { az: 'Tehlukesizlik', en: 'Security', ru: 'Bezopasnost', tr: 'Guvenlik' },
    changePassword:  { az: 'Sifreni deyis', en: 'Change Password', ru: 'Izmenit parol', tr: 'Sifreyi degistir' },
    securityHint:    { az: 'Hesabinizin tehlukesizliyini temin edin', en: 'Secure your account', ru: 'Obespechte bezopasnost akkaunta', tr: 'Hesabinizin guvenliyini saglayin' },
    update:          { az: 'Yenile', en: 'Update', ru: 'Obnovit', tr: 'Guncelle' },
  };

  const saveMsgLabel = saveMsg === 'ok'
    ? t(locale, labels.savedOk)
    : saveMsg === 'err'
    ? t(locale, labels.savedErr)
    : null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-black/20 space-y-10">
      <h2 className="text-3xl font-bold tracking-tighter">{t(locale, labels.accountSettings)}</h2>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">{t(locale, labels.fullName)}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-premium-orange/5 focus:border-premium-orange transition-all"
              placeholder={t(locale, labels.namePlaceholder)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">{t(locale, labels.email)}</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              placeholder={t(locale, labels.email)}
              className="w-full px-6 py-4 bg-gray-100 border border-transparent rounded-2xl text-sm font-bold text-white/40 cursor-not-allowed"
            />
          </div>
        </div>

        {saveMsgLabel && (
          <p className={`text-sm font-bold ${saveMsg === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
            {saveMsgLabel}
          </p>
        )}

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
        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/40 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white">{t(locale, labels.changePassword)}</p>
              <p className="text-xs text-white/40">{t(locale, labels.securityHint)}</p>
            </div>
          </div>
          <button type="button" className="text-premium-orange font-bold text-sm hover:underline">{t(locale, labels.update)}</button>
        </div>
      </div>
    </div>
  );
}