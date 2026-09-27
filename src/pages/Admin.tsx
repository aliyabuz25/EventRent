import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  LayoutDashboard, MessageSquare, Package, Users, Home, Info,
  Settings, Phone, AlignJustify, RefreshCw,
  TrendingUp, Clock, FileText, ExternalLink,
  ChevronRight, LogOut, Menu, ShoppingCart, Mail, UserCog, Eye, EyeOff, ImageIcon, Headphones, Bell, Globe
} from 'lucide-react';
import { Lead } from '../types';
import AdminLeads from '../sections/admin/LeadsTab';
import AdminProducts from '../sections/admin/ProductsTab';
import AdminTeambuilding from '../sections/admin/TeambuildingTab';
import AdminOrders from '../sections/admin/OrdersTab';
import AdminSmtp from '../sections/admin/SmtpTab';
import AdminUsers from '../sections/admin/UsersTab';
import AdminMedia from '../sections/admin/MediaTab';
import AdminSupport from '../sections/admin/SupportTab';
import AdminContent from '../components/ContentStudio';
import DashboardTab from '../sections/admin/DashboardTab';
import { ToastProvider } from '../components/Toast';
import { useSiteContent } from '../content.context';

// Admin translations dictionary
const adminTranslations = {
  az: {
    dashboard: 'Panel',
    orders: 'Sifarişlər',
    leads: 'Müraciətlər',
    products: 'Məhsullar',
    teambuilding: 'Teambuilding',
    support: 'Dəstək',
    main: 'Əsas',
    content: 'Məzmun',
    system: 'Sistem',
    home: 'Ana Səhifə',
    about: 'Haqqımızda',
    services: 'Xidmətlər',
    contact: 'Əlaqə',
    footer: 'Footer',
    portfolio: 'Portfolio',
    media: 'Media (Şəkillər)',
    smtp: 'SMTP Ayarları',
    users: 'İstifadəçilər',
    logout: 'Çıxış',
    site: 'Sayt',
    notifications: 'Bildirişlər',
    newNotifications: 'yeni bildiriş',
    adminPanel: 'Admin Paneli',
    login: 'Daxil ol',
    email: 'Email',
    password: 'Parol',
    connecting: 'Qoşulur...',
    serverError: 'Serverə qoşulma alınmadı.',
    backToSite: 'Sayta qayıt',
  },
  en: {
    dashboard: 'Dashboard',
    orders: 'Orders',
    leads: 'Leads',
    products: 'Products',
    teambuilding: 'Teambuilding',
    support: 'Support',
    main: 'Main',
    content: 'Content',
    system: 'System',
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    footer: 'Footer',
    portfolio: 'Portfolio',
    media: 'Media (Images)',
    smtp: 'SMTP Settings',
    users: 'Users',
    logout: 'Logout',
    site: 'Site',
    notifications: 'Notifications',
    newNotifications: 'new notifications',
    adminPanel: 'Admin Panel',
    login: 'Login',
    email: 'Email',
    password: 'Password',
    connecting: 'Connecting...',
    serverError: 'Failed to connect to server.',
    backToSite: 'Back to site',
  }
};

type Tab = 'dashboard' | 'orders' | 'leads' | 'products' | 'teambuilding' | 'support'
  | 'content-home' | 'content-about' | 'content-services'
  | 'content-contact' | 'content-footer' | 'content-portfolio' | 'smtp' | 'users' | 'media';

type ContentSection = 'home' | 'about' | 'services' | 'contact' | 'footer' | 'portfolio';

interface NavItemDef {
  id: Tab;
  label: string;
  Icon: React.FC<{ size?: number; className?: string; color?: string }>;
  badge?: number;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  active: number;
}



const TOKEN_KEY = 'er_admin_token';

function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

