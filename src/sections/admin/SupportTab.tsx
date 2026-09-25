import React, { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare, Check, X, Clock, AlertCircle, CheckCircle2, Trash2, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useToast } from '../../components/Toast';

interface Ticket {
  id: number; user_id: number; user_name: string; user_email: string;
  subject: string; message: string; status: string; priority: string;
  reply: string; replied_at: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  open:     'bg-warning text-dark',
  answered: 'bg-success text-white',
  closed:   'bg-secondary text-white',
};
const STATUS_LABELS: Record<string, string> = { open: 'Açıq', answered: 'Cavablandı', closed: 'Bağlı' };
const PRIORITY_COLORS: Record<string, string> = { low: 'text-muted', normal: 'text-primary', high: 'text-danger' };
const PRIORITY_LABELS: Record<string, string> = { low: 'Aşağı', normal: 'Normal', high: 'Yüksək' };

export default function SupportTab({ token }: { token: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<'all' | 'open' | 'answered' | 'closed'>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reply, setReply]     = useState<Record<number, string>>({});
  const [sending, setSending] = useState<number | null>(null);
  const toast = useToast();
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/support', { headers: h });
    setTickets(r.ok ? await r.json() : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleReply = async (ticket: Ticket) => {
    const text = reply[ticket.id]?.trim();
    if (!text) return;
    setSending(ticket.id);
    try {
      const res = await fetch(`/api/support/${ticket.id}/reply`, {
        method: 'PUT', headers: h, body: JSON.stringify({ reply: text, status: 'answered' }),
      });
      if (!res.ok) { toast.error('Cavab göndərilmədi.'); return; }
      toast.success(ticket.user_email ? 'Cavab göndərildi və email bildirişi gedib.' : 'Cavab saxlandı.');
      setReply(r => ({ ...r, [ticket.id]: '' }));
      await load();
    } finally { setSending(null); }
  };

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/support/${id}/status`, { method: 'PATCH', headers: h, body: JSON.stringify({ status }) });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu sorğunu silmək istədiyinizə əminsiniz?')) return;
    const r = await fetch(`/api/support/${id}`, { method: 'DELETE', headers: h });
    if (r.ok) { toast.success('Sorğu silindi.'); await load(); }
  };

  const filtered = tickets.filter(t => filter === 'all' || t.status === filter);
  const counts   = { open: tickets.filter(t => t.status === 'open').length, answered: tickets.filter(t => t.status === 'answered').length, closed: tickets.filter(t => t.status === 'closed').length };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-0 fw-bold">Dəstək Sorğuları</h5>
          <div style={{ fontSize: 12, color: '#6c757d' }}>{tickets.length} sorğu · {counts.open} açıq</div>
        </div>
        <button onClick={load} className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 10 }}><RefreshCw size={13} /></button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Açıq', count: counts.open, icon: Clock, color: '#ffc107', bg: '#fff8e1' },
          { label: 'Cavablandı', count: counts.answered, icon: CheckCircle2, color: '#198754', bg: '#e8f5e9' },
          { label: 'Bağlı', count: counts.closed, icon: X, color: '#6c757d', bg: '#f8f9fa' },
        ].map(s => (
          <div key={s.label} className="col-4">
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3" style={{ borderRadius: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={18} color={s.color} /></div>
              <div><div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{s.count}</div><div style={{ fontSize: 11, color: '#6c757d' }}>{s.label}</div></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="d-flex gap-2 mb-4">
        {(['all','open','answered','closed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-danger' : 'btn-outline-secondary'}`} style={{ borderRadius: 10, fontSize: 11 }}>
            {f === 'all' ? 'Hamısı' : STATUS_LABELS[f]}
            {f !== 'all' && counts[f] > 0 && <span className="ms-1 badge bg-white text-dark" style={{ fontSize: 9 }}>{counts[f]}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" style={{ width: 28, height: 28 }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted"><MessageSquare size={36} style={{ marginBottom: 12, opacity: 0.3 }} /><div>Sorğu tapılmadı</div></div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map(ticket => (
            <div key={ticket.id} className="card border-0 shadow-sm" style={{ borderRadius: 16, overflow: 'hidden' }}>
              {/* Header */}
              <div className="d-flex align-items-start gap-3 p-4" style={{ cursor: 'pointer', background: expanded === ticket.id ? '#f8f9fa' : '#fff' }}
                onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ticket.status === 'open' ? '#fff8e1' : ticket.status === 'answered' ? '#e8f5e9' : '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {ticket.status === 'open' ? <Clock size={18} color="#ffc107" /> : ticket.status === 'answered' ? <CheckCircle2 size={18} color="#198754" /> : <X size={18} color="#6c757d" />}
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-bold" style={{ fontSize: 14 }}>{ticket.subject}</span>
                    <span className={`badge ${STATUS_COLORS[ticket.status] || 'bg-secondary text-white'}`} style={{ fontSize: 9, borderRadius: 20 }}>{STATUS_LABELS[ticket.status] || ticket.status}</span>
                    <span className={`${PRIORITY_COLORS[ticket.priority] || 'text-muted'}`} style={{ fontSize: 10, fontWeight: 700 }}>● {PRIORITY_LABELS[ticket.priority] || ticket.priority}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6c757d', marginTop: 2 }}>
                    {ticket.user_name || 'Anonim'} {ticket.user_email && `· ${ticket.user_email}`} · #{String(ticket.id).padStart(4,'0')}
                  </div>
                  <div style={{ fontSize: 11, color: '#adb5bd', marginTop: 2 }}>{ticket.created_at}</div>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <button onClick={e => { e.stopPropagation(); handleDelete(ticket.id); }} className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '4px 8px' }}><Trash2 size={12} /></button>
                  {expanded === ticket.id ? <ChevronUp size={16} color="#adb5bd" /> : <ChevronDown size={16} color="#adb5bd" />}
                </div>
              </div>

              {/* Expanded body */}
              {expanded === ticket.id && (
                <div style={{ borderTop: '1px solid #f1f3f5' }}>
                  {/* Message */}
                  <div className="p-4">
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#adb5bd', marginBottom: 8 }}>Müştəri mesajı</div>
                    <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.6, borderLeft: '4px solid #dee2e6' }}>{ticket.message}</div>
                  </div>

                  {/* Existing reply */}
                  {ticket.reply && (
                    <div className="px-4 pb-3">
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#198754', marginBottom: 8 }}>Cavabınız</div>
                      <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.6, borderLeft: '4px solid #198754' }}>{ticket.reply}</div>
                      {ticket.replied_at && <div style={{ fontSize: 11, color: '#adb5bd', marginTop: 6 }}>{ticket.replied_at}</div>}
                    </div>
                  )}

                  {/* Reply form */}
                  <div className="px-4 pb-4">
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#adb5bd', marginBottom: 8 }}>
                      {ticket.reply ? 'Cavabı Yenilə' : 'Cavab Yaz'}
                      {ticket.user_email && <span className="ms-2" style={{ color: '#0d6efd', textTransform: 'none', letterSpacing: 0 }}>· email: {ticket.user_email}</span>}
                    </div>
                    <textarea className="form-control form-control-sm mb-2" style={{ borderRadius: 12, resize: 'none', fontSize: 13 }} rows={4}
                      value={reply[ticket.id] || ''} onChange={e => setReply(r => ({ ...r, [ticket.id]: e.target.value }))}
                      placeholder="Cavabınızı yazın..." />
                    <div className="d-flex gap-2 justify-content-between align-items-center">
                      <div className="d-flex gap-1">
                        <select className="form-select form-select-sm" style={{ borderRadius: 9, fontSize: 12, width: 'auto' }}
                          value={ticket.status} onChange={e => handleStatus(ticket.id, e.target.value)}>
                          <option value="open">Açıq</option>
                          <option value="answered">Cavablandı</option>
                          <option value="closed">Bağlı</option>
                        </select>
                      </div>
                      <button onClick={() => handleReply(ticket)} disabled={sending === ticket.id || !reply[ticket.id]?.trim()}
                        className="btn btn-sm btn-danger fw-semibold d-flex align-items-center gap-2" style={{ borderRadius: 9 }}>
                        <Send size={13} />
                        {sending === ticket.id ? 'Göndərilir...' : ticket.user_email ? 'Cavabla + Email Göndər' : 'Cavabla'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}