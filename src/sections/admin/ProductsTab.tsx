import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, X, Check, Image as ImageIcon, Tag, Search, RefreshCw, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useToast } from '../../components/Toast';

interface Product {
  id: string; name: string; category: string; description: string;
  technicalSpecs: Record<string, string>; images: string[]; tags: string[];
  relatedProducts: string[]; active: number; sort_order: number;
}

const EMPTY: Omit<Product, 'id' | 'active' | 'sort_order'> = {
  name: '', category: '', description: '', technicalSpecs: {}, images: [''], tags: [], relatedProducts: [],
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
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>
          <div className="modal-header border-0 px-4 pt-4 pb-2">
            <h6 className="modal-title fw-bold">Media Seç</h6>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body px-4 pb-4">
            {files.length === 0 ? <div className="text-center py-4 text-muted" style={{ fontSize: 13 }}>Media yoxdur.</div> : (
              <div className="row g-2">
                {files.map(f => (
                  <div key={f.filename} className="col-4 col-md-3">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }} onClick={() => { onPick(window.location.origin + f.url); onClose(); }}>
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
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'specs' | 'tags'>('info');
  const [saving, setSaving]     = useState(false);
  const [specKey, setSpecKey]   = useState('');
  const [specVal, setSpecVal]   = useState('');
  const [mediaPicker, setMediaPicker] = useState<number | null>(null);
  const [imgPreviews, setImgPreviews] = useState<boolean[]>([]);
  const toast = useToast();
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

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
    setActiveTab('info'); setShowModal(true);
  };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, category: p.category, description: p.description, technicalSpecs: { ...p.technicalSpecs }, images: p.images.length ? [...p.images] : [''], tags: [...p.tags], relatedProducts: [...p.relatedProducts] });
    setActiveTab('info'); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); setSpecKey(''); setSpecVal(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, images: form.images.filter(Boolean), active: 1 };
      const res  = await fetch(editId ? `/api/products/${editId}` : '/api/products', {
        method: editId ? 'PUT' : 'POST', headers: h, body: JSON.stringify(body),
      });
      if (!res.ok) { toast.error((await res.json()).error); return; }
      toast.success(editId ? 'Məhsul yeniləndi.' : 'Məhsul əlavə edildi.');
      await load(); closeModal();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" məhsulunu silmək istədiyinizə əminsiniz?`)) return;
    const r = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: h });
    if (r.ok) { toast.success('Məhsul silindi.'); await load(); }
    else toast.error('Silmək alınmadı.');
  };

  const handleToggle = async (p: Product) => {
    await fetch(`/api/products/${p.id}`, { method: 'PUT', headers: h, body: JSON.stringify({ ...p, active: p.active ? 0 : 1 }) });
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
          <button onClick={load} className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 10 }}><RefreshCw size={13} /></button>
          <button onClick={openCreate} className="btn btn-danger btn-sm fw-semibold d-flex align-items-center gap-2" style={{ borderRadius: 10, padding: '8px 16px' }}><Plus size={14} /> Yeni Məhsul</button>
        </div>
      </div>

      <div className="position-relative mb-4">
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
        <input className={inputCls} style={{ borderRadius: 10, paddingLeft: 30 }} placeholder="Ad, kateqoriya, teq..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" style={{ width: 28, height: 28 }} /></div>
      ) : (
        <div className="row g-3">
          {filtered.map(p => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14, overflow: 'hidden', opacity: p.active ? 1 : 0.5 }}
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
                    <button onClick={() => openEdit(p)} className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: 8, fontSize: 11 }}><Pencil size={11} /> Düzəlt</button>
                    <button onClick={() => handleToggle(p)} className={`btn btn-sm ${p.active ? 'btn-outline-warning' : 'btn-outline-success'} d-flex align-items-center`} style={{ borderRadius: 8, padding: '4px 8px' }}><Eye size={12} /></button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '4px 8px' }}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-12 text-center py-5 text-muted"><Package size={36} style={{ marginBottom: 12, opacity: 0.3 }} /><div>Məhsul tapılmadı</div></div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 18 }}>
              <div className="modal-header border-0 px-4 pt-4 pb-2">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: editId ? '#fff3cd' : '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {editId ? <Pencil size={18} color="#664d03" /> : <Plus size={18} color="#e30613" />}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{editId ? 'Məhsulu Düzəlt' : 'Yeni Məhsul'}</h6>
                    <div style={{ fontSize: 11, color: '#6c757d' }}>{editId || 'Yeni məhsul əlavə et'}</div>
                  </div>
                </div>
                <button className="btn-close" onClick={closeModal} />
              </div>

              <div className="d-flex gap-2 px-4 pt-2 pb-0">
                {tabBtn('info', 'Məlumat')}
                {tabBtn('images', `Şəkillər (${form.images.filter(Boolean).length})`)}
                {tabBtn('specs', `Texniki (${Object.keys(form.technicalSpecs).length})`)}
                {tabBtn('tags', `Teqlər (${form.tags.length})`)}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body px-4 py-3" style={{ minHeight: 320 }}>
                  {activeTab === 'info' && (
                    <div className="d-flex flex-column gap-3">
                      <div className="row g-3">
                        <div className="col-md-8">
                          <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Məhsul Adı *</label>
                          <input required className={inputCls} style={{ borderRadius: 9 }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Məs: LED Ekran 3×4m" />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Kateqoriya *</label>
                          <input required className={inputCls} style={{ borderRadius: 9 }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="LED, Səs, Səhnə..." />
                        </div>
                      </div>
                      <div>
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Təsvir</label>
                        <textarea className="form-control form-control-sm" style={{ borderRadius: 9, resize: 'none' }} rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Məhsul haqqında məlumat..." />
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 align-self-start" style={{ borderRadius: 8, fontSize: 11 }} onClick={() => setActiveTab('images')}>
                        Şəkillərə keç <ChevronRight size={12} />
                      </button>
                    </div>
                  )}

                  {activeTab === 'images' && (
                    <div className="d-flex flex-column gap-3">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="card border-0 bg-light p-3" style={{ borderRadius: 12 }}>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <label className="form-label fw-semibold mb-0" style={{ fontSize: 12 }}>Şəkil {idx + 1}</label>
                            <div className="d-flex gap-1">
                              <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 8px' }} onClick={() => setMediaPicker(idx)}><ImageIcon size={12} /></button>
                              <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 8px' }} onClick={() => setImgPreviews(p => { const n = [...p]; n[idx] = !n[idx]; return n; })}>{imgPreviews[idx] ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                              {form.images.length > 1 && <button type="button" className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 8px' }} onClick={() => rmImage(idx)}><X size={12} /></button>}
                            </div>
                          </div>
                          <input className={inputCls} style={{ borderRadius: 9 }} value={img} onChange={e => setImage(idx, e.target.value)} placeholder="https://..." />
                          {imgPreviews[idx] && img && <div style={{ height: 120, borderRadius: 9, overflow: 'hidden', marginTop: 8, border: '1px solid #dee2e6' }}><img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display='none')} /></div>}
                        </div>
                      ))}
                      <button type="button" onClick={addImage} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 align-self-start" style={{ borderRadius: 9, fontSize: 11 }}><Plus size={12} /> Şəkil əlavə et</button>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div>
                      <div className="row g-2 mb-3">
                        <div className="col-5"><input className={inputCls} style={{ borderRadius: 9 }} value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="Xüsusiyyət (məs: Güc)" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())} /></div>
                        <div className="col-5"><input className={inputCls} style={{ borderRadius: 9 }} value={specVal} onChange={e => setSpecVal(e.target.value)} placeholder="Dəyər (məs: 1000W)" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())} /></div>
                        <div className="col-2"><button type="button" onClick={addSpec} className="btn btn-sm btn-danger w-100 d-flex align-items-center justify-content-center" style={{ borderRadius: 9 }}><Plus size={13} /></button></div>
                      </div>
                      {Object.entries(form.technicalSpecs).length === 0 ? (
                        <div className="text-muted text-center py-4" style={{ fontSize: 12 }}>Texniki xüsusiyyət yoxdur. Yuxarıdan əlavə edin.</div>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          {Object.entries(form.technicalSpecs).map(([k, v]) => (
                            <div key={k} className="d-flex align-items-center gap-2 p-2 bg-light rounded" style={{ borderRadius: 9 }}>
                              <input
                                className="form-control form-control-sm fw-semibold"
                                style={{ borderRadius: 8, fontSize: 12, minWidth: 0, flex: '0 0 40%', border: '1px solid #dee2e6' }}
                                value={k}
                                onChange={e => {
                                  const newKey = e.target.value;
                                  setForm(f => {
                                    const entries = Object.entries(f.technicalSpecs);
                                    const updated: Record<string, string> = {};
                                    entries.forEach(([ek, ev]) => { updated[ek === k ? newKey : ek] = ev; });
                                    return { ...f, technicalSpecs: updated };
                                  });
                                }}
                              />
                              <input
                                className="form-control form-control-sm"
                                style={{ borderRadius: 8, fontSize: 12, flex: 1, border: '1px solid #dee2e6' }}
                                value={v}
                                onChange={e => setForm(f => ({ ...f, technicalSpecs: { ...f.technicalSpecs, [k]: e.target.value } }))}
                              />
                              <button type="button" onClick={() => rmSpec(k)} className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 6px' }}><X size={11} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tags' && (
                    <div>
                      <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Teqlər (vergüllə ayır, Enter ilə əlavə et)</label>
                      <input className={inputCls} style={{ borderRadius: 9 }} value={form.tags.join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} placeholder="LED, Outdoor, Kiçik ölçü..." />
                      {form.tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {form.tags.map((tag, i) => (
                            <span key={i} className="badge d-flex align-items-center gap-1" style={{ background: '#fff0f0', color: '#e30613', borderRadius: 20, padding: '6px 12px', fontSize: 11, fontWeight: 600 }}>
                              {tag}
                              <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e30613', display: 'flex', alignItems: 'center' }}><X size={10} /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="modal-footer border-top py-3 px-4 gap-2">
                  <button type="button" onClick={closeModal} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 9 }}>Ləğv Et</button>
                  <button type="submit" disabled={saving} className="btn btn-sm btn-danger fw-semibold d-flex align-items-center gap-1" style={{ borderRadius: 9 }}>
                    <Check size={13} /> {saving ? 'Saxlanır...' : editId ? 'Yenilə' : 'Əlavə et'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {mediaPicker !== null && <MediaPicker token={token} onPick={url => setImage(mediaPicker!, url)} onClose={() => setMediaPicker(null)} />}
    </div>
  );
}