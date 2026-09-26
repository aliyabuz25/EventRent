import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  LayoutDashboard, MessageSquare, Package, Users, Home, Info,
  Settings, Phone, AlignJustify, RefreshCw,
  TrendingUp, Clock, FileText, ExternalLink,
  ChevronRight, LogOut, Menu, ShoppingCart, Mail, UserCog, Eye, EyeOff, ImageIcon,
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
import { ToastProvider } from '../components/Toast';

type Tab = 'dashboard' | 'orders' | 'leads' | 'products' | 'teambuilding' | 'support'
  | 'content-home' | 'content-about' | 'content-services'
  | 'content-contact' | 'content-footer' | 'smtp' | 'users' | 'media';

type ContentSection = 'home' | 'about' | 'services' | 'contact' | 'footer';

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

const CONTENT_TABS: { id: Tab; section: ContentSection; label: string }[] = [
  { id: 'content-home',     section: 'home',     label: 'Ana Səhifə' },
  { id: 'content-about',    section: 'about',    label: 'Haqqımızda' },
  { id: 'content-services', section: 'services', label: 'Xidmətlər' },
  { id: 'content-contact',  section: 'contact',  label: 'Əlaqə' },
  { id: 'content-footer',   section: 'footer',   label: 'Footer' },
];

const TOKEN_KEY = 'er_admin_token';

function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

