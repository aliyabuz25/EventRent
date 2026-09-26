import React, { useState, useEffect } from 'react';
import { Mail, Server, Lock, Send, Check, RefreshCw, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../components/Toast';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user_email: string;
  password: string;
  from_name: string;
  from_email: string;
  notify_to: string;
}

const DEFAULTS: SmtpConfig = { host: '', port: 465, secure: true, user_email: '', password: '', from_name: 'Eventrent', from_email: '', notify_to: '' };

export default function SmtpTab({ token }: { token: string }) {
  const [form, setForm] = useState<SmtpConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testTo, setTestTo] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [connected, setConnected] = useState<boolean | null>(null);

  const toast = useToast();
  const [showPass, setShowPass] = useState(false);
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch('/api/smtp', { headers: h }).then(r => r.json()).then(data => {
      setForm({ ...DEFAULTS, ...data });
      setLoading(false);
    }).catch(() => setLoading(false));
    fetch('/api/health').then(r => r.json()).then(d => setConnected(!!d.smtp)).catch(() => setConnected(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, msg: '' });
    try {
      const res = await fetch('/api/smtp', { method: 'PUT', headers: h, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.ok || data.connected) {
        setConnected(true);
        setStatus({ type: 'success', msg: 'SMTP uğurla qoşuldu və saxlandı!' });
        toast.success('SMTP qoşuldu!');
      } else {
        setConnected(false);
        setStatus({ type: 'error', msg: data.error || 'Qoşulma alınmadı. Host, port və parol düzgündür?' });
        toast.error('SMTP qoşulmadı.');
      }
    } catch { setStatus({ type: 'error', msg: 'Server xətası.' }); }
    setSaving(false);
  };

  const handleTest = async () => {
    if (!testTo) { setStatus({ type: 'error', msg: 'Test email adresi daxil edin.' }); return; }
    setTesting(true);
    setStatus({ type: null, msg: '' });
    try {
      const res = await fetch('/api/smtp/test', { method: 'POST', headers: h, body: JSON.stringify({ to: testTo }) });
      const data = await res.json();
      if (data.ok) { setStatus({ type: 'success', msg: `Test email ${testTo} adresinə göndərildi!` }); toast.success('Test email göndərildi!'); }
      else { setStatus({ type: 'error', msg: 'Email göndərilmədi. SMTP ayarlarını yoxlayın.' }); toast.error('Test email göndərilmədi.'); }
    } catch { setStatus({ type: 'error', msg: 'Server xətası.' }); }
    setTesting(false);
  };

  const inputCls = 'form-control form-control-sm';

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" style={{ width: 28, height: 28 }} /></div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div>
          <h5 className="mb-0 fw-bold">SMTP Ayarları</h5>
          <div style={{ fontSize: 12, color: '#6c757d' }}>Email bildirişləri üçün SMTP server konfiqurasiyası</div>
        </div>
        <div className="ms-auto">
          {connected === true && (
            <span className="badge d-flex align-items-center gap-1" style={{ background: '#d1e7dd', color: '#0a3622', borderRadius: 20, padding: '6px 12px', fontSize: 11 }}>
              <CheckCircle size={12} /> Qoşulub
            </span>
          )}
          {connected === false && (
            <span className="badge d-flex align-items-center gap-1" style={{ background: '#f8d7da', color: '#58151c', borderRadius: 20, padding: '6px 12px', fontSize: 11 }}>
              <AlertCircle size={12} /> Qoşulmayıb
            </span>
          )}
        </div>
      </div>

      {status.type && (
        <div className={`alert d-flex align-items-center gap-2 mb-4 ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{ borderRadius: 10, fontSize: 13 }}>
          {status.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
          <div className="card-body p-4">
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6c757d', marginBottom: 16 }}>
              <Server size={12} style={{ marginRight: 6 }} />Server
            </div>
            <div className="row g-3">
              <div className="col-md-7">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>SMTP Host</label>
                <input className={inputCls} style={{ borderRadius: 9 }} value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} placeholder="mail.example.az" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Port</label>
                <input type="number" className={inputCls} style={{ borderRadius: 9 }} value={form.port} onChange={e => setForm({ ...form, port: Number(e.target.value) })} />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>SSL/TLS</label>
                <div className="form-check form-switch mt-1">
                  <input className="form-check-input" type="checkbox" checked={form.secure} onChange={e => setForm({ ...form, secure: e.target.checked })} style={{ cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
          <div className="card-body p-4">
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6c757d', marginBottom: 16 }}>
              <Lock size={12} style={{ marginRight: 6 }} />Giriş Məlumatları
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Email (İstifadəçi Adı)</label>
                <input type="email" className={inputCls} style={{ borderRadius: 9 }} value={form.user_email} onChange={e => setForm({ ...form, user_email: e.target.value })} placeholder="you@example.az" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Parol</label>
                <div className="d-flex gap-1">
                  <input type={showPass ? 'text' : 'password'} className={inputCls} style={{ borderRadius: 9 }} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••••••••••" />
                  <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 9 }} onClick={() => setShowPass(v => !v)}>
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
          <div className="card-body p-4">
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6c757d', marginBottom: 16 }}>
              <Mail size={12} style={{ marginRight: 6 }} />Göndərici / Alıcı
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Göndərici Adı</label>
                <input className={inputCls} style={{ borderRadius: 9 }} value={form.from_name} onChange={e => setForm({ ...form, from_name: e.target.value })} placeholder="Eventrent" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Göndərici Email</label>
                <input type="email" className={inputCls} style={{ borderRadius: 9 }} value={form.from_email} onChange={e => setForm({ ...form, from_email: e.target.value })} placeholder="noreply@eventrent.az" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Bildiriş Alıcısı (Admin Email)</label>
                <input type="email" className={inputCls} style={{ borderRadius: 9 }} value={form.notify_to} onChange={e => setForm({ ...form, notify_to: e.target.value })} placeholder="admin@eventrent.az" />
                <div style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>Yeni sifariş gəldikdə bu adresə email göndəriləcək.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mb-4">
          <button type="submit" disabled={saving} className="btn btn-danger fw-semibold d-flex align-items-center gap-2" style={{ borderRadius: 10 }}>
            {saving ? <RefreshCw size={14} /> : <Check size={14} />}
            {saving ? 'Yoxlanılır...' : 'Saxla və Qoşul'}
          </button>
        </div>
      </form>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6c757d', marginBottom: 16 }}>
            <Send size={12} style={{ marginRight: 6 }} />Test Email
          </div>
          <div className="d-flex gap-2">
            <input
              type="email"
              className="form-control form-control-sm"
              style={{ borderRadius: 9, maxWidth: 280 }}
              value={testTo}
              onChange={e => setTestTo(e.target.value)}
              placeholder="test@example.com"
            />
            <button onClick={handleTest} disabled={testing} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 fw-semibold" style={{ borderRadius: 9 }}>
              {testing ? <RefreshCw size={13} /> : <Send size={13} />}
              {testing ? 'Göndərilir...' : 'Test Göndər'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#6c757d', marginTop: 6 }}>SMTP qoşuldumu yoxlamaq üçün özünüzə test email göndərin.</div>
        </div>
      </div>
    </div>
  );
}
