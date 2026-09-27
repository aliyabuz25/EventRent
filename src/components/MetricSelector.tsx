import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Settings } from 'lucide-react';
import { useToast } from './Toast';

export default function MetricSelector({ token, productId, onAttach, onClose }: any) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'new'
  const toast = useToast();

  const [newMetric, setNewMetric] = useState({
    name: '', key: '', var_type: 'select', component: 'select',
    options: [{ label: '', value: '', price: 0 }]
  });

  useEffect(() => {
    fetch('/api/metrics', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setMetrics(data); setLoading(false); });
  }, [token]);

  const handleAttach = async (metricId: string) => {
    if (!productId) {
      // Draft product
      toast.success('Metrik seçildi (Məhsul yadda saxlananda əlavə ediləcək)');
      onAttach(metricId);
      onClose();
      return;
    }
    const res = await fetch(`/api/products/${productId}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ metric_id: metricId, position: 0 })
    });
    if (res.ok) {
      toast.success('Metrik əlavə edildi');
      onAttach();
      onClose();
    } else {
      const data = await res.json();
      toast.error(data.error || 'Xəta baş verdi');
    }
  };

  const handleCreate = async () => {
    if (!newMetric.name || !newMetric.key) return toast.error('Ad və Key tələb olunur');
    const res = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...newMetric, options: newMetric.options.filter(o => o.label && o.value) })
    });
    
    if (res.ok) {
      const data = await res.json();
      toast.success('Metrik yaradıldı');
      await handleAttach(data.id);
    } else {
      const data = await res.json();
      toast.error(data.error || 'Xəta baş verdi');
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-sm" style={{ borderRadius: 8 }}>
          <div className="modal-header border-bottom px-4 pt-3 pb-3 d-flex align-items-center justify-content-between">
            <h6 className="modal-title fw-semibold" style={{ fontSize: 14 }}>{view === 'list' ? 'Metriklər' : 'Yeni Metrik'}</h6>
            <button className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-1" style={{ borderRadius: 6, color: '#6c757d' }} onClick={onClose}><X size={15} /></button>
          </div>
          <div className="modal-body px-4 pb-4">
            {view === 'list' ? (
              <>
                <div className="position-relative mb-3">
                  <Search size={14} className="position-absolute" style={{ left: 12, top: 10, color: '#6c757d' }} />
                  <input className="form-control form-control-sm ps-4" style={{ borderRadius: 6, padding: '7px 10px', fontSize: 12, border: '1px solid #ced4da' }} placeholder="Metrik axtar..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="d-flex flex-column gap-2" style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {loading ? <div className="text-center py-3"><span className="spinner-border spinner-border-sm text-primary" /></div> :
                    metrics.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(m => (
                      <div key={m.id} className="d-flex align-items-center justify-content-between p-2 border rounded" style={{ transition: 'background 0.1s', cursor: 'pointer', borderRadius: 6 }} onClick={() => handleAttach(m.id)} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                        <div className="fw-semibold text-dark" style={{ fontSize: 13 }}>{m.name} <span className="text-muted fw-normal ms-1" style={{ fontSize: 11 }}>({m.var_type})</span></div>
                        <Plus size={16} className="text-muted" />
                      </div>
                    ))
                  }
                  {!loading && metrics.length === 0 && (
                    <div className="text-center text-muted py-4" style={{ fontSize: 12 }}>Heç bir metrik tapılmadı.</div>
                  )}
                </div>
                <button className="btn btn-sm btn-light border w-100 mt-3 text-primary" style={{ borderRadius: 6, fontSize: 12, padding: '7px' }} onClick={() => setView('new')}><Plus size={13} className="me-1" /> Yeni Metrik Yarat</button>
              </>
            ) : (
              <div className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label fw-semibold text-secondary mb-1" style={{ fontSize: 12 }}>Ad</label>
                  <input className="form-control form-control-sm" style={{ borderRadius: 6, padding: '7px 10px', fontSize: 12 }} value={newMetric.name} onChange={e => setNewMetric({...newMetric, name: e.target.value})} placeholder="Məs: Rəng" />
                </div>
                <div>
                  <label className="form-label fw-semibold text-secondary mb-1" style={{ fontSize: 12 }}>Key</label>
                  <input className="form-control form-control-sm" style={{ borderRadius: 6, padding: '7px 10px', fontSize: 12 }} value={newMetric.key} onChange={e => setNewMetric({...newMetric, key: e.target.value})} placeholder="Məs: color" />
                </div>
                <div className="d-flex gap-2">
                  <div className="flex-1 w-50">
                    <label className="form-label fw-semibold text-secondary mb-1" style={{ fontSize: 12 }}>Növ</label>
                    <select className="form-select form-select-sm" style={{ borderRadius: 6, fontSize: 12 }} value={newMetric.var_type} onChange={e => setNewMetric({...newMetric, var_type: e.target.value})}>
                      <option value="select">Select</option><option value="color">Color</option><option value="text">Text</option>
                    </select>
                  </div>
                </div>
                <hr className="my-1 border-light" />
                <label className="form-label fw-semibold text-secondary mb-0" style={{ fontSize: 12 }}>Seçimlər</label>
                {newMetric.options.map((opt, i) => (
                  <div key={i} className="d-flex gap-2">
                    <input className="form-control form-control-sm" style={{ borderRadius: 5, fontSize: 12 }} placeholder="Label (Görünən Ad)" value={opt.label} onChange={e => { const o=[...newMetric.options]; o[i].label=e.target.value; setNewMetric({...newMetric, options: o}); }} />
                    <input className="form-control form-control-sm" style={{ borderRadius: 5, fontSize: 12 }} placeholder="Value (Key)" value={opt.value} onChange={e => { const o=[...newMetric.options]; o[i].value=e.target.value; setNewMetric({...newMetric, options: o}); }} />
                  </div>
                ))}
                <button className="btn btn-sm btn-light border w-100 mt-1 text-primary" style={{ borderRadius: 6, fontSize: 12 }} onClick={() => setNewMetric({...newMetric, options: [...newMetric.options, {label:'', value:'', price:0}]})}><Plus size={13} className="me-1" /> Seçim əlavə et</button>
                <div className="d-flex gap-2 mt-3 pt-3 border-top">
                  <button className="btn btn-sm btn-light border w-50 text-secondary" style={{ borderRadius: 6, fontSize: 12 }} onClick={() => setView('list')}>Geri</button>
                  <button className="btn btn-sm btn-primary w-50 fw-semibold" style={{ borderRadius: 6, fontSize: 12 }} onClick={handleCreate}>Yarat və Əlavə Et</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