/* ══════════════════════════════════════════
   Login Screen
══════════════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: (token: string, user: AuthUser) => void }) {
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
    } catch { setError('Serverə qoşulma alınmadı.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div style={{ width: '100%', maxWidth: 400, padding: '0 16px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div style={{ width: 52, height: 52, background: '#e30613', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>E</span>
          </div>
          <h5 className="fw-bold mb-0" style={{ letterSpacing: '-0.04em' }}>
            <span style={{ color: '#212529' }}>event</span><span style={{ color: '#e30613' }}>rent</span>
          </h5>
          <div style={{ fontSize: 12, color: '#6c757d' }}>Admin Paneli</div>
        </div>

        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 18 }}>
          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ borderRadius: 10, fontSize: 13 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Email</label>
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
              <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Parol</label>
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
              {loading ? 'Giriş edilir...' : 'Daxil ol'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Admin
══════════════════════════════════════════ */
export default function Admin() {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [token, setTokenState]  = useState<string>('');
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Tab>('dashboard');
  const [sideOpen, setSide]     = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);

  const fetchLeads = React.useCallback((tok: string) => {
    fetch('/api/leads', { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setLeads(Array.isArray(data) ? data : []))
      .catch(() => setLeads([]));
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
        if (u) { setUser(u); setTokenState(stored); fetchLeads(stored); }
        else clearToken();
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, [fetchLeads]);

  const handleLogin = (t: string, u: AuthUser) => {
    setToken(t); setTokenState(t); setUser(u);
    fetchLeads(t);
  };

  const handleLogout = () => {
    clearToken(); setTokenState(''); setUser(null);
  };

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  if (loading) return (
    <ToastProvider>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="spinner-border text-danger" style={{ width: 36, height: 36 }} />
      </div>
    </ToastProvider>
  );

  if (!user) return <ToastProvider><LoginScreen onLogin={handleLogin} /></ToastProvider>;

  const isAdmin = user.role === 'admin';
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contentSection = CONTENT_TABS.find(c => c.id === tab)?.section;

  const NAV_ITEMS: NavItemDef[] = [
    { id: 'dashboard',        label: 'Dashboard',    Icon: LayoutDashboard },
    { id: 'orders',           label: 'Sifarişlər',   Icon: ShoppingCart },
    { id: 'leads',            label: 'Sorğular',     Icon: MessageSquare, badge: newLeads || undefined },
    { id: 'products',         label: 'Məhsullar',    Icon: Package },
    { id: 'teambuilding',     label: 'Teambuilding', Icon: Users },
    { id: 'support',          label: 'Dəstək',       Icon: MessageSquare },
    ...(isAdmin ? [
      { id: 'content-home'     as Tab, label: 'Ana Səhifə',  Icon: Home },
      { id: 'content-about'    as Tab, label: 'Haqqımızda',  Icon: Info },
      { id: 'content-services' as Tab, label: 'Xidmətlər',   Icon: Settings },
      { id: 'content-contact'  as Tab, label: 'Əlaqə',       Icon: Phone },
      { id: 'content-footer'   as Tab, label: 'Footer',      Icon: AlignJustify },
      { id: 'media'            as Tab, label: 'Media',       Icon: ImageIcon },
      { id: 'smtp'             as Tab, label: 'SMTP',         Icon: Mail },
      { id: 'users'            as Tab, label: 'İstifadəçilər', Icon: UserCog },
    ] : []),
  ];

  const dataNavCount  = 6;
  const contentNavCount = isAdmin ? 5 : 0;
  const systemNavCount  = isAdmin ? 3 : 0;

  const activeItem = NAV_ITEMS.find(n => n.id === tab);

  return (
    <ToastProvider>
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif', background: '#f4f5f7', cursor: 'auto' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sideOpen ? 224 : 60,
        minWidth: sideOpen ? 224 : 60,
        background: '#fff',
        borderRight: '1px solid #e9ecef',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.22s ease, min-width 0.22s ease',
        overflow: 'hidden',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', gap: 10, minHeight: 60 }}>
          <div style={{ width: 32, height: 32, background: '#e30613', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>E</span>
          </div>
          {sideOpen && <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', whiteSpace: 'nowrap', overflow: 'hidden', lineHeight: 1 }}>
              <span style={{ color: '#212529' }}>event</span><span style={{ color: '#e30613' }}>rent</span>
            </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {sideOpen && <SectionLabel>Əsas</SectionLabel>}
          {NAV_ITEMS.slice(0, dataNavCount).map(item => <NavBtn key={item.id} item={item} active={tab === item.id} open={sideOpen} onClick={() => setTab(item.id)} />)}

          {isAdmin && (
            <>
              {sideOpen && <SectionLabel>Məzmun</SectionLabel>}
              {!sideOpen && <div style={{ height: 6 }} />}
              {NAV_ITEMS.slice(dataNavCount, dataNavCount + contentNavCount).map(item => <NavBtn key={item.id} item={item} active={tab === item.id} open={sideOpen} onClick={() => setTab(item.id)} />)}

              {sideOpen && <SectionLabel>Sistem</SectionLabel>}
              {!sideOpen && <div style={{ height: 6 }} />}
              {NAV_ITEMS.slice(dataNavCount + contentNavCount).map(item => <NavBtn key={item.id} item={item} active={tab === item.id} open={sideOpen} onClick={() => setTab(item.id)} />)}
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
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#adb5bd', display: 'flex' }} title="Çıxış">
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: 54, background: '#fff', borderBottom: '1px solid #e9ecef', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
          <button onClick={() => setSide(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, color: '#6c757d', display: 'flex' }}>
            <Menu size={18} />
          </button>
          <div style={{ width: 1, height: 18, background: '#e9ecef' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {activeItem && <activeItem.Icon size={14} color="#6c757d" />}
            <span style={{ fontWeight: 600, fontSize: 14, color: '#212529' }}>{activeItem?.label}</span>
          </div>
          <div style={{ flex: 1 }} />
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" style={{ fontSize: 11, borderRadius: 8, fontWeight: 600 }}>
            <ExternalLink size={12} /> Sayt
          </a>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {tab === 'dashboard'        && <DashboardTab leads={leads} newLeads={newLeads} onNavigate={setTab} isAdmin={isAdmin} />}
          {tab === 'orders'           && <AdminOrders token={token} />}
          {tab === 'leads'            && <AdminLeads leads={leads} products={[]} token={token} onRefresh={() => fetchLeads(token)} />}
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

/* ── Dashboard ── */
function DashboardTab({ leads, newLeads, onNavigate, isAdmin }: {
  leads: Lead[]; newLeads: number;
  onNavigate: (t: Tab) => void; isAdmin: boolean;
}) {
  const won  = leads.filter(l => l.status === 'won').length;
  const conv = leads.length ? Math.round((won / leads.length) * 100) : 0;

  const stats: { label: string; value: number | string; color: string; Icon: React.FC<{ size?: number; color?: string }>; tab: Tab }[] = [
    { label: 'Ümumi Sorğu', value: leads.length,   color: '#e30613', Icon: FileText,   tab: 'leads' },
    { label: 'Yeni Sorğu',  value: newLeads,        color: '#0d6efd', Icon: Clock,      tab: 'leads' },
    { label: 'Konversiya',  value: `${conv}%`,      color: '#6f42c1', Icon: TrendingUp, tab: 'leads' },
  ];

  const contentSections: { label: string; desc: string; tab: Tab; Icon: React.FC<{ size?: number; color?: string }> }[] = [
    { label: 'Ana Səhifə',  desc: 'Hero, Metrics, CTA',      tab: 'content-home',     Icon: Home },
    { label: 'Haqqımızda', desc: 'Vision, Team, Values',     tab: 'content-about',    Icon: Info },
    { label: 'Xidmətlər',  desc: 'Showcase, Kateqoriyalar', tab: 'content-services', Icon: Settings },
    { label: 'Əlaqə',      desc: 'Form, CTA, Map',           tab: 'content-contact',  Icon: Phone },
    { label: 'Footer',     desc: 'Nav, Copyright, Links',    tab: 'content-footer',   Icon: AlignJustify },
  ];

  return (
    <div>
      <div className="row g-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onClick={() => onNavigate(s.tab)}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = ''; }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.Icon size={18} color={s.color} />
                  </div>
                  <ChevronRight size={14} color="#adb5bd" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#212529', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#6c757d', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 12 }}>Məzmun Bölmələri</div>
          <div className="row g-3">
            {contentSections.map((s, i) => (
              <div key={i} className="col-6 col-md-4 col-lg">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s' }}
                  onClick={() => onNavigate(s.tab)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff0f0'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                  <div className="card-body p-3 text-center">
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <s.Icon size={18} color="#6c757d" />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#212529', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#adb5bd' }}>{s.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}