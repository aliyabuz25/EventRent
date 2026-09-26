import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useSiteContent } from '../content.context';
import { t } from '../content';
import { Locale, LocalizedText, LocalizedTextArray, SiteContent } from '../types';
import { Save, RefreshCw, Pencil, X, Plus, Trash2, Eye, EyeOff, Check, ImageIcon, History, RotateCcw, Video, Upload, Link } from 'lucide-react';
import { useToast } from './Toast';

const LANGS: Locale[] = ['az', 'en', 'ru', 'tr'];
type Section = 'home' | 'about' | 'services' | 'contact' | 'footer' | 'portfolio';

interface ContentStudioProps { section?: Section; className?: string; }

function cloneContent(c: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(c)) as SiteContent;
}
function buildTextUpdater(locale: Locale) {
  return (target: LocalizedText, value: string): LocalizedText => ({ ...target, [locale]: value });
}
function buildTextArrayUpdater(locale: Locale) {
  return (target: LocalizedTextArray, value: string): LocalizedTextArray => ({
    ...target,
    [locale]: value.split('\n').map(l => l.trim()).filter(Boolean),
  });
}

/* ── primitives ── */
const inputCls = 'form-control form-control-sm';
const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6c757d', marginBottom: 4, display: 'block' };
const subCardStyle: React.CSSProperties = { background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 10, padding: 14, marginBottom: 10 };
const badgeStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#e30613' : '#f1f3f5',
  color: active ? '#fff' : '#495057',
  border: `1px solid ${active ? '#e30613' : '#dee2e6'}`,
  borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700,
  cursor: 'pointer', transition: 'all 0.15s',
});

