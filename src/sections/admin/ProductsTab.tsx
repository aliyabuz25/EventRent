import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Package, X, Check, Image as ImageIcon, Tag, Search, RefreshCw, Eye, EyeOff, ChevronRight, Settings, GripVertical } from 'lucide-react';
import { useToast } from '../../components/Toast';
import Sortable from 'sortablejs';

interface Product {
  id: string; name: string; category: string; description: string;
  technicalSpecs: Record<string, string>; images: string[]; tags: string[];
  relatedProducts: string[]; active: number; sort_order: number;
  customizationConfig?: any[]; metaobjects?: Record<string, any>;
}

import MetricSelector from '../../components/MetricSelector';

const EMPTY: Omit<Product, 'id' | 'active' | 'sort_order'> = {
  name: '', category: '', description: '', technicalSpecs: {}, images: [''], tags: [], relatedProducts: [], customizationConfig: [], metaobjects: {}, metrics: []
};

const inputCls = 'form-control form-control-sm';

function MediaPicker({ token, onPick, onClose }: { token: string; onPick: (url: string) => void; onClose: () => void }) {
  const [files, setFiles] = useState<{ filename: string; url: string }[]>([]);
  useEffect(() => {
    fetch('/api/media', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : []).then(setFiles).catch(() => {});
  }, []);
  return (
    <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-sm" style={{ borderRadius: 8 }}>
          <div className="modal-header border-bottom px-4 pt-3 pb-3">
            <h6 className="modal-title fw-semibold" style={{ fontSize: 14 }}>Media Seç</h6>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body px-4 pb-4">
            {files.length === 0 ? <div className="text-center py-4 text-muted" style={{ fontSize: 13 }}>Media yoxdur.</div> : (
              <div className="row g-2">
                {files.map(f => (
                  <div key={f.filename} className="col-4 col-md-3">
                    <div className="card border" style={{ borderRadius: 6, overflow: 'hidden', cursor: 'pointer' }} onClick={() => { onPick(window.location.origin + f.url); onClose(); }}>
                      <div style={{ height: 80, overflow: 'hidden' }}><img src={f.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                      <div style={{ padding: '4px 6px', fontSize: 9, color: '#6c757d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.filename}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsTab({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState({ ...EMPTY });
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'specs' | 'tags' | 'config'>('info');
  const [saving, setSaving]     = useState(false);
  const [specKey, setSpecKey]   = useState('');
  const [specVal, setSpecVal]   = useState('');
  const [mediaPicker, setMediaPicker] = useState<number | null>(null);
  const [imgPreviews, setImgPreviews] = useState<boolean[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);
  const toast = useToast();
  const varTypes = ['text', 'select', 'color', 'image', 'number', 'checkbox', 'radio', 'textarea'];
  
  const [metricSelector, setMetricSelector] = useState(false);
  const [productMetrics, setProductMetrics] = useState<any[]>([]);
  const [pendingMetricIds, setPendingMetricIds] = useState<string[]>([]);
  const [pendingMetrics, setPendingMetrics] = useState<any[]>([]);

  const loadMetrics = async (id: string) => {
    if (!id) return;
    const res = await fetch(`/api/products/${id}/metrics`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      setProductMetrics(await res.json());
    }
  };
  const configsContainerRef = useRef<HTMLDivElement>(null);
  const optionsRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (activeTab === 'config' && configsContainerRef.current) {
      const sortable = new Sortable(configsContainerRef.current, {
        animation: 150,
        handle: '.config-drag-handle',
        ghostClass: 'opacity-50',
        onEnd: (evt) => {
          if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
            setForm(f => {
              const newConf = [...(f.customizationConfig || [])];
              const [removed] = newConf.splice(evt.oldIndex!, 1);
              newConf.splice(evt.newIndex!, 0, removed);
              return { ...f, customizationConfig: newConf };
            });
          }
        }
      });
      return () => sortable.destroy();
    }
  }, [activeTab, form.customizationConfig?.length]);

  useEffect(() => {
    if (activeTab === 'config') {
      Object.keys(optionsRefs.current).forEach(idx => {
        const i = parseInt(idx);
        const el = optionsRefs.current[i];
        if (el) {
          const sortable = new Sortable(el, {
            animation: 150,
            handle: '.option-drag-handle',
            ghostClass: 'bg-light',
            onEnd: (evt) => {
              if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
                setForm(f => {
                  const nc = [...(f.customizationConfig || [])];
                  const opts = [...(nc[i].optionsJson || [])];
                  const [removed] = opts.splice(evt.oldIndex!, 1);
                  opts.splice(evt.newIndex!, 0, removed);
                  nc[i].optionsJson = opts;
                  return { ...f, customizationConfig: nc };
                });
              }
            }
          });
        }
      });
    }
  }, [activeTab, form.customizationConfig]);

  const addConfigItem = () => {
    const nc = [...(form.customizationConfig || []), { name: '', type: 'text' }];
    setForm({ ...form, customizationConfig: nc });
  };
  const rmConfigItem = (i: number) => {
    const nc = [...(form.customizationConfig || [])]; nc.splice(i, 1);
    setForm({ ...form, customizationConfig: nc });
  };
  const setConfigItem = (i: number, key: string, val: any) => {
    const nc = [...(form.customizationConfig || [])];
    nc[i] = { ...nc[i], [key]: val };
    
    // Auto populate initial empty option for array types
    if (key === 'type' && ['select', 'radio', 'checkbox'].includes(val) && !nc[i].optionsJson) {
      nc[i].optionsJson = [{ label: '', value: '' }];
    }
    setForm({ ...form, customizationConfig: nc });
  };

  const addOptionRow = (configIndex: number) => {
    const nc = [...(form.customizationConfig || [])];
    nc[configIndex].optionsJson = [...(nc[configIndex].optionsJson || []), { label: '', value: '' }];
    setForm({ ...form, customizationConfig: nc });
  };
  const rmOptionRow = (configIndex: number, optIndex: number) => {
    const nc = [...(form.customizationConfig || [])];
    nc[configIndex].optionsJson.splice(optIndex, 1);
    setForm({ ...form, customizationConfig: nc });
  };
  const setOptionRow = (configIndex: number, optIndex: number, key: string, val: string) => {
    const nc = [...(form.customizationConfig || [])];
    const opts = [...nc[configIndex].optionsJson];
    opts[optIndex] = { ...opts[optIndex], [key]: val };
    
    if (key === 'label' && (!opts[optIndex].value || opts[optIndex].value === opts[optIndex]._autoVal)) {
      const slug = val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      opts[optIndex].value = slug;
      opts[optIndex]._autoVal = slug;
    }
    nc[configIndex].optionsJson = opts;
    setForm({ ...form, customizationConfig: nc });
  };

  const addRule = () => {
    const m = { ...(form.metaobjects || {}) };
    m.rules = [...(m.rules || []), { condition: '', action: '' }];
    setForm({ ...form, metaobjects: m });
  };
  const rmRule = (i: number) => {
    const m = { ...(form.metaobjects || {}) };
    m.rules.splice(i, 1);
    setForm({ ...form, metaobjects: m });
  };
  const setRule = (i: number, key: string, val: string) => {
    const m = { ...(form.metaobjects || {}) };
    m.rules[i][key] = val;
    setForm({ ...form, metaobjects: m });
  };

  const setMeta = (k: string, v: any) => setForm(f => ({ ...f, metaobjects: { ...(f.metaobjects || {}), [k]: v } }));

  const fetchRates = async (base: string) => {
    try {
      const r = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`);
      if (r.ok) setExchangeRates((await r.json())[base]);
    } catch (e) { console.error('Rates error', e); }
  };

  useEffect(() => {
    if (activeTab === 'config') fetchRates(form.metaobjects?.currency || 'usd');
  }, [activeTab, form.metaobjects?.currency]);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/products');
    setProducts(r.ok ? await r.json() : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY, images: [''] });
    setShowModal(true);
  };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, category: p.category, description: p.description, technicalSpecs: { ...p.technicalSpecs }, images: p.images.length ? [...p.images] : [''], tags: [...p.tags], relatedProducts: [...p.relatedProducts], customizationConfig: p.customizationConfig || [], metaobjects: p.metaobjects || {} });
    loadMetrics(p.id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); setSpecKey(''); setSpecVal(''); setProductMetrics([]); setPendingMetricIds([]); setPendingMetrics([]); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, images: form.images.filter(Boolean), active: 1 };
      const res  = await fetch(editId ? `/api/products/${editId}` : '/api/products', {
        method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
      });
      if (!res.ok) { toast.error((await res.json()).error); return; }
      const savedProduct = await res.json();
      const pid = editId || savedProduct.id;
      // Attach pending metrics for new products
      if (pendingMetricIds.length > 0) {
        for (const metricId of pendingMetricIds) {
          await fetch(`/api/products/${pid}/metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ metric_id: metricId, position: 0 })
          });
        }
      }
      toast.success(editId ? 'Məhsul yeniləndi.' : 'Məhsul əlavə edildi.');
      await load(); closeModal();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" məhsulunu silmək istədiyinizə əminsiniz?`)) return;
    const r = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { toast.success('Məhsul silindi.'); await load(); }
    else toast.error('Silmək alınmadı.');
  };

  const handleToggle = async (p: Product) => {
    await fetch(`/api/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...p, active: p.active ? 0 : 1 }) });
    await load();
  };

  const setImage   = (i: number, v: string) => setForm(f => { const imgs = [...f.images]; imgs[i] = v; return { ...f, images: imgs }; });
  const addImage   = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const rmImage    = (i: number) => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }));
  const addSpec    = () => { if (!specKey.trim()) return; setForm(f => ({ ...f, technicalSpecs: { ...f.technicalSpecs, [specKey.trim()]: specVal.trim() } })); setSpecKey(''); setSpecVal(''); };
  const rmSpec     = (k: string) => setForm(f => { const s = { ...f.technicalSpecs }; delete s[k]; return { ...f, technicalSpecs: s }; });

  const filtered = products.filter(p =>
    [p.name, p.category, ...(p.tags||[])].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const tabBtn = (id: typeof activeTab, label: string) => (
    <button type="button" onClick={() => setActiveTab(id)}
      className={`btn btn-sm ${activeTab === id ? 'btn-danger' : 'btn-outline-secondary'} fw-semibold`}
      style={{ borderRadius: 8, fontSize: 11 }}>
      {label}
    </button>
  );

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-0 fw-bold">Məhsullar</h5>
          <div style={{ fontSize: 12, color: '#6c757d' }}>{products.length} məhsul</div>
        </div>
        <div className="d-flex gap-2">
          <button onClick={load} className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 6 }}><RefreshCw size={13} /></button>
          <button onClick={openCreate} className="btn btn-danger btn-sm fw-semibold d-flex align-items-center gap-2" style={{ borderRadius: 6, padding: '7px 14px' }}><Plus size={14} /> Yeni Məhsul</button>
        </div>
      </div>

      <div className="position-relative mb-4">
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
        <input className={inputCls} style={{ borderRadius: 6, paddingLeft: 30 }} placeholder="Ad, kateqoriya, teq..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" style={{ width: 28, height: 28 }} /></div>
      ) : (
        <div className="row g-3">
          {filtered.map(p => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <div className="card border h-100" style={{ borderRadius: 8, overflow: 'hidden', opacity: p.active ? 1 : 0.5 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}>
                <div style={{ height: 130, background: '#f8f9fa', overflow: 'hidden', position: 'relative' }}>
                  {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="d-flex align-items-center justify-content-center h-100 text-muted"><Package size={32} /></div>}
                  {!p.active && <span style={{ position: 'absolute', top: 8, right: 8, background: '#dc3545', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 20, padding: '2px 8px' }}>Deaktiv</span>}
                  {p.category && <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 20, padding: '2px 8px' }}>{p.category}</span>}
                </div>
                <div className="p-3">
                  <div className="fw-bold mb-1" style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  {p.tags?.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {p.tags.slice(0, 3).map(tag => <span key={tag} className="badge" style={{ background: '#f1f3f5', color: '#6c757d', fontWeight: 500, fontSize: 9, borderRadius: 20 }}>{tag}</span>)}
                    </div>
                  )}
                  <div className="d-flex gap-1">
                    <button onClick={() => openEdit(p)} className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: 5, fontSize: 11 }}><Pencil size={11} /> Düzəlt</button>
                    <button onClick={() => handleToggle(p)} className={`btn btn-sm ${p.active ? 'btn-outline-warning' : 'btn-outline-success'} d-flex align-items-center`} style={{ borderRadius: 5, padding: '4px 8px' }}><Eye size={12} /></button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 5, padding: '4px 8px' }}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-12 text-center py-5 text-muted"><Package size={36} style={{ marginBottom: 12, opacity: 0.3 }} /><div>Məhsul tapılmadı</div></div>}
        </div>
      )}

      {/* Modal Overlay to prevent clicking outside, we will use static backdrop in bootstrap logic or just stop propagation */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={closeModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-sm" style={{ borderRadius: 10 }}>
              <div className="modal-header border-bottom px-4 pt-3 pb-3">
                <h6 className="mb-0 fw-semibold" style={{ fontSize: 15 }}>{editId ? 'Məhsulu Düzəlt' : 'Yeni Məhsul'}</h6>
                <button className="btn-close" onClick={closeModal} />
              </div>

              {/* BODY (Smooth Scrollable Content) */}
              <div className="modal-body p-0">
                <form id="productForm" onSubmit={handleSubmit} className="d-flex flex-column gap-3 p-4">
                  
                  {/* BASIC INFO */}
                  <div className="border rounded p-3" style={{ borderRadius: 8 }}>
                    <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}><Package size={13}/> Əsas Məlumatlar</h6>
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label fw-semibold text-secondary" style={{ fontSize: 12 }}>Məhsul Adı *</label>
                        <input required className={inputCls} style={{ borderRadius: 6, padding: '7px 10px' }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Məs: LED Ekran 3×4m" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary" style={{ fontSize: 12 }}>Kateqoriya *</label>
                        <input required className={inputCls} style={{ borderRadius: 6, padding: '7px 10px' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="LED, Səs, Səhnə..." />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold text-secondary" style={{ fontSize: 12 }}>Təsvir</label>
                        <textarea className="form-control form-control-sm" style={{ borderRadius: 6, resize: 'none', padding: '7px 10px' }} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Məhsul haqqında geniş məlumat..." />
                      </div>
                    </div>
                  </div>

                  {/* IMAGES */}
                  <div className="border rounded p-3" style={{ borderRadius: 8 }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                      <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}><ImageIcon size={13}/> Şəkillər</h6>
                      <span className="badge bg-light text-secondary border mt-2 mt-sm-0" style={{ fontSize: 10, fontWeight: 500 }}>{form.images.filter(Boolean).length} şəkil</span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="d-flex flex-column flex-sm-row gap-3 align-items-start">
                          <div className="flex-grow-1 w-100">
                            <div className="input-group input-group-sm">
                              <button type="button" className="btn btn-light border px-2 px-sm-3" onClick={() => setMediaPicker(idx)} title="Mediadan seç"><ImageIcon size={14} className="text-secondary" /></button>
                              <input className="form-control" style={{ fontSize: 12, padding: '8px 12px' }} value={img} onChange={e => setImage(idx, e.target.value)} placeholder="Şəkil URL-i daxil edin..." />
                              <button type="button" className="btn btn-light border px-2 px-sm-3" onClick={() => setImgPreviews(p => { const n = [...p]; n[idx] = !n[idx]; return n; })} title="Önizləmə">{imgPreviews[idx] ? <EyeOff size={14} className="text-secondary" /> : <Eye size={14} className="text-secondary" />}</button>
                              {form.images.length > 1 && <button type="button" className="btn btn-outline-danger px-2 px-sm-3" onClick={() => rmImage(idx)}><X size={14} /></button>}
                            </div>
                            {imgPreviews[idx] && img && <div className="mt-2 shadow-sm" style={{ height: 100, width: '100%', borderRadius: 8, overflow: 'hidden', border: '1px solid #dee2e6' }}><img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display='none')} /></div>}
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addImage} className="btn btn-sm w-100" style={{ border: '1px dashed #ced4da', color: '#6b7280', fontSize: 12, borderRadius: 6, padding: '7px' }}><Plus size={13} className="me-1"/> Şəkil əlavə et</button>
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* SPECS */}
                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100" style={{ borderRadius: 8 }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}><Settings size={13}/> Texniki Xüsusiyyətlər</h6>
                          <span className="badge bg-light text-secondary border" style={{ fontSize: 10, fontWeight: 500 }}>{Object.keys(form.technicalSpecs).length}</span>
                        </div>
                        <div className="input-group input-group-sm mb-3">
                          <input className="form-control" style={{ fontSize: 12, padding: '8px' }} value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="Məs: Güc" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())} />
                          <input className="form-control" style={{ fontSize: 12, padding: '8px' }} value={specVal} onChange={e => setSpecVal(e.target.value)} placeholder="Məs: 1000W" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())} />
                          <button type="button" onClick={addSpec} className="btn btn-primary px-3"><Plus size={14} /></button>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          {Object.entries(form.technicalSpecs).map(([k, v]) => (
                            <div key={k} className="d-flex align-items-center gap-2 p-1 border rounded">
                              <input className="form-control form-control-sm border-0 bg-transparent fw-semibold text-secondary" style={{ fontSize: 11, flex: '0 0 40%', boxShadow: 'none' }} value={k} readOnly />
                              <input className="form-control form-control-sm border" style={{ fontSize: 11, flex: 1, borderRadius: 4 }} value={v} onChange={e => setForm(f => ({ ...f, technicalSpecs: { ...f.technicalSpecs, [k]: e.target.value } }))} />
                              <button type="button" onClick={() => rmSpec(k)} className="btn btn-sm btn-link text-danger p-1"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* TAGS */}
                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100" style={{ borderRadius: 8 }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}><Tag size={13}/> Teqlər</h6>
                          <span className="badge bg-light text-secondary border" style={{ fontSize: 10, fontWeight: 500 }}>{form.tags.length}</span>
                        </div>
                        <input className="form-control form-control-sm mb-3" style={{ fontSize: 12, padding: '8px' }} value={form.tags.join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} placeholder="LED, Outdoor... (vergüllə ayır)" />
                        <div className="d-flex flex-wrap gap-2">
                          {form.tags.map((tag, i) => (
                            <span key={i} className="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle d-flex align-items-center gap-1" style={{ fontSize: 10, padding: '4px 8px' }}>
                              {tag} <X size={12} className="ms-1" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONFIG & METAOBJECTS */}
                  <div className="border rounded p-3" style={{ borderRadius: 8 }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                      <div>
                        <h6 className="fw-semibold mb-1 d-flex align-items-center gap-2" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}><Settings size={13}/> Dinamik Metriklər</h6>
                        <div style={{ fontSize: 11, color: '#6c757d' }}>Məhsula özəl variantlar və konfiqurasiyalar</div>
                      </div>
                      <button type="button" onClick={() => setMetricSelector(true)} className="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center gap-2" style={{ borderRadius: 6, fontSize: 11, padding: '5px 12px' }}><Plus size={13} /> Metrik Əlavə Et</button>
                    </div>

                    {/* ATTACHED METRICS */}
                    <div className="d-flex flex-column gap-2 mb-4">
                      {productMetrics.map((pm: any) => (
                        <div key={pm.id} className="border rounded overflow-hidden d-flex justify-content-between align-items-center p-2" style={{ borderColor: '#dee2e6' }}>
                          <div className="d-flex align-items-center gap-2">
                            <GripVertical size={16} className="text-muted ms-1 cursor-grab" />
                            <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{pm.metric.name}</div>
                            <div className="badge bg-secondary opacity-75" style={{ fontSize: 10 }}>{pm.metric.var_type}</div>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="button" className="btn btn-sm btn-light border" style={{ padding: '4px 8px' }} title="Tənzimləmələr (Override)">
                              <Settings size={14} className="text-secondary" />
                            </button>
                            <button type="button" className="btn btn-sm btn-light border text-danger" style={{ padding: '4px 8px' }} onClick={async () => {
                              if (!window.confirm('Bu metriki məhsuldan silmək istədiyinizə əminsiniz?')) return;
                              await fetch(`/api/products/${editId}/metrics/${pm.metric_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                              loadMetrics(editId!);
                            }}>
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {/* Pending metrics for new (unsaved) products */}
                      {pendingMetrics.map((m: any) => (
                        <div key={m.id} className="border rounded overflow-hidden d-flex justify-content-between align-items-center p-2" style={{ borderColor: '#dee2e6' }}>
                          <div className="d-flex align-items-center gap-2">
                            <GripVertical size={16} className="text-muted ms-1" />
                            <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{m.name}</div>
                            <div className="badge bg-secondary opacity-75" style={{ fontSize: 10 }}>{m.var_type}</div>
                            <div className="badge bg-warning text-dark" style={{ fontSize: 9 }}>Gözləmədə</div>
                          </div>
                          <button type="button" className="btn btn-sm btn-light border text-danger" style={{ padding: '4px 8px' }} onClick={() => {
                            setPendingMetricIds(prev => prev.filter(id => id !== m.id));
                            setPendingMetrics(prev => prev.filter(pm => pm.id !== m.id));
                          }}><X size={14} /></button>
                        </div>
                      ))}
                      {productMetrics.length === 0 && pendingMetrics.length === 0 && (
                        <div className="text-center text-muted py-4" style={{ fontSize: 12, border: '1px dashed #ced4da', borderRadius: 6 }}>
                          Hələ heç bir metrik əlavə edilməyib.
                        </div>
                      )}
                    </div>

                    <div className="row g-4 border-top pt-4">
                      <div className="col-md-6">
                        <label className="form-label text-dark fw-semibold" style={{ fontSize: 12 }}>Price & Currency (Qiymət və Valyuta)</label>
                        <div className="input-group">
                          <input type="number" step="0.01" className="form-control form-control-sm fw-semibold" style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }} value={form.metaobjects?.pricing || '0.00'} onChange={e => setMeta('pricing', e.target.value)} />
                          <select className="form-select form-select-sm text-secondary" style={{ maxWidth: 90, borderTopRightRadius: 6, borderBottomRightRadius: 6 }} value={form.metaobjects?.currency || 'usd'} onChange={e => { setMeta('currency', e.target.value); fetchRates(e.target.value); }}>
                            <option value="usd">USD</option><option value="eur">EUR</option><option value="try">TRY</option><option value="azn">AZN</option><option value="gbp">GBP</option>
                          </select>
                        </div>
                        {form.metaobjects?.pricing > 0 && exchangeRates && (
                          <div className="mt-3 p-3 bg-light rounded border">
                            <div className="fw-semibold text-primary mb-2 border-bottom pb-2 d-flex align-items-center gap-2" style={{ fontSize: 11 }}><RefreshCw size={12}/> Converted Prices (Avtomatik Çevrilmə)</div>
                            <div className="row g-2">
                              {['usd', 'eur', 'try', 'azn', 'gbp'].filter(c => c !== (form.metaobjects?.currency || 'usd')).map(c => (
                                <div key={c} className="col-6">
                                  <div className="p-2 rounded bg-white border d-flex justify-content-between align-items-center" style={{ fontSize: 12 }}>
                                    <span className="text-uppercase fw-bold text-secondary">{c}:</span> <span className="text-dark fw-semibold">{(parseFloat(form.metaobjects.pricing) * exchangeRates[c]).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-dark fw-semibold" style={{ fontSize: 12 }}>Display Settings (Görünüş)</label>
                        <select className="form-select form-select-sm" style={{ borderRadius: 6 }} value={form.metaobjects?.displaySettings || 'default'} onChange={e => setMeta('displaySettings', e.target.value)}>
                          <option value="default">Default Layout (Standart)</option>
                          <option value="grid">Grid Layout (Şəbəkə)</option>
                          <option value="list">List Layout (Siyahı)</option>
                        </select>
                      </div>
                    </div>

                  </div>
                </form>
              </div>

              {/* FOOTER */}
              <div className="modal-footer border-top py-3 px-4 gap-2">
                <button type="button" onClick={closeModal} className="btn btn-sm btn-light border px-4" style={{ borderRadius: 6 }}>Ləğv Et</button>
                <button type="submit" form="productForm" disabled={saving} className="btn btn-sm btn-danger fw-semibold d-flex align-items-center gap-2 px-4" style={{ borderRadius: 6 }}>
                  <Check size={16} /> {saving ? 'Saxlanır...' : editId ? 'Yenilə və Yadda Saxla' : 'Məhsulu Əlavə Et'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {metricSelector && <MetricSelector token={token} productId={editId} onAttach={(metricId?: string) => {
        if (!editId && metricId) {
          // New product - store pending metrics
          setPendingMetricIds(prev => [...prev, metricId]);
          fetch(`/api/metrics/${metricId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).then(m => setPendingMetrics(prev => [...prev, m]));
        } else {
          loadMetrics(editId!);
        }
      }} onClose={() => setMetricSelector(false)} />}
      {mediaPicker !== null && <MediaPicker token={token} onPick={url => setImage(mediaPicker!, url)} onClose={() => setMediaPicker(null)} />}
    </div>
  );
}