/* ══════════════════════════════════════════
   Login Screen
══════════════════════════════════════════ */
function LoginScreen({ onLogin, locale, t }: { onLogin: (token: string, user: AuthUser) => void, locale: 'az' | 'en', t: typeof adminTranslations['az'] }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Giriş uğursuz oldu.'); return; }
      onLogin(data.token, data.user);
    } catch { setError(t.serverError); }
    finally { setLoading(false); }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div style={{ width: '100%', maxWidth: 400, padding: '0 16px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div style={{ width: 52, height: 52, background: '#e30613', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>E</span>
          </div>
          <h5 className="fw-bold mb-0" style={{ letterSpacing: '-0.04em' }}>
            <span style={{ color: '#212529' }}>event</span><span style={{ color: '#e30613' }}>rent</span>
          </h5>
          <div style={{ fontSize: 12, color: '#6c757d' }}>{t.adminPanel}</div>
        </div>

        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 18 }}>
          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ borderRadius: 10, fontSize: 13 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 12 }}>{t.email}</label>
              <input
                type="email" required
                className="form-control"
                style={{ borderRadius: 10 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@eventrent.az"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: 12 }}>{t.password}</label>
              <div className="d-flex gap-2">
                <input
                  type={showPass ? 'text' : 'password'} required
                  className="form-control"
                  style={{ borderRadius: 10 }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button type="button" className="btn btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 10 }} onClick={() => setShowPass(v => !v)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-danger fw-semibold w-100" style={{ borderRadius: 10 }}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {loading ? t.connecting : t.login}
            </button>
          </form>
          <div className="mt-3 text-center">
             <a href="/" className="text-muted text-decoration-none" style={{ fontSize: 13 }}>&larr; {t.backToSite}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Admin
══════════════════════════════════════════ */
export default function Admin() {
  const { locale } = useSiteContent();
  const t = adminTranslations[locale === 'az' ? 'az' : 'en'] || adminTranslations['en'];
  
  const CONTENT_TABS: { id: Tab; section: ContentSection; label: string }[] = [
    { id: 'content-home',      section: 'home',      label: t.home },
    { id: 'content-about',     section: 'about',     label: t.about },
    { id: 'content-services',  section: 'services',  label: t.services },
    { id: 'content-contact',   section: 'contact',   label: t.contact },
    { id: 'content-footer',    section: 'footer',    label: t.footer },
    { id: 'content-portfolio', section: 'portfolio', label: t.portfolio },
  ];

  const NAV_ITEMS: NavItemDef[] = [
    { id: 'dashboard',    label: t.dashboard,    Icon: LayoutDashboard },
    { id: 'orders',       label: t.orders,       Icon: ShoppingCart },
    { id: 'leads',        label: t.leads,        Icon: MessageSquare },
    { id: 'products',     label: t.products,     Icon: Package },
    { id: 'teambuilding', label: t.teambuilding, Icon: Users },
    { id: 'support',      label: t.support,      Icon: Headphones },
    ...CONTENT_TABS.map(ct => ({ id: ct.id, label: ct.label, Icon: FileText })),
    { id: 'media',        label: t.media,        Icon: ImageIcon },
    { id: 'smtp',         label: t.smtp,         Icon: Mail },
    { id: 'users',        label: t.users,        Icon: UserCog },
  ];
  
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [token, setTokenState]  = useState<string>('');
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Tab>('dashboard');
  const [sideOpen, setSideOpen] = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newOrdersCount, setNewOrdersCount]   = useState(0);
  const [newSupportCount, setNewSupportCount] = useState(0);
  const prevOrdersRef  = React.useRef(0);
  const prevSupportRef = React.useRef(0);
  const notifPermRef   = React.useRef<NotificationPermission>('default');

  // Request browser notification permission once
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => { notifPermRef.current = p; });
    } else if ('Notification' in window) {
      notifPermRef.current = Notification.permission;
    }
  }, []);

  // Initialize gTranslate for Admin panel
  React.useEffect(() => {
    // Check if script already exists to avoid duplicates
    if (!document.getElementById('gtranslate-script-admin')) {
      const gTranslateSettings = document.createElement('script');
      gTranslateSettings.innerHTML = `window.gtranslateSettings = {"default_language":"az","languages":["tr","en","az","fr","it","es","de","th","tl","ar","ru","pl","bn"],"wrapper_selector":".gtranslate_wrapper","switcher_horizontal_position":"inline"}`;
      document.body.appendChild(gTranslateSettings);

      const gTranslateScript = document.createElement('script');
      gTranslateScript.id = 'gtranslate-script-admin';
      gTranslateScript.src = "https://cdn.gtranslate.net/widgets/latest/dwf.js";
      gTranslateScript.defer = true;
      document.body.appendChild(gTranslateScript);
    }
  }, []);

  const sendBrowserNotif = React.useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, []);

  const fetchLeads = React.useCallback((tok: string) => {
    fetch('/api/leads', { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setLeads(arr);
        const newCount = arr.filter((l: any) => l.status === 'new').length;
        if (prevOrdersRef.current > 0 && newCount > prevOrdersRef.current) {
          sendBrowserNotif('Yeni Sorğu!', `${newCount - prevOrdersRef.current} yeni sorğu daxil oldu`);
        }
        prevOrdersRef.current = newCount;
      })
      .catch(() => setLeads([]));
  }, [sendBrowserNotif]);

  const fetchBadgeCounts = React.useCallback((tok: string) => {
    // Orders
    fetch('/api/orders', { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const cnt = arr.filter((o: any) => o.status === 'new').length;
        if (prevOrdersRef.current > 0 && cnt > prevOrdersRef.current) {
          sendBrowserNotif('Yeni Sifariş!', `${cnt - prevOrdersRef.current} yeni sifariş daxil oldu`);
        }
        prevOrdersRef.current = cnt;
        setNewOrdersCount(cnt);
      })
      .catch(() => {});
    // Support
    fetch('/api/support', { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const cnt = arr.filter((s: any) => s.status === 'open').length;
        if (prevSupportRef.current > 0 && cnt > prevSupportRef.current) {
          sendBrowserNotif('Yeni Dəstək Bileti!', `${cnt - prevSupportRef.current} yeni dəstək bileti açıldı`);
        }
        prevSupportRef.current = cnt;
        setNewSupportCount(cnt);
      })
      .catch(() => {});
  }, [sendBrowserNotif]);

  const fetchProducts = React.useCallback(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : [])
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    document.body.style.setProperty('cursor', 'auto', 'important');
    return () => { document.body.style.cursor = ''; };
  }, []);

  /* Auto-login from stored token */
  useEffect(() => {
    const stored = getToken();
    if (!stored) { setLoading(false); return; }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${stored}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => {
        if (u) {
          setUser(u); setTokenState(stored);
          fetchLeads(stored); fetchProducts(); fetchBadgeCounts(stored);
        } else clearToken();
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, [fetchLeads, fetchProducts, fetchBadgeCounts]);

  /* Polling — hər 60 saniyə badge-ləri yenilə + browser notification */
  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => {
      fetchLeads(token);
      fetchBadgeCounts(token);
    }, 60_000);
    return () => clearInterval(id);
  }, [token, fetchLeads, fetchBadgeCounts]);

  const handleLogin = (t: string, u: AuthUser) => {
    setToken(t); setTokenState(t); setUser(u);
    fetchLeads(t); fetchProducts(); fetchBadgeCounts(t);
  };

  const handleLogout = () => {
    clearToken(); setTokenState(''); setUser(null);
  };

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  if (loading) return (
    <ToastProvider>
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-danger" style={{ width: 36, height: 36 }} />
      </div>
    </ToastProvider>
  );

  if (!user) return <ToastProvider><LoginScreen onLogin={handleLogin} locale={locale === 'az' ? 'az' : 'en'} t={t} /></ToastProvider>;

  const isAdmin = user.role === 'admin';
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contentSection = CONTENT_TABS.find(c => c.id === tab)?.section;

  const ALL_NAV_ITEMS: NavItemDef[] = [
    { id: 'dashboard',        label: t.dashboard,    Icon: LayoutDashboard },
    { id: 'orders',           label: t.orders,       Icon: ShoppingCart,   badge: newOrdersCount  || undefined },
    { id: 'leads',            label: t.leads,        Icon: MessageSquare,  badge: newLeads        || undefined },
    { id: 'products',         label: t.products,     Icon: Package },
    { id: 'teambuilding',     label: t.teambuilding, Icon: Users },
    { id: 'support',          label: t.support,      Icon: Headphones,     badge: newSupportCount || undefined },
    ...(isAdmin ? [
      { id: 'content-home'      as Tab, label: t.home,  Icon: Home },
      { id: 'content-about'     as Tab, label: t.about,  Icon: Info },
      { id: 'content-services'  as Tab, label: t.services,   Icon: Settings },
      { id: 'content-contact'   as Tab, label: t.contact,       Icon: Phone },
      { id: 'content-footer'    as Tab, label: t.footer,      Icon: AlignJustify },
      { id: 'content-portfolio' as Tab, label: t.portfolio,   Icon: ImageIcon },
      { id: 'media'            as Tab, label: t.media,       Icon: ImageIcon },
      { id: 'smtp'             as Tab, label: t.smtp,         Icon: Mail },
      { id: 'users'            as Tab, label: t.users, Icon: UserCog },
    ] : []),
  ];

  const dataNavCount  = 6;
  const contentNavCount = isAdmin ? 6 : 0;
  const systemNavCount  = isAdmin ? 3 : 0;

  const activeItem = ALL_NAV_ITEMS.find(n => n.id === tab);

  return (
    <ToastProvider>
    <div style={{ display: 'flex', height: '100dvh', fontFamily: 'Inter, system-ui, sans-serif', background: '#f4f5f7', cursor: 'auto' }}>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sideOpen && (
        <div 
          className="d-md-none"
          onClick={() => setSideOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={sideOpen ? 'position-fixed position-md-relative h-100' : 'd-none d-md-flex position-relative h-100'}
        style={{
        width: sideOpen ? 224 : 60,
        minWidth: sideOpen ? 224 : 60,
        background: '#fff',
        borderRight: '1px solid #e9ecef',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.22s ease, min-width 0.22s ease',
        overflow: 'hidden',
        zIndex: 100,
        left: 0,
        top: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#e30613', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>E</span>
            </div>
            {sideOpen && <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', whiteSpace: 'nowrap', overflow: 'hidden', lineHeight: 1 }}>
                <span style={{ color: '#212529' }}>event</span><span style={{ color: '#e30613' }}>rent</span>
              </div>}
          </div>
          {/* Toggle button inside sidebar when open on desktop */}
          {sideOpen && (
            <button 
              className="d-none d-md-flex"
              onClick={() => setSideOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: 6, color: '#adb5bd' }}>
              <Menu size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {sideOpen && <SectionLabel>{t.main}</SectionLabel>}
          {ALL_NAV_ITEMS.slice(0, dataNavCount).map(item => <NavBtn key={item.id} item={item} active={tab === item.id} open={sideOpen} onClick={() => setTab(item.id)} />)}

          {isAdmin && (
            <>
              {sideOpen && <SectionLabel>{t.content}</SectionLabel>}
              {!sideOpen && <div style={{ height: 6 }} />}
              {ALL_NAV_ITEMS.slice(dataNavCount, dataNavCount + contentNavCount).map(item => <NavBtn key={item.id} item={item} active={tab === item.id} open={sideOpen} onClick={() => setTab(item.id)} />)}

              {sideOpen && <SectionLabel>{t.system}</SectionLabel>}
              {!sideOpen && <div style={{ height: 6 }} />}
              {ALL_NAV_ITEMS.slice(dataNavCount + contentNavCount).map(item => <NavBtn key={item.id} item={item} active={tab === item.id} open={sideOpen} onClick={() => setTab(item.id)} />)}
            </>
          )}
        </nav>

        {/* User */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fff0f0', border: '1px solid #ffd6d6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#e30613', fontWeight: 900, fontSize: 12 }}>{(user.name || user.email)[0].toUpperCase()}</span>
          </div>
          {sideOpen && (
            <>
              <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#212529', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: 10, color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</div>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#adb5bd', display: 'flex' }} title={t.logout}>
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: 54, background: '#fff', borderBottom: '1px solid #e9ecef', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
          <button 
            className="d-md-none"
            onClick={() => setSideOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, color: '#6c757d', display: 'flex' }}>
            <Menu size={18} />
          </button>
          {/* Toggle button in topbar only when sidebar is closed on desktop */}
          {!sideOpen && (
            <button 
              className="d-none d-md-flex"
              onClick={() => setSideOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, color: '#6c757d' }}>
              <Menu size={18} />
            </button>
          )}
          <div style={{ width: 1, height: 18, background: '#e9ecef' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {activeItem && <activeItem.Icon size={14} color="#6c757d" />}
            <span style={{ fontWeight: 600, fontSize: 14, color: '#212529' }}>{activeItem?.label}</span>
          </div>
          <div style={{ flex: 1 }} />
          {/* Lang Selector for Admin Panel */}
          <div className="gtranslate_wrapper d-flex align-items-center me-2"></div>
          {/* Notification bell */}
          {(() => {
            const totalNew = (newOrdersCount || 0) + (newLeads || 0) + (newSupportCount || 0);
            return (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    if ('Notification' in window && Notification.permission === 'default') {
                      Notification.requestPermission();
                    }
                  }}
                  title={totalNew > 0 ? `${totalNew} ${t.newNotifications}` : t.notifications}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, color: totalNew > 0 ? '#e30613' : '#6c757d', display: 'flex', position: 'relative' }}
                >
                  <Bell size={18} />
                  {totalNew > 0 && (
                    <span style={{
                      position: 'absolute', top: 2, right: 2,
                      width: 16, height: 16, background: '#e30613', color: '#fff',
                      borderRadius: '50%', fontSize: 9, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid #fff',
                    }}>
                      {totalNew > 9 ? '9+' : totalNew}
                    </span>
                  )}
                </button>
              </div>
            );
          })()}
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" style={{ fontSize: 11, borderRadius: 8, fontWeight: 600 }}>
            <ExternalLink size={12} /> {t.site}
          </a>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
          {tab === 'dashboard'        && <DashboardTab token={token} onNavigate={(t) => setTab(t as Tab)} isAdmin={isAdmin} />}
          {tab === 'orders'           && <AdminOrders token={token} />}
          {tab === 'leads'            && <AdminLeads leads={leads} products={products} token={token} onRefresh={() => fetchLeads(token)} />}
          {tab === 'products'         && <AdminProducts token={token} />}
          {tab === 'teambuilding'     && <AdminTeambuilding token={token} />}
          {tab === 'support'          && <AdminSupport token={token} />}
          {tab === 'media'   && isAdmin && <AdminMedia token={token} />}
          {tab === 'smtp'    && isAdmin && <AdminSmtp token={token} />}
          {tab === 'users'   && isAdmin && <AdminUsers token={token} currentUserId={user.id} />}
          {contentSection   && isAdmin && <AdminContent section={contentSection} />}
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}

/* ── helpers ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 9, fontWeight: 700, color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.3em', padding: '10px 8px 4px' }}>{children}</div>;
}

function NavBtn({ item, active, open, onClick }: { item: NavItemDef; active: boolean; open: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={!open ? item.label : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 9,
        padding: open ? '7px 10px' : '7px', borderRadius: 9, border: 'none',
        background: active ? '#fff0f0' : hover ? '#f8f9fa' : 'transparent',
        color: active ? '#e30613' : '#495057',
        fontWeight: active ? 700 : 500, fontSize: 13,
        cursor: 'pointer', transition: 'all 0.12s', marginBottom: 1,
        justifyContent: open ? 'flex-start' : 'center',
        whiteSpace: 'nowrap', overflow: 'hidden',
      }}
    >
      <item.Icon size={15} />
      {open && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>{item.label}</span>}
      {open && item.badge ? <span style={{ background: '#e30613', color: '#fff', fontSize: 9, borderRadius: 20, padding: '1px 6px', fontWeight: 700 }}>{item.badge}</span> : null}
    </button>
  );
}