function FL({ label, locale, value, onChange, multiline, rows = 3 }: {
  label: string; locale: Locale; value: LocalizedText;
  onChange: (v: string) => void; multiline?: boolean; rows?: number;
}) {
  return (
    <div>
      <label style={labelStyle}>{label} <span style={{ color: '#e30613' }}>[{locale}]</span></label>
      {multiline
        ? <textarea rows={rows} className={inputCls} style={{ resize: 'none', borderRadius: 8 }} value={value[locale]} onChange={e => onChange(e.target.value)} />
        : <input className={inputCls} style={{ borderRadius: 8 }} value={value[locale]} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

function PlainField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input className={inputCls} style={{ borderRadius: 8 }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ImgField({ label, value, onChange, token }: { label: string; value: string; onChange: (v: string) => void; token?: string }) {
  const [show, setShow] = useState(true);
  const [mediaPicker, setMediaPicker] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ filename: string; url: string }[]>([]);

  const openPicker = async () => {
    setMediaPicker(true);
    try {
      const res = await fetch('/api/media', token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      if (res.ok) setMediaFiles(await res.json());
    } catch {}
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div className="d-flex gap-2">
        <input className={inputCls} style={{ borderRadius: 8 }} value={value} onChange={e => onChange(e.target.value)} placeholder="https://..." />
        <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 8, flexShrink: 0 }} onClick={openPicker} title="Media seç">
          <ImageIcon size={13} />
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: 8, flexShrink: 0 }} onClick={() => setShow(v => !v)}>
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
      {show && value && (
        <div style={{ height: 100, borderRadius: 8, overflow: 'hidden', marginTop: 6, border: '1px solid #dee2e6' }}>
          <img src={value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" onError={e => (e.currentTarget.style.display = 'none')} />
        </div>
      )}
      {mediaPicker && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setMediaPicker(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0 px-4 pt-4 pb-2">
                <h6 className="modal-title fw-bold">Media Seç</h6>
                <button className="btn-close" onClick={() => setMediaPicker(false)} />
              </div>
              <div className="modal-body px-4 pb-4">
                {mediaFiles.length === 0 ? (
                  <div className="text-center py-4 text-muted" style={{ fontSize: 13 }}>Media tapılmadı. Əvvəlcə Media tabında fayl yükləyin.</div>
                ) : (
                  <div className="row g-2">
                    {mediaFiles.map(f => (
                      <div key={f.filename} className="col-4 col-md-3">
                        <div
                          className="card border-0"
                          style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: value === f.url ? '2px solid #e30613' : '2px solid transparent', transition: 'border 0.1s' }}
                          onClick={() => { onChange(window.location.origin + f.url); setMediaPicker(false); }}
                        >
                          <div style={{ height: 80, background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <img src={f.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
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
      )}
    </div>
  );
}

function VideoField({ label, value, onChange, token }: { label: string; value: string; onChange: (v: string) => void; token?: string }) {
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const isVideo = (v: string) => /\.(mp4|webm|mov|avi)/i.test(v);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        onChange(window.location.origin + data.url);
      } else {
        setUploadErr(data.error || 'Yükleme xətası');
      }
    } catch {
      setUploadErr('Şəbəkə xətası');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div className="d-flex gap-1 mb-2">
        <button type="button" className={`btn btn-sm ${tab === 'url' ? 'btn-dark' : 'btn-outline-secondary'}`} style={{ borderRadius: 8, fontSize: 11 }} onClick={() => setTab('url')}>
          <Link size={11} className="me-1" /> URL
        </button>
        <button type="button" className={`btn btn-sm ${tab === 'upload' ? 'btn-dark' : 'btn-outline-secondary'}`} style={{ borderRadius: 8, fontSize: 11 }} onClick={() => setTab('upload')}>
          <Upload size={11} className="me-1" /> Yüklə
        </button>
      </div>
      {tab === 'url' ? (
        <input className={inputCls} style={{ borderRadius: 8 }} value={value} onChange={e => onChange(e.target.value)} placeholder="https://... və ya /uploads/video.mp4" />
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/mov,.mp4,.webm,.mov,.avi"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary w-100"
            style={{ borderRadius: 8, fontSize: 12 }}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Yüklənir...' : <><Upload size={12} className="me-1" /> Video seç (mp4, webm, mov)</>}
          </button>
          {uploadErr && <div style={{ color: '#e30613', fontSize: 11, marginTop: 4 }}>{uploadErr}</div>}
        </div>
      )}
      {value && (
        <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid #dee2e6', background: '#000' }}>
          {isVideo(value) ? (
            <video src={value} controls style={{ width: '100%', maxHeight: 160, display: 'block' }} />
          ) : (
            <div style={{ padding: 8, fontSize: 11, color: '#6c757d', wordBreak: 'break-all' }}>
              <Video size={12} className="me-1" />{value}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Card({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: 14, overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-100 d-flex align-items-center justify-content-between px-4 py-3 border-0 bg-white"
        style={{ cursor: 'pointer', transition: 'background 0.15s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8f9fa'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
      >
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#495057' }}>{title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: open ? '#e30613' : '#adb5bd', fontWeight: 600, transition: 'color 0.15s' }}>
          {open ? <><X size={13} /> Bağla</> : <><Pencil size={11} /> Düzəlt</>}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid #f1f3f5' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function G2({ children }: { children: React.ReactNode }) {
  return <div className="row g-3">{React.Children.map(children, c => <div className="col-md-6">{c}</div>)}</div>;
}
function G3({ children }: { children: React.ReactNode }) {
  return <div className="row g-3">{React.Children.map(children, c => <div className="col-md-4">{c}</div>)}</div>;
}

/* ══════════════════ MAIN ══════════════════ */
export default function ContentStudio({ section = 'home', className }: ContentStudioProps) {
  const { content, setContent, locale, reloadContent } = useSiteContent();
  const [editorLocale, setEditorLocale] = useState<Locale>(locale);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showBackups, setShowBackups] = useState(false);
  const [backups, setBackups] = useState<{ filename: string; size: number; created_at: string }[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [restoringFile, setRestoringFile] = useState<string | null>(null);
  const token = localStorage.getItem('er_admin_token') || '';
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(content.services.categories[0]?.id || '');
  const toast = useToast();
  const saveMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCategory = useMemo(
    () => content.services.categories.find(c => c.id === selectedCategoryId) ?? null,
    [content.services.categories, selectedCategoryId]
  );

  const upd = (fn: (c: SiteContent) => SiteContent) => { setContent(prev => fn(cloneContent(prev))); setIsDirty(true); };
  const setText = buildTextUpdater(editorLocale);
  const setArr = buildTextArrayUpdater(editorLocale);

  const loadBackups = useCallback(async () => {
    setLoadingBackups(true);
    try {
      const r = await fetch('/api/content/backups', { headers: { Authorization: `Bearer ${token}` } });
      setBackups(r.ok ? await r.json() : []);
    } catch { setBackups([]); }
    setLoadingBackups(false);
  }, [token]);

  const handleRestore = async (filename: string) => {
    if (!window.confirm(`"${filename}" faylından bərpa edilsin? Mövcud məzmun backup edilib saxlanacaq.`)) return;
    setRestoringFile(filename);
    try {
      const r = await fetch(`/api/content/restore/${encodeURIComponent(filename)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) { toast.success('Bərpa edildi! Səhifə yenilənir...'); setTimeout(() => window.location.reload(), 1000); }
      else toast.error('Bərpa alınmadı.');
    } catch { toast.error('Server xətası.'); }
    setRestoringFile(null);
  };

  const showMsg = useCallback((msg: string) => {
    setSaveMsg(msg);
    if (saveMsgTimer.current) clearTimeout(saveMsgTimer.current);
    saveMsgTimer.current = setTimeout(() => setSaveMsg(null), 3000);
  }, []);

  const saveContent = async () => {
    setIsSaving(true); setSaveMsg(null);
    try {
      const res = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(content) });
      if (res.ok) { toast.success('Məzmun saxlandı!'); showMsg('✓ Yadda saxlandı.'); setIsDirty(false); }
      else { toast.error('Saxlama xətası.'); showMsg('✗ Xəta baş verdi.'); }
    } catch { toast.error('Serverə qoşulma alınmadı.'); showMsg('✗ Xəta.'); }
    finally { setIsSaving(false); }
  };

  const topBar = (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
      <div className="card-body py-3 px-4 d-flex flex-wrap align-items-center gap-3">
        <div className="me-auto">
          <div style={{ fontWeight: 700, fontSize: 14, color: '#212529' }}>
            Content Studio — {section.charAt(0).toUpperCase() + section.slice(1)}
          </div>
          <div style={{ fontSize: 11, color: '#6c757d' }}>AZ / EN / RU / TR dillərini ayrı-ayrı redaktə edin</div>
        </div>
        <div className="d-flex gap-1 p-1 rounded-3" style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}>
          {LANGS.map(lang => (
            <button key={lang} type="button" onClick={() => setEditorLocale(lang)}
              style={badgeStyle(editorLocale === lang)}>
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        {isDirty && <span style={{ fontSize: 11, fontWeight: 700, color: '#e30613', background: '#fff0f0', borderRadius: 8, padding: '3px 10px', border: '1px solid #ffd6d6' }}>● Saxlanılmamış dəyişikliklər</span>}
        <button onClick={saveContent} disabled={isSaving} className={`btn btn-sm fw-semibold d-flex align-items-center gap-1 ${isDirty ? 'btn-danger' : 'btn-outline-secondary'}`} style={{ borderRadius: 9 }}>
          <Save size={12} /> {isSaving ? 'Saxlanır...' : 'Saxla'}
        </button>
        <button onClick={async () => { if (isDirty && !window.confirm('Saxlanılmamış dəyişikliklər itirilər. Davam et?')) return; await reloadContent(); setIsDirty(false); showMsg('↺ Yeniləndi.'); }} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" style={{ borderRadius: 9 }}>
          <RefreshCw size={12} /> Yenilə
        </button>
        <button onClick={() => { setShowBackups(true); loadBackups(); }} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" style={{ borderRadius: 9 }}>
          <History size={12} /> Backuplar
        </button>
        {saveMsg && <span style={{ fontSize: 12, fontWeight: 600, color: saveMsg.startsWith('✓') ? '#198754' : saveMsg.startsWith('↺') ? '#0d6efd' : '#dc3545' }}>{saveMsg}</span>}
      </div>
    </div>
  );

  /* ══ HOME ══ */
  if (section === 'home') return (
    <div className={className}>
      {topBar}
      <div className="d-flex flex-column gap-3">

        <Card title="Hero">
          <G2>
            <FL label="Başlıq 1" value={content.home.hero.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.home.hero.titleLine1 = setText(c.home.hero.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.home.hero.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.home.hero.titleLine2 = setText(c.home.hero.titleLine2, v); return c; })} />
            <FL label="Başlıq 3" value={content.home.hero.titleLine3} locale={editorLocale} onChange={v => upd(c => { c.home.hero.titleLine3 = setText(c.home.hero.titleLine3, v); return c; })} />
            <FL label="Subtitle" value={content.home.hero.subtitle} locale={editorLocale} multiline onChange={v => upd(c => { c.home.hero.subtitle = setText(c.home.hero.subtitle, v); return c; })} />
            <FL label="Əsas Düymə" value={content.home.hero.primaryCta} locale={editorLocale} onChange={v => upd(c => { c.home.hero.primaryCta = setText(c.home.hero.primaryCta, v); return c; })} />
            <FL label="İkinci Düymə" value={content.home.hero.secondaryCta} locale={editorLocale} onChange={v => upd(c => { c.home.hero.secondaryCta = setText(c.home.hero.secondaryCta, v); return c; })} />
            <FL label="Scroll Label" value={content.home.hero.scrollLabel} locale={editorLocale} onChange={v => upd(c => { c.home.hero.scrollLabel = setText(c.home.hero.scrollLabel, v); return c; })} />
            <FL label="Yan Etiket" value={content.home.hero.sideLabel} locale={editorLocale} onChange={v => upd(c => { c.home.hero.sideLabel = setText(c.home.hero.sideLabel, v); return c; })} />
          </G2>
          <div className="mt-3">
            <label style={labelStyle}>Statistika (Hero Alt)</label>
            {(content.home.hero.stats || []).map((stat, i) => (
              <div key={i} style={subCardStyle}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#e30613', marginBottom: 8 }}>#{i + 1}</div>
                <G2>
                  <FL label="Etiket" value={stat.label} locale={editorLocale} onChange={v => upd(c => { c.home.hero.stats[i].label = setText(c.home.hero.stats[i].label, v); return c; })} />
                  <FL label="Dəyər" value={stat.value} locale={editorLocale} onChange={v => upd(c => { c.home.hero.stats[i].value = setText(c.home.hero.stats[i].value, v); return c; })} />
                </G2>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Vision / Mission (Compact)">
          <G2>
            <FL label="Vizyon Etiketi" value={content.home.visionMissionCompact.visionLabel} locale={editorLocale} onChange={v => upd(c => { c.home.visionMissionCompact.visionLabel = setText(c.home.visionMissionCompact.visionLabel, v); return c; })} />
            <FL label="Missiya Etiketi" value={content.home.visionMissionCompact.missionLabel} locale={editorLocale} onChange={v => upd(c => { c.home.visionMissionCompact.missionLabel = setText(c.home.visionMissionCompact.missionLabel, v); return c; })} />
            <FL label="Vizyon Mətni" value={content.home.visionMissionCompact.visionBody} locale={editorLocale} multiline onChange={v => upd(c => { c.home.visionMissionCompact.visionBody = setText(c.home.visionMissionCompact.visionBody, v); return c; })} />
            <FL label="Missiya Mətni" value={content.home.visionMissionCompact.missionBody} locale={editorLocale} multiline onChange={v => upd(c => { c.home.visionMissionCompact.missionBody = setText(c.home.visionMissionCompact.missionBody, v); return c; })} />
          </G2>
        </Card>

        <Card title="Services Teaser">
          <G2>
            <FL label="Badge" value={content.home.servicesTeaser.badge} locale={editorLocale} onChange={v => upd(c => { c.home.servicesTeaser.badge = setText(c.home.servicesTeaser.badge, v); return c; })} />
            <FL label="Başlıq 1" value={content.home.servicesTeaser.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.home.servicesTeaser.titleLine1 = setText(c.home.servicesTeaser.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.home.servicesTeaser.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.home.servicesTeaser.titleLine2 = setText(c.home.servicesTeaser.titleLine2, v); return c; })} />
            <FL label="Subtitle" value={content.home.servicesTeaser.subtitle} locale={editorLocale} multiline onChange={v => upd(c => { c.home.servicesTeaser.subtitle = setText(c.home.servicesTeaser.subtitle, v); return c; })} />
          </G2>
        </Card>

        <Card title="Metrics">
          <div className="mb-3">
            <FL label="Eyebrow" value={content.home.metricsEyebrow.text} locale={editorLocale} onChange={v => upd(c => { c.home.metricsEyebrow.text = setText(c.home.metricsEyebrow.text, v); return c; })} />
          </div>
          {content.home.metrics.items.map((item, i) => (
            <div key={i} style={subCardStyle}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#e30613', marginBottom: 8 }}>#{i + 1}</div>
              <G2>
                <PlainField label="Dəyər (rəqəm)" value={item.value} onChange={v => upd(c => { c.home.metrics.items[i].value = v; return c; })} />
                <FL label="Etiket" value={item.label} locale={editorLocale} onChange={v => upd(c => { c.home.metrics.items[i].label = setText(c.home.metrics.items[i].label, v); return c; })} />
              </G2>
            </div>
          ))}
        </Card>

        <Card title="Final CTA">
          <G2>
            <FL label="Badge" value={content.home.finalCtaBadge.text} locale={editorLocale} onChange={v => upd(c => { c.home.finalCtaBadge.text = setText(c.home.finalCtaBadge.text, v); return c; })} />
            <FL label="Başlıq" value={content.home.finalCta.title} locale={editorLocale} onChange={v => upd(c => { c.home.finalCta.title = setText(c.home.finalCta.title, v); return c; })} />
            <FL label="Başlıq Accent" value={content.home.finalCta.titleAccent} locale={editorLocale} onChange={v => upd(c => { c.home.finalCta.titleAccent = setText(c.home.finalCta.titleAccent, v); return c; })} />
            <FL label="Açıqlama" value={content.home.finalCta.description} locale={editorLocale} multiline onChange={v => upd(c => { c.home.finalCta.description = setText(c.home.finalCta.description, v); return c; })} />
            <FL label="Əsas Düymə" value={content.home.finalCta.primaryCta} locale={editorLocale} onChange={v => upd(c => { c.home.finalCta.primaryCta = setText(c.home.finalCta.primaryCta, v); return c; })} />
            <FL label="İkinci Düymə" value={content.home.finalCta.secondaryCta} locale={editorLocale} onChange={v => upd(c => { c.home.finalCta.secondaryCta = setText(c.home.finalCta.secondaryCta, v); return c; })} />
            <PlainField label="Email" value={content.home.finalCta.email} onChange={v => upd(c => { c.home.finalCta.email = v; return c; })} placeholder="sales@eventrent.az" />
            <PlainField label="Telefon" value={content.home.finalCta.phone} onChange={v => upd(c => { c.home.finalCta.phone = v; return c; })} />
            <FL label="Ünvan" value={content.home.finalCta.address} locale={editorLocale} onChange={v => upd(c => { c.home.finalCta.address = setText(c.home.finalCta.address, v); return c; })} />
          </G2>
        </Card>

        <Card title="Clients Eyebrow">
          <G2>
            <FL label="Badge" value={content.home.clientsEyebrow.badge} locale={editorLocale} onChange={v => upd(c => { c.home.clientsEyebrow.badge = setText(c.home.clientsEyebrow.badge, v); return c; })} />
            <FL label="Say" value={content.home.clientsEyebrow.count} locale={editorLocale} onChange={v => upd(c => { c.home.clientsEyebrow.count = setText(c.home.clientsEyebrow.count, v); return c; })} />
            <FL label="Trusted Label" value={content.home.clientsEyebrow.trustedLabel} locale={editorLocale} onChange={v => upd(c => { c.home.clientsEyebrow.trustedLabel = setText(c.home.clientsEyebrow.trustedLabel, v); return c; })} />
          </G2>
        </Card>

        <Card title="Capabilities">
          <G2>
            <FL label="Badge" value={content.home.capabilities.badge} locale={editorLocale} onChange={v => upd(c => { c.home.capabilities.badge = setText(c.home.capabilities.badge, v); return c; })} />
            <FL label="Başlıq" value={content.home.capabilities.title} locale={editorLocale} onChange={v => upd(c => { c.home.capabilities.title = setText(c.home.capabilities.title, v); return c; })} />
            <FL label="Başlıq Accent" value={content.home.capabilities.titleAccent} locale={editorLocale} onChange={v => upd(c => { c.home.capabilities.titleAccent = setText(c.home.capabilities.titleAccent, v); return c; })} />
            <FL label="Açıqlama" value={content.home.capabilities.description} locale={editorLocale} multiline onChange={v => upd(c => { c.home.capabilities.description = setText(c.home.capabilities.description, v); return c; })} />
            <FL label="CTA" value={content.home.capabilities.cta} locale={editorLocale} onChange={v => upd(c => { c.home.capabilities.cta = setText(c.home.capabilities.cta, v); return c; })} />
          </G2>
        </Card>

        <Card title="Müştərilər (Clients)">
          <G2>
            <FL label="Badge" value={content.home.clients.badge} locale={editorLocale} onChange={v => upd(c => { c.home.clients.badge = setText(c.home.clients.badge, v); return c; })} />
            <FL label="Başlıq" value={content.home.clients.title} locale={editorLocale} onChange={v => upd(c => { c.home.clients.title = setText(c.home.clients.title, v); return c; })} />
            <FL label="Subtitle" value={content.home.clients.subtitle} locale={editorLocale} multiline onChange={v => upd(c => { c.home.clients.subtitle = setText(c.home.clients.subtitle, v); return c; })} />
          </G2>
          <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
            <label style={labelStyle}>Müştəri Siyahısı ({content.home.clients.clients?.length || 0} müştəri)</label>
            <button type="button" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 9, fontSize: 11 }}
              onClick={() => upd(c => { if (!c.home.clients.clients) c.home.clients.clients = []; c.home.clients.clients.push({ name: 'Yeni Müştəri', logo: '', url: '' }); return c; })}>
              <Plus size={11} /> Əlavə Et
            </button>
          </div>
          {(content.home.clients.clients || []).map((client: any, i: number) => (
            <div key={i} style={subCardStyle}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e30613' }}>#{i + 1}</span>
                <button type="button" className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 8px' }}
                  onClick={() => upd(c => { c.home.clients.clients = c.home.clients.clients.filter((_: any, j: number) => j !== i); return c; })}>
                  <Trash2 size={11} />
                </button>
              </div>
              <G3>
                <PlainField label="Müştəri Adı" value={client.name} onChange={v => upd(c => { c.home.clients.clients[i].name = v; return c; })} placeholder="SOCAR" />
                <PlainField label="Logo URL" value={client.logo} onChange={v => upd(c => { c.home.clients.clients[i].logo = v; return c; })} placeholder="https://..." />
                <PlainField label="Website URL" value={client.url || ''} onChange={v => upd(c => { c.home.clients.clients[i].url = v; return c; })} placeholder="https://..." />
              </G3>
            </div>
          ))}
        </Card>

        <Card title="Komanda (Team)">
          <G2>
            <FL label="Badge" value={content.home.team.badge} locale={editorLocale} onChange={v => upd(c => { c.home.team.badge = setText(c.home.team.badge, v); return c; })} />
            <FL label="Başlıq Accent" value={content.home.team.titleAccent} locale={editorLocale} onChange={v => upd(c => { c.home.team.titleAccent = setText(c.home.team.titleAccent, v); return c; })} />
          </G2>
          <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
            <label style={labelStyle}>Üzvlər ({content.home.team.members.length})</label>
            <button type="button" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 9, fontSize: 11 }}
              onClick={() => upd(c => { c.home.team.members.push({ name: { az: '', en: '', ru: '', tr: '' }, role: { az: '', en: '', ru: '', tr: '' }, description: { az: '', en: '', ru: '', tr: '' }, image: '' }); return c; })}>
              <Plus size={11} /> Üzv Əlavə Et
            </button>
          </div>
          {content.home.team.members.map((member, i) => (
            <div key={i} style={subCardStyle}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e30613' }}>#{i + 1}</span>
                <button type="button" className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 8px' }}
                  onClick={() => upd(c => { c.home.team.members = c.home.team.members.filter((_, j) => j !== i); return c; })}>
                  <Trash2 size={11} />
                </button>
              </div>
              <G2>
                <FL label="Ad" value={member.name} locale={editorLocale} onChange={v => upd(c => { c.home.team.members[i].name = setText(c.home.team.members[i].name, v); return c; })} />
                <FL label="Vəzifə" value={member.role} locale={editorLocale} onChange={v => upd(c => { c.home.team.members[i].role = setText(c.home.team.members[i].role, v); return c; })} />
              </G2>
              <div className="mt-2">
                <ImgField label="Şəkil URL" value={member.image} onChange={v => upd(c => { c.home.team.members[i].image = v; return c; })} />
              </div>
            </div>
          ))}
        </Card>

        <Card title="Navbar Linklər">
          <div style={{ fontSize: 11, color: '#6c757d', marginBottom: 12 }}>Bu linklər hem navbar həm footer-da görünür. Path dəyişdirmə frontend router ilə uyğun olmalıdır.</div>
          {(content.footer.navLinks || []).map((link, i) => (
            <div key={i} style={subCardStyle}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e30613' }}>#{i + 1}</span>
              </div>
              <G2>
                <FL label="Etiket" value={link.label} locale={editorLocale} onChange={v => upd(c => { c.footer.navLinks[i].label = setText(c.footer.navLinks[i].label, v); return c; })} />
                <PlainField label="Path" value={link.path} onChange={v => upd(c => { c.footer.navLinks[i].path = v; return c; })} placeholder="/" />
              </G2>
            </div>
          ))}
        </Card>

      </div>
    </div>
  );

  /* ══ ABOUT ══ */
  if (section === 'about') return (
    <div className={className}>
      {topBar}
      <div className="d-flex flex-column gap-3">

        <Card title="Hero">
          <G2>
            <FL label="Badge" value={content.about.hero.badge} locale={editorLocale} onChange={v => upd(c => { c.about.hero.badge = setText(c.about.hero.badge, v); return c; })} />
            <FL label="Başlıq 1" value={content.about.hero.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.about.hero.titleLine1 = setText(c.about.hero.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.about.hero.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.about.hero.titleLine2 = setText(c.about.hero.titleLine2, v); return c; })} />
            <FL label="Subtitle" value={content.about.hero.subtitle} locale={editorLocale} multiline onChange={v => upd(c => { c.about.hero.subtitle = setText(c.about.hero.subtitle, v); return c; })} />
          </G2>
        </Card>

        <Card title="Partner Intro">
          <G2>
            <FL label="Badge" value={content.about.partnerIntro.badge} locale={editorLocale} onChange={v => upd(c => { c.about.partnerIntro.badge = setText(c.about.partnerIntro.badge, v); return c; })} />
            <FL label="Başlıq 1" value={content.about.partnerIntro.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.about.partnerIntro.titleLine1 = setText(c.about.partnerIntro.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.about.partnerIntro.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.about.partnerIntro.titleLine2 = setText(c.about.partnerIntro.titleLine2, v); return c; })} />
            <FL label="Sitat" value={content.about.partnerIntro.quote} locale={editorLocale} multiline rows={4} onChange={v => upd(c => { c.about.partnerIntro.quote = setText(c.about.partnerIntro.quote, v); return c; })} />
          </G2>
          <div className="mt-3">
            <label style={labelStyle}>Statistika</label>
            {content.about.partnerIntro.stats.map((stat, i) => (
              <div key={i} style={subCardStyle}>
                <G2>
                  <PlainField label="Dəyər" value={stat.value} onChange={v => upd(c => { c.about.partnerIntro.stats[i].value = v; return c; })} />
                  <FL label="Etiket" value={stat.label} locale={editorLocale} onChange={v => upd(c => { c.about.partnerIntro.stats[i].label = setText(c.about.partnerIntro.stats[i].label, v); return c; })} />
                </G2>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Vision / Mission">
          <G2>
            <FL label="Badge" value={content.about.visionMission.badge} locale={editorLocale} onChange={v => upd(c => { c.about.visionMission.badge = setText(c.about.visionMission.badge, v); return c; })} />
            <FL label="Vizyon Etiketi" value={content.about.visionMission.visionLabel} locale={editorLocale} onChange={v => upd(c => { c.about.visionMission.visionLabel = setText(c.about.visionMission.visionLabel, v); return c; })} />
            <FL label="Vizyon Başlıq" value={content.about.visionMission.visionTitle} locale={editorLocale} onChange={v => upd(c => { c.about.visionMission.visionTitle = setText(c.about.visionMission.visionTitle, v); return c; })} />
            <FL label="Vizyon Mətn" value={content.about.visionMission.visionBody} locale={editorLocale} multiline onChange={v => upd(c => { c.about.visionMission.visionBody = setText(c.about.visionMission.visionBody, v); return c; })} />
            <FL label="Vizyon Tagline" value={content.about.visionMission.visionTagline} locale={editorLocale} onChange={v => upd(c => { c.about.visionMission.visionTagline = setText(c.about.visionMission.visionTagline, v); return c; })} />
            <FL label="Missiya Etiketi" value={content.about.visionMission.missionLabel} locale={editorLocale} onChange={v => upd(c => { c.about.visionMission.missionLabel = setText(c.about.visionMission.missionLabel, v); return c; })} />
            <FL label="Missiya Başlıq" value={content.about.visionMission.missionTitle} locale={editorLocale} onChange={v => upd(c => { c.about.visionMission.missionTitle = setText(c.about.visionMission.missionTitle, v); return c; })} />
            <FL label="Missiya Mətn" value={content.about.visionMission.missionBody} locale={editorLocale} multiline onChange={v => upd(c => { c.about.visionMission.missionBody = setText(c.about.visionMission.missionBody, v); return c; })} />
          </G2>
          <div className="mt-3">
            <label style={labelStyle}>Statistika</label>
            {content.about.visionMission.stats.map((stat, i) => (
              <div key={i} style={subCardStyle}>
                <G3>
                  <PlainField label="Hədəf rəqəm" value={String(stat.target)} onChange={v => upd(c => { c.about.visionMission.stats[i].target = Number(v) || 0; return c; })} />
                  <PlainField label="Suffix" value={stat.suffix} onChange={v => upd(c => { c.about.visionMission.stats[i].suffix = v; return c; })} placeholder="+" />
                  <FL label="Etiket" value={stat.label} locale={editorLocale} onChange={v => upd(c => { c.about.visionMission.stats[i].label = setText(c.about.visionMission.stats[i].label, v); return c; })} />
                </G3>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Bento">
          <G2>
            <FL label="Badge" value={content.about.bento.badge} locale={editorLocale} onChange={v => upd(c => { c.about.bento.badge = setText(c.about.bento.badge, v); return c; })} />
            <FL label="Şəkil Başlıq" value={content.about.bento.imageTitle} locale={editorLocale} onChange={v => upd(c => { c.about.bento.imageTitle = setText(c.about.bento.imageTitle, v); return c; })} />
            <FL label="Şəkil Accent" value={content.about.bento.imageTitleAccent} locale={editorLocale} onChange={v => upd(c => { c.about.bento.imageTitleAccent = setText(c.about.bento.imageTitleAccent, v); return c; })} />
          </G2>
          <div className="mt-3">
            {content.about.bento.cards.map((card, i) => (
              <div key={i} style={subCardStyle}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#e30613', marginBottom: 8 }}>Kart #{i + 1}</div>
                <G2>
                  <FL label="Başlıq" value={card.title} locale={editorLocale} onChange={v => upd(c => { c.about.bento.cards[i].title = setText(c.about.bento.cards[i].title, v); return c; })} />
                  <FL label="Açıqlama" value={card.desc} locale={editorLocale} multiline onChange={v => upd(c => { c.about.bento.cards[i].desc = setText(c.about.bento.cards[i].desc, v); return c; })} />
                </G2>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Team">
          <G2>
            <FL label="Badge" value={content.about.team.badge} locale={editorLocale} onChange={v => upd(c => { c.about.team.badge = setText(c.about.team.badge, v); return c; })} />
            <FL label="Başlıq 1" value={content.about.team.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.about.team.titleLine1 = setText(c.about.team.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.about.team.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.about.team.titleLine2 = setText(c.about.team.titleLine2, v); return c; })} />
          </G2>
          <div className="mt-3">
            <label style={labelStyle}>Üzvlər</label>
            {content.home.team.members.map((member, i) => (
              <div key={i} style={subCardStyle}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#e30613', marginBottom: 8 }}>#{i + 1}</div>
                <G2>
                  <FL label="Ad" value={member.name} locale={editorLocale} onChange={v => upd(c => { c.home.team.members[i].name = setText(c.home.team.members[i].name, v); return c; })} />
                  <FL label="Vəzifə" value={member.role} locale={editorLocale} onChange={v => upd(c => { c.home.team.members[i].role = setText(c.home.team.members[i].role, v); return c; })} />
                </G2>
                <div className="mt-2">
                  <ImgField label="Şəkil URL" value={member.image} onChange={v => upd(c => { c.home.team.members[i].image = v; return c; })} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Values">
          <G2>
            <FL label="Badge" value={content.about.values.badge} locale={editorLocale} onChange={v => upd(c => { c.about.values.badge = setText(c.about.values.badge, v); return c; })} />
            <FL label="Başlıq 1" value={content.about.values.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.about.values.titleLine1 = setText(c.about.values.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.about.values.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.about.values.titleLine2 = setText(c.about.values.titleLine2, v); return c; })} />
          </G2>
          <div className="mt-3">
            {content.about.values.items.map((item, i) => (
              <div key={i} style={subCardStyle}>
                <G2>
                  <FL label="Başlıq" value={item.title} locale={editorLocale} onChange={v => upd(c => { c.about.values.items[i].title = setText(c.about.values.items[i].title, v); return c; })} />
                  <FL label="Açıqlama" value={item.desc} locale={editorLocale} multiline onChange={v => upd(c => { c.about.values.items[i].desc = setText(c.about.values.items[i].desc, v); return c; })} />
                </G2>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );

  /* ══ SERVICES ══ */
  if (section === 'services') return (
    <div className={className}>
      {topBar}
      <div className="d-flex flex-column gap-3">

        <Card title="Showcase">
          <G2>
            <FL label="Badge" value={content.services.showcase.badge} locale={editorLocale} onChange={v => upd(c => { c.services.showcase.badge = setText(c.services.showcase.badge, v); return c; })} />
            <FL label="Ətraflı Link" value={content.services.showcase.detailLink} locale={editorLocale} onChange={v => upd(c => { c.services.showcase.detailLink = setText(c.services.showcase.detailLink, v); return c; })} />
          </G2>
          <div className="mt-3">
            {content.services.showcase.items.map((item, i) => (
              <div key={i} style={subCardStyle}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#e30613', marginBottom: 8 }}>{item.num} — {item.iconKey}</div>
                <G2>
                  <FL label="Eyebrow" value={item.eyebrow} locale={editorLocale} onChange={v => upd(c => { c.services.showcase.items[i].eyebrow = setText(c.services.showcase.items[i].eyebrow, v); return c; })} />
                  <FL label="Başlıq" value={item.title} locale={editorLocale} multiline rows={2} onChange={v => upd(c => { c.services.showcase.items[i].title = setText(c.services.showcase.items[i].title, v); return c; })} />
                  <FL label="Açıqlama" value={item.description} locale={editorLocale} multiline onChange={v => upd(c => { c.services.showcase.items[i].description = setText(c.services.showcase.items[i].description, v); return c; })} />
                </G2>
                <div className="mt-2">
                  <ImgField label="Şəkil" value={item.image} onChange={v => upd(c => { c.services.showcase.items[i].image = v; return c; })} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Grid">
          <G2>
            <FL label="Badge" value={content.services.grid.badge} locale={editorLocale} onChange={v => upd(c => { c.services.grid.badge = setText(c.services.grid.badge, v); return c; })} />
            <FL label="Başlıq 1" value={content.services.grid.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.services.grid.titleLine1 = setText(c.services.grid.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.services.grid.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.services.grid.titleLine2 = setText(c.services.grid.titleLine2, v); return c; })} />
            <FL label="CTA Düymə" value={content.services.grid.cta} locale={editorLocale} onChange={v => upd(c => { c.services.grid.cta = setText(c.services.grid.cta, v); return c; })} />
          </G2>
        </Card>

        <Card title="Kateqoriyalar">
          <div className="d-flex flex-wrap gap-2 mb-3">
            {content.services.categories.map(cat => (
              <button key={cat.id} type="button" onClick={() => setSelectedCategoryId(cat.id)} style={badgeStyle(selectedCategoryId === cat.id)}>
                {t(editorLocale, cat.title)}
              </button>
            ))}
            <button type="button"
              onClick={() => {
                const id = `cat-${Date.now()}`;
                upd(c => { c.services.categories.push({ id, path: `/services/${id}`, title: { az: 'Yeni', en: 'New', ru: 'Новый', tr: 'Yeni' }, description: { az: '', en: '', ru: '', tr: '' }, image: '', subItems: [] }); return c; });
                setSelectedCategoryId(id);
              }}
              className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              + Yeni
            </button>
          </div>

          {selectedCategory && (
            <div>
              <G2>
                <FL label="Başlıq" value={selectedCategory.title} locale={editorLocale} onChange={v => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) cat.title = setText(cat.title, v); return c; })} />
                <PlainField label="URL Path" value={selectedCategory.path} onChange={v => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) cat.path = v; return c; })} placeholder="/services/..." />
                <FL label="Açıqlama" value={selectedCategory.description} locale={editorLocale} multiline onChange={v => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) cat.description = setText(cat.description, v); return c; })} />
              </G2>
              <div className="mt-3">
                <ImgField label="Kateqoriya Şəkli" value={selectedCategory.image} onChange={v => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) cat.image = v; return c; })} />
              </div>

              <div className="mt-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label style={labelStyle}>Alt Xidmətlər</label>
                  <button type="button" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 9, fontSize: 11 }}
                    onClick={() => {
                      const id = `sub-${Date.now()}`;
                      upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) cat.subItems.push({ id, name: { az: 'Yeni', en: 'New', ru: 'Новый', tr: 'Yeni' }, desc: { az: '', en: '', ru: '', tr: '' }, questions: { az: [], en: [], ru: [], tr: [] } }); return c; });
                    }}>
                    + Alt Əlavə Et
                  </button>
                </div>
                {selectedCategory.subItems.map((sub, si) => (
                  <div key={sub.id} style={subCardStyle}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#e30613' }}>#{si + 1} — {sub.id}</span>
                      <button type="button" className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 8px' }}
                        onClick={() => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) cat.subItems = cat.subItems.filter(x => x.id !== sub.id); return c; })}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <G2>
                      <FL label="Ad" value={sub.name} locale={editorLocale} onChange={v => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) { const s = cat.subItems.find(x => x.id === sub.id); if (s) s.name = setText(s.name, v); } return c; })} />
                      <FL label="Açıqlama" value={sub.desc} locale={editorLocale} multiline onChange={v => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) { const s = cat.subItems.find(x => x.id === sub.id); if (s) s.desc = setText(s.desc, v); } return c; })} />
                      <div className="col-12">
                        <label style={labelStyle}>Suallar (hər sətir ayrı)</label>
                        <textarea rows={3} className={inputCls} style={{ resize: 'none', borderRadius: 8 }}
                          value={sub.questions[editorLocale].join('\n')}
                          onChange={e => upd(c => { const cat = c.services.categories.find(x => x.id === selectedCategoryId); if (cat) { const s = cat.subItems.find(x => x.id === sub.id); if (s) s.questions = setArr(s.questions, e.target.value); } return c; })}
                          placeholder="Sual 1&#10;Sual 2"
                        />
                      </div>
                    </G2>
                  </div>
                ))}
              </div>

              {content.services.categories.length > 1 && (
                <button type="button" className="btn btn-sm btn-outline-danger mt-3 d-flex align-items-center gap-1" style={{ borderRadius: 9, fontSize: 11 }}
                  onClick={() => upd(c => { c.services.categories = c.services.categories.filter(x => x.id !== selectedCategoryId); setSelectedCategoryId(c.services.categories[0]?.id ?? ''); return c; })}>
                  <Trash2 size={11} /> Kateqoriyanı Sil
                </button>
              )}
            </div>
          )}
        </Card>

      </div>
    </div>
  );

  /* ══ CONTACT ══ */
  if (section === 'contact') return (
    <div className={className}>
      {topBar}
      <div className="d-flex flex-column gap-3">

        <Card title="Hero">
          <G2>
            <FL label="Badge" value={content.contact.hero.badge} locale={editorLocale} onChange={v => upd(c => { c.contact.hero.badge = setText(c.contact.hero.badge, v); return c; })} />
            <FL label="Başlıq 1" value={content.contact.hero.titleLine1} locale={editorLocale} onChange={v => upd(c => { c.contact.hero.titleLine1 = setText(c.contact.hero.titleLine1, v); return c; })} />
            <FL label="Başlıq 2" value={content.contact.hero.titleLine2} locale={editorLocale} onChange={v => upd(c => { c.contact.hero.titleLine2 = setText(c.contact.hero.titleLine2, v); return c; })} />
            <FL label="Subtitle" value={content.contact.hero.subtitle} locale={editorLocale} multiline onChange={v => upd(c => { c.contact.hero.subtitle = setText(c.contact.hero.subtitle, v); return c; })} />
          </G2>
        </Card>

        <Card title="Form">
          <G3>
            {([
              ['labelName','Ad Soyad'], ['labelPhone','Telefon'], ['labelEmail','Email'], ['labelMessage','Mesaj'],
              ['placeholderName','Ad Placeholder'], ['placeholderPhone','Telefon Placeholder'], ['placeholderEmail','Email Placeholder'], ['placeholderMessage','Mesaj Placeholder'],
              ['errorRequired','Xəta Mətn'], ['successTitle','Uğur Başlıq'], ['successBody','Uğur Mətn'],
              ['resetButton','Sıfırla'], ['submitButton','Göndər'],
              ['infoPhone','Tel Başlıq'], ['infoPhoneValue','Tel Dəyər'], ['infoPhoneSub','Tel Alt'],
              ['infoEmail','Email Başlıq'], ['infoEmailValue','Email Dəyər'], ['infoEmailSub','Email Alt'],
              ['infoAddress','Ünvan Başlıq'], ['infoAddressValue','Ünvan Dəyər'], ['infoAddressSub','Ünvan Alt'],
            ] as [keyof SiteContent['contact']['form'], string][]).map(([field, label]) => (
              <FL key={field} label={label} value={content.contact.form[field]} locale={editorLocale}
                onChange={v => upd(c => { (c.contact.form[field] as LocalizedText) = setText(c.contact.form[field] as LocalizedText, v); return c; })} />
            ))}
          </G3>
        </Card>

        <Card title="CTA">
          <G3>
            {([
              ['badge','Badge'], ['subText','Alt Mətn'], ['bottomLabel','Alt Etiket'],
              ['bottomTagline','Alt Tagline'], ['bottomCta','Alt CTA'],
              ['channelPhone','Kanal: Tel'], ['channelEmail','Kanal: Email'], ['channelMap','Kanal: Xəritə'],
              ['channelInstagram','Kanal: IG'], ['channelFacebook','Kanal: FB'],
              ['channelTagPhone','Tag: Tel'], ['channelTagEmail','Tag: Email'], ['channelTagMap','Tag: Xəritə'],
              ['channelTagInstagram','Tag: IG'], ['channelTagFacebook','Tag: FB'],
              ['channelPhoneValue','Tel Dəyər'], ['channelEmailValue','Email Dəyər'],
              ['channelAddressValue','Ünvan Dəyər'], ['channelInstagramValue','IG Dəyər'], ['channelFacebookValue','FB Dəyər'],
            ] as [keyof SiteContent['contact']['cta'], string][]).map(([field, label]) => (
              <FL key={field} label={label} value={content.contact.cta[field]} locale={editorLocale}
                onChange={v => upd(c => { (c.contact.cta[field] as LocalizedText) = setText(c.contact.cta[field] as LocalizedText, v); return c; })} />
            ))}
          </G3>
          <div className="mt-3">
            <FL label="BURDAYIQ Sözü" value={content.contact.ctaHeroWord} locale={editorLocale} onChange={v => upd(c => { c.contact.ctaHeroWord = setText(c.contact.ctaHeroWord, v); return c; })} />
          </div>
        </Card>

        <Card title="Map Overlay">
          <G2>
            <FL label="Başlıq" value={content.contact.map.overlayTitle} locale={editorLocale} onChange={v => upd(c => { c.contact.map.overlayTitle = setText(c.contact.map.overlayTitle, v); return c; })} />
            <FL label="Subtitle" value={content.contact.map.overlaySubtitle} locale={editorLocale} multiline onChange={v => upd(c => { c.contact.map.overlaySubtitle = setText(c.contact.map.overlaySubtitle, v); return c; })} />
          </G2>
        </Card>

      </div>
    </div>
  );

  /* ══ FOOTER ══ */
  if (section === 'footer') return (
    <div className={className}>
      {topBar}
      <div className="d-flex flex-column gap-3">

        <Card title="Footer">
          <G2>
            <FL label="Tagline" value={content.footer.tagline} locale={editorLocale} multiline onChange={v => upd(c => { c.footer.tagline = setText(c.footer.tagline, v); return c; })} />
            <FL label="Nav Başlıq" value={content.footer.navHeading} locale={editorLocale} onChange={v => upd(c => { c.footer.navHeading = setText(c.footer.navHeading, v); return c; })} />
            <FL label="Əlaqə Başlıq" value={content.footer.contactHeading} locale={editorLocale} onChange={v => upd(c => { c.footer.contactHeading = setText(c.footer.contactHeading, v); return c; })} />
            <FL label="WhatsApp Xətt" value={content.footer.whatsappLine} locale={editorLocale} onChange={v => upd(c => { c.footer.whatsappLine = setText(c.footer.whatsappLine, v); return c; })} />
            <FL label="WhatsApp CTA" value={content.footer.whatsappCta} locale={editorLocale} onChange={v => upd(c => { c.footer.whatsappCta = setText(c.footer.whatsappCta, v); return c; })} />
            <FL label="WhatsApp Badge" value={content.footer.whatsappBadge} locale={editorLocale} onChange={v => upd(c => { c.footer.whatsappBadge = setText(c.footer.whatsappBadge, v); return c; })} />
            <FL label="Copyright" value={content.footer.copyright} locale={editorLocale} onChange={v => upd(c => { c.footer.copyright = setText(c.footer.copyright, v); return c; })} />
            <FL label="Məxfilik" value={content.footer.privacyPolicy} locale={editorLocale} onChange={v => upd(c => { c.footer.privacyPolicy = setText(c.footer.privacyPolicy, v); return c; })} />
            <FL label="Şərtlər" value={content.footer.termsOfService} locale={editorLocale} onChange={v => upd(c => { c.footer.termsOfService = setText(c.footer.termsOfService, v); return c; })} />
          </G2>
          <div className="mt-3">
            <label style={labelStyle}>Nav Linklər</label>
            {content.footer.navLinks.map((link, i) => (
              <div key={i} style={subCardStyle}>
                <G2>
                  <FL label="Etiket" value={link.label} locale={editorLocale} onChange={v => upd(c => { c.footer.navLinks[i].label = setText(c.footer.navLinks[i].label, v); return c; })} />
                  <PlainField label="Path" value={link.path} onChange={v => upd(c => { c.footer.navLinks[i].path = v; return c; })} placeholder="/" />
                </G2>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );

  /* ══ PORTFOLIO ══ */
  if (section === 'portfolio') return (
    <div className={className}>
      {topBar}
      <div className="d-flex flex-column gap-3">
        <Card title="Portfolio Layihələri" defaultOpen>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <label style={labelStyle}>Layihələr ({(content.portfolio?.projects || []).length})</label>
            <button type="button" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 9, fontSize: 11 }}
              onClick={() => upd(c => {
                if (!c.portfolio) c.portfolio = { projects: [] };
                if (!c.portfolio.projects) c.portfolio.projects = [];
                c.portfolio.projects.push({
                  title:    { az: '', en: '', ru: '', tr: '' },
                  client:   '',
                  date:     { az: '', en: '', ru: '', tr: '' },
                  location: { az: '', en: '', ru: '', tr: '' },
                  category: { az: '', en: '', ru: '', tr: '' },
                  videoUrl: '',
                  poster:   '',
                  image:    '',
                });
                return c;
              })}>
              <Plus size={11} /> Layihə Əlavə Et
            </button>
          </div>
          {(content.portfolio?.projects || []).map((proj: any, i: number) => (
            <div key={i} style={subCardStyle}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e30613' }}>#{i + 1} — {proj.title?.az || 'Yeni Layihə'}</span>
                <button type="button" className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ borderRadius: 8, padding: '2px 8px' }}
                  onClick={() => upd(c => { c.portfolio.projects = c.portfolio.projects.filter((_: any, j: number) => j !== i); return c; })}>
                  <Trash2 size={11} />
                </button>
              </div>
              <G2>
                <FL label="Başlıq" value={proj.title} locale={editorLocale} onChange={v => upd(c => { c.portfolio.projects[i].title = setText(c.portfolio.projects[i].title, v); return c; })} />
                <PlainField label="Müştəri / Şirkət" value={proj.client} onChange={v => upd(c => { c.portfolio.projects[i].client = v; return c; })} placeholder="SOCAR" />
                <FL label="Tarix" value={proj.date} locale={editorLocale} onChange={v => upd(c => { c.portfolio.projects[i].date = setText(c.portfolio.projects[i].date, v); return c; })} />
                <FL label="Məkan" value={proj.location} locale={editorLocale} onChange={v => upd(c => { c.portfolio.projects[i].location = setText(c.portfolio.projects[i].location, v); return c; })} />
                <FL label="Kateqoriya" value={proj.category} locale={editorLocale} onChange={v => upd(c => { c.portfolio.projects[i].category = setText(c.portfolio.projects[i].category, v); return c; })} />
              </G2>
              <div className="row g-3 mt-1">
                <div className="col-12">
                  <VideoField
                    label="Video URL / Yüklə (mp4, webm, mov)"
                    value={proj.videoUrl || ''}
                    token={token}
                    onChange={v => upd(c => { c.portfolio.projects[i].videoUrl = v; return c; })}
                  />
                </div>
                <div className="col-md-6">
                  <ImgField label="Poster Şəkil (video üçün)" value={proj.poster || ''} token={token} onChange={v => upd(c => { c.portfolio.projects[i].poster = v; return c; })} />
                </div>
                <div className="col-md-6">
                  <ImgField label="Şəkil (video yoxdursa)" value={proj.image || ''} token={token} onChange={v => upd(c => { c.portfolio.projects[i].image = v; return c; })} />
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {showBackups && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowBackups(false)}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 18 }}>
              <div className="modal-header border-0 px-4 pt-4 pb-2">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <History size={18} color="#664d03" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Məzmun Backupları</h6>
                    <div style={{ fontSize: 11, color: '#adb5bd' }}>Hər saxlamada avtomatik yaradılır · Son 20 saxlanır</div>
                  </div>
                </div>
                <button className="btn-close" onClick={() => setShowBackups(false)} />
              </div>
              <div className="modal-body px-4 pb-4">
                {loadingBackups ? (
                  <div className="text-center py-4"><div className="spinner-border text-danger" style={{ width: 24, height: 24 }} /></div>
                ) : backups.length === 0 ? (
                  <div className="text-center py-4 text-muted" style={{ fontSize: 13 }}>
                    <History size={32} style={{ marginBottom: 8, opacity: 0.3 }} /><br/>Hələ backup yoxdur. İlk saxlamadan sonra burada görünəcək.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {backups.map(b => {
                      const dt = new Date(b.created_at);
                      const label = dt.toLocaleString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      const kb = (b.size / 1024).toFixed(1);
                      return (
                        <div key={b.filename} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <History size={15} color="#6c757d" />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#212529', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
                            <div style={{ fontSize: 10, color: '#adb5bd' }}>{kb} KB · {b.filename}</div>
                          </div>
                          <button onClick={() => handleRestore(b.filename)} disabled={restoringFile === b.filename}
                            className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 flex-shrink-0" style={{ borderRadius: 8, fontSize: 11 }}>
                            <RotateCcw size={11} /> {restoringFile === b.filename ? '...' : 'Bərpa'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}