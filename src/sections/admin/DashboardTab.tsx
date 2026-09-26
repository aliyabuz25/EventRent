import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  ShoppingCart, MessageSquare, Headphones, Package,
  TrendingUp, AlertCircle, CheckCircle,
  Home, Info, Settings, Phone, AlignJustify, ChevronRight, RefreshCw,
  Activity, Zap
} from 'lucide-react';

type Tab = string;
interface Props { token: string; onNavigate: (t: Tab) => void; isAdmin: boolean; }

const STATUS_COLORS: Record<string,string> = {
  new:'#3b82f6', processing:'#f59e0b', quoted:'#8b5cf6',
  won:'#22c55e', lost:'#ef4444', contacted:'#06b6d4',
  open:'#f59e0b', answered:'#22c55e', closed:'#6b7280', normal:'#6b7280', high:'#ef4444',
};
const STATUS_LABELS: Record<string,string> = {
  new:'Yeni', processing:'İcrada', quoted:'Təklif', won:'Qazanıldı',
  lost:'İtirildi', contacted:'Əlaqə', open:'Açıq', answered:'Cavablandı',
  closed:'Bağlı', normal:'Normal', high:'Yüksək', website:'Sayt', admin:'Admin',
};
const CHART_COLORS = ['#e30613','#3b82f6','#22c55e','#f59e0b','#8b5cf6','#06b6d4','#f97316','#ec4899'];

