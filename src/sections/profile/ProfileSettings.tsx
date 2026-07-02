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
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-premium-orange focus:shadow-[0_0_20px_rgba(227,6,19,0.1)] transition-all duration-300 placeholder:text-white/20"
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
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/30 cursor-not-allowed opacity-50"
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
            className="group relative overflow-hidden cursor-pointer flex items-center justify-center gap-3 bg-premium-orange text-white px-10 py-4 rounded-[24px] font-black hover:text-black transition-colors duration-500 shadow-[0_0_40px_rgba(227,6,19,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isSaving ? t(locale, labels.saving) : t(locale, labels.save)}
            </span>
          </button>
        </div>
      </form>

      <div className="pt-10 border-t border-white/10 space-y-6">
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