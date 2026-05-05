import React from 'react';
import { User as UserIcon, Camera, LayoutDashboard, Package, Settings, HelpCircle, LogOut, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { User } from 'firebase/auth';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';

interface ProfileSidebarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  ordersCount: number;
  onLogout: () => void;
}

export default function ProfileSidebar({
  user,
  activeTab,
  setActiveTab,
  ordersCount,
  onLogout
}: ProfileSidebarProps) {
  const { locale } = useSiteContent();

  const labels = {
    menuOverview:   { az: 'İcmal',              en: 'Overview',         ru: 'Обзор',           tr: 'Genel Bakış' },
    menuOrders:     { az: 'Sifarişlərim',        en: 'My Orders',         ru: 'Мои заказы',       tr: 'Siparişlerim' },
    menuSettings:   { az: 'Ayarlar',             en: 'Settings',          ru: 'Настройки',       tr: 'Ayarlar' },
    menuSupport:    { az: 'Dəstək',              en: 'Support',          ru: 'Поддержка',       tr: 'Destek' },
    userPlaceholder:{ az: 'İstifadəçi',          en: 'User',             ru: 'Пользователь',    tr: 'Kullanıcı' },
    logout:         { az: 'Çıxış',               en: 'Logout',           ru: 'Выйти',            tr: 'Çıkış yap' },
    accountStatus:  { az: 'Hesab Statusu',        en: 'Account Status',    ru: 'Статус аккаунта',  tr: 'Hesap Durumu' },
    premiumCustomer:{ az: 'Premium Müştəri',     en: 'Premium Customer', ru: 'Премиум клиент',   tr: 'Premium Müşteri' },
    viewAll:        { az: 'Hamısına bax',        en: 'View All',         ru: 'Смотреть все',    tr: 'Tümünü gör' },
    premiumBanner:  { az: 'Siz bizim sadiq müştərimizsiniz. Bütün xidmətlərdə 5% endirim əldə edirsiniz.', en: 'You are our valued customer. You get a 5% discount on all services.', ru: 'Вы наш ценный клиент. Вы получаете скидку 5% на все услуги.', tr: 'Değerli müşterimizsiniz. Tüm hizmetlerde %5 indirim kazanıyorsunuz.' },
  };

  const menuItems = [
    { id: 'overview', label: t(locale, labels.menuOverview), icon: LayoutDashboard },
    { id: 'orders',   label: t(locale, labels.menuOrders),   icon: Package, count: ordersCount },
    { id: 'settings', label: t(locale, labels.menuSettings), icon: Settings },
    { id: 'support',  label: t(locale, labels.menuSupport),  icon: HelpCircle },
  ];

  return (
    <aside className="lg:w-80 space-y-8">
      <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-2xl shadow-black/5 space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-block group">
            <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center text-red-500 overflow-hidden border-4 border-white shadow-xl">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10" />
              )}
            </div>
            <button type="button" className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user?.displayName || t(locale, labels.userPlaceholder)}</h3>
            <p className="text-sm text-gray-400 font-medium">{user?.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all group",
                activeTab === item.id 
                  ? "bg-black text-white shadow-xl shadow-black/10" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-black"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-red-500" : "group-hover:text-red-500")} />
                {item.label}
              </div>
              {item.count !== undefined && (
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[10px]",
                  activeTab === item.id ? "bg-white/20" : "bg-gray-100"
                )}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-8"
          >
            <LogOut className="w-5 h-5" /> {t(locale, labels.logout)}
          </button>
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="bg-red-600 rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-red-600/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">{t(locale, labels.accountStatus)}</p>
            <p className="text-lg font-bold">{t(locale, labels.premiumCustomer)}</p>
          </div>
        </div>
        <p className="text-sm opacity-80 leading-relaxed">
          {t(locale, labels.premiumBanner)}
        </p>
      </div>
    </aside>
  );
}