function KpiCard({ label, value, sub, color, icon: Icon, badge, onClick }: any) {
  return (
    <div className="col-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100"
        style={{ borderRadius:16, cursor:onClick?'pointer':'default', transition:'all 0.18s' }}
        onClick={onClick}
        onMouseEnter={e => onClick && ((e.currentTarget as HTMLElement).style.transform='translateY(-3px)')}
        onMouseLeave={e => onClick && ((e.currentTarget as HTMLElement).style.transform='')}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div style={{ width:44, height:44, borderRadius:12, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={20} color={color} />
            </div>
            <div className="d-flex align-items-center gap-2">
              {badge != null && badge > 0 && (
                <span style={{ background:'#e30613', color:'#fff', fontSize:10, borderRadius:20, padding:'2px 8px', fontWeight:800, boxShadow:'0 2px 8px rgba(227,6,19,0.35)' }}>
                  {badge} yeni
                </span>
              )}
              {onClick && <ChevronRight size={14} color="#adb5bd" />}
            </div>
          </div>
          <div style={{ fontSize:36, fontWeight:900, color:'#111', lineHeight:1 }}>{value}</div>
          <div style={{ fontSize:12, color:'#6c757d', marginTop:6, fontWeight:600 }}>{label}</div>
          {sub && <div style={{ fontSize:11, color:'#adb5bd', marginTop:2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children, height=240 }: any) {
  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius:16 }}>
      <div className="card-body p-4">
        <div style={{ fontSize:11, fontWeight:700, color:'#495057', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16 }}>{title}</div>
        <div style={{ height }}>{children}</div>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100" style={{ opacity:0.4 }}>
      <Activity size={32} color="#adb5bd" />
      <div style={{ fontSize:12, color:'#adb5bd', marginTop:8 }}>{label} üçün məlumat yoxdur</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid #e9ecef', borderRadius:10, padding:'10px 14px', fontSize:12, boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>
      {label && <div style={{ fontWeight:700, marginBottom:4, color:'#333' }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color:p.color||'#333' }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

export default function DashboardTab({ token, onNavigate, isAdmin }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setStats(d); setLastLoaded(new Date()); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const contentSections = [
    { label: 'Ana Səhifə',  desc: 'Hero, Metrics, CTA',      tab: 'content-home',     Icon: Home },
    { label: 'Haqqımızda', desc: 'Vision, Team, Values',     tab: 'content-about',    Icon: Info },
    { label: 'Xidmətlər',  desc: 'Showcase, Kateqoriyalar', tab: 'content-services', Icon: Settings },
    { label: 'Əlaqə',      desc: 'Form, CTA, Map',           tab: 'content-contact',  Icon: Phone },
    { label: 'Footer',     desc: 'Nav, Copyright, Links',    tab: 'content-footer',   Icon: AlignJustify },
  ];

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="spinner-border text-danger" style={{ width:32, height:32 }} />
    </div>
  );

  const counts = stats?.counts || {};
  const timeData = (stats?.timeline || []).map((d: any) => ({
    day: (d.date || '').slice(5),
    'Sifarişlər': d.orders || 0,
    'Sorğular': d.leads || 0,
  }));
  const orderStatusData = (stats?.ordersByStatus || []).map((d: any) => ({
    name: STATUS_LABELS[d.status] || d.status, value: d.value, status: d.status,
  }));
  const leadStatusData = (stats?.leadsByStatus || []).map((d: any) => ({
    name: STATUS_LABELS[d.status] || d.status, value: d.value,
  }));
  const supportStatusData = (stats?.supportByStatus || []).map((d: any) => ({
    name: STATUS_LABELS[d.status] || d.status, value: d.value, status: d.status,
  }));
  const topProducts = (stats?.topProducts || []).slice(0, 8);
  const catData = (stats?.catData || []).slice(0, 8);
  const recentActivity = (stats?.recentActivity || []).slice(0, 8);
  const convRate = counts.convRate ?? 0;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-0 fw-bold" style={{ letterSpacing:'-0.03em' }}>Dashboard</h5>
          <div style={{ fontSize:12, color:'#6c757d', marginTop:2 }}>
            Sistem statistikası və analitika
            {lastLoaded && (
              <span className="ms-2" style={{ color:'#adb5bd' }}>
                &bull; {lastLoaded.toLocaleTimeString('az-AZ', { hour:'2-digit', minute:'2-digit' })}
              </span>
            )}
          </div>
        </div>
        <button onClick={load} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" style={{ borderRadius:10 }}>
          <RefreshCw size={13} /> Yenilə
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <KpiCard label="Ümumi Sifariş" value={counts.ordersTotal ?? 0} badge={counts.ordersNew}
          sub={`${counts.ordersNew ?? 0} yeni gözləyir`} color="#e30613" icon={ShoppingCart} onClick={() => onNavigate('orders')} />
        <KpiCard label="Ümumi Sorğu" value={counts.leadsTotal ?? 0} badge={counts.leadsNew}
          sub={`${counts.leadsNew ?? 0} yeni gözləyir`} color="#3b82f6" icon={MessageSquare} onClick={() => onNavigate('leads')} />
        <KpiCard label="Dəstək Biletləri" value={counts.supportTotal ?? 0} badge={counts.supportOpen}
          sub={`${counts.supportOpen ?? 0} açıq bilet`} color="#f59e0b" icon={Headphones} onClick={() => onNavigate('support')} />
        <KpiCard label="Aktiv Məhsullar" value={counts.productsTotal ?? 0}
          color="#22c55e" icon={Package} onClick={() => onNavigate('products')} />
      </div>

      {/* Mini KPI strip */}
      <div className="row g-3 mb-4">
        {([
          { label:'Qazanılan Sorğu',    value: counts.leadsWon ?? 0,    color:'#22c55e', Icon: CheckCircle },
          { label:'Konversiya Nisbəti', value: `${convRate}%`,           color:'#8b5cf6', Icon: TrendingUp  },
          { label:'Yeni Sifarişlər',    value: counts.ordersNew ?? 0,   color:'#e30613', Icon: Zap         },
          { label:'Açıq Biletlər',      value: counts.supportOpen ?? 0, color:'#f59e0b', Icon: AlertCircle },
        ] as any[]).map((item, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius:14 }}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div style={{ width:38, height:38, borderRadius:10, background:item.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <item.Icon size={18} color={item.color} />
                </div>
                <div>
                  <div style={{ fontSize:22, fontWeight:900, color:'#111', lineHeight:1 }}>{item.value}</div>
                  <div style={{ fontSize:10, color:'#6c757d', fontWeight:600, marginTop:2 }}>{item.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
{/* Chart Row 1 — Timeline */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <ChartCard title="Son 30 Gün — Sifariş & Sorğu Tendensiyası" height={240}>
            {timeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#e30613" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#e30613" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize:10, fill:'#868e96' }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize:10, fill:'#868e96' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, paddingTop:8 }} />
                  <Area type="monotone" dataKey="Sifarişlər" stroke="#e30613" strokeWidth={2.5} fill="url(#gOrders)" dot={false} activeDot={{ r:5 }} />
                  <Area type="monotone" dataKey="Sorğular"   stroke="#3b82f6" strokeWidth={2.5} fill="url(#gLeads)"  dot={false} activeDot={{ r:5 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <EmptyChart label="Tendensiya" />}
          </ChartCard>
        </div>
      </div>

      {/* Chart Row 2 — Status charts */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <ChartCard title="Sifarişlər — Status" height={220}>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={75} innerRadius={35} paddingAngle={3} dataKey="value" nameKey="name">
                    {orderStatusData.map((d: any, i: number) => (
                      <Cell key={i} fill={STATUS_COLORS[d.status] || CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:10 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyChart label="Sifariş statusu" />}
          </ChartCard>
        </div>
        <div className="col-md-4">
          <ChartCard title="Sorğular — Status" height={220}>
            {leadStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadStatusData} margin={{ top:0, right:10, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#868e96' }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize:10, fill:'#868e96' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Sorğu" radius={[6,6,0,0]}>
                    {leadStatusData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart label="Sorğu statusu" />}
          </ChartCard>
        </div>
        <div className="col-md-4">
          <ChartCard title="Dəstək — Status" height={220}>
            {supportStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={supportStatusData} cx="50%" cy="50%" outerRadius={75} innerRadius={35} paddingAngle={3} dataKey="value" nameKey="name">
                    {supportStatusData.map((d: any, i: number) => (
                      <Cell key={i} fill={STATUS_COLORS[d.status] || CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:10 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyChart label="Dəstək statusu" />}
          </ChartCard>
        </div>
      </div>
{/* Chart Row 3 — Products */}
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <ChartCard title="Ən Çox Sifariş Edilən Məhsullar" height={220}>
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top:0, right:20, left:10, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize:10, fill:'#868e96' }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize:10, fill:'#555' }} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Sifariş" radius={[0,6,6,0]} fill="#e30613" />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart label="Məhsul" />}
          </ChartCard>
        </div>
        <div className="col-md-5">
          <ChartCard title="Məhsullar — Kateqoriya" height={220}>
            {catData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="count" nameKey="category">
                    {catData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} formatter={(v: any, _n: any, p: any) => [v, p.payload.category]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:10 }} formatter={(_: any, e: any) => e.payload.category} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyChart label="Kateqoriya" />}
          </ChartCard>
        </div>
      </div>
{/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius:16 }}>
              <div className="card-body p-4">
                <div style={{ fontSize:11, fontWeight:700, color:'#495057', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16 }}>Son Aktivlik</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {recentActivity.map((item: any, i: number) => (
                    <div key={i} className="d-flex align-items-center gap-3"
                      style={{ padding:'8px 0', borderBottom: i < recentActivity.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
                        background: item.type==='order' ? '#e3061315' : '#3b82f615',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {item.type === 'order' ? <ShoppingCart size={14} color="#e30613" /> : <MessageSquare size={14} color="#3b82f6" />}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:13, color:'#212529', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {item.name || 'Adsız'}
                          <span style={{ fontSize:10, color:'#adb5bd', fontWeight:400, marginLeft:8 }}>{item.phone || ''}</span>
                        </div>
                        <div style={{ fontSize:11, color:'#6c757d' }}>
                          {item.type === 'order' ? 'Sifariş' : 'Sorğu'} &bull;{' '}
                          <span style={{ color: STATUS_COLORS[item.status]||'#6c757d', fontWeight:600 }}>
                            {STATUS_LABELS[item.status] || item.status}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:'#adb5bd', flexShrink:0 }}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('az-AZ', { day:'2-digit', month:'short' }) : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {isAdmin && (
        <div className="mb-2">
          <div style={{ fontSize:11, fontWeight:700, color:'#adb5bd', textTransform:'uppercase', letterSpacing:'0.3em', marginBottom:12 }}>Məzmun Bölmələri</div>
          <div className="row g-3">
            {contentSections.map((s, i) => (
              <div key={i} className="col-6 col-md-4 col-lg">
                <div className="card border-0 shadow-sm h-100"
                  style={{ borderRadius:14, cursor:'pointer', transition:'all 0.15s' }}
                  onClick={() => onNavigate(s.tab)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#fff0f0'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background=''; }}>
                  <div className="card-body p-3 text-center">
                    <div style={{ width:40, height:40, borderRadius:10, background:'#f8f9fa', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
                      <s.Icon size={18} color="#6c757d" />
                    </div>
                    <div style={{ fontWeight:700, fontSize:13, color:'#212529', marginBottom:3 }}>{s.label}</div>
                    <div style={{ fontSize:11, color:'#adb5bd' }}>{s.desc}</div>
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