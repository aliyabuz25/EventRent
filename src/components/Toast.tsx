import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  info:    (msg: string) => void;
}

const ToastCtx = createContext<ToastContextValue>({ success: () => {}, error: () => {}, info: () => {} });

export function useToast() { return useContext(ToastCtx); }

let _id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    const id = ++_id;
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const remove = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  const ctx: ToastContextValue = {
    success: msg => add('success', msg),
    error:   msg => add('error',   msg),
    info:    msg => add('info',    msg),
  };

  const styles: Record<ToastType, { bg: string; color: string; Icon: React.FC<{ size?: number }> }> = {
    success: { bg: '#d1e7dd', color: '#0a3622', Icon: CheckCircle2 },
    error:   { bg: '#f8d7da', color: '#58151c', Icon: XCircle },
    info:    { bg: '#cfe2ff', color: '#084298', Icon: AlertCircle },
  };

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
        {toasts.map(t => {
          const s = styles[t.type];
          return (
            <div key={t.id} style={{
              background: s.bg, color: s.color,
              borderRadius: 12, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              fontSize: 13, fontWeight: 500,
              minWidth: 260, maxWidth: 380,
              pointerEvents: 'all',
              animation: 'slideIn 0.2s ease',
            }}>
              <s.Icon size={16} />
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: s.color, display: 'flex', opacity: 0.6 }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </ToastCtx.Provider>
  );
}