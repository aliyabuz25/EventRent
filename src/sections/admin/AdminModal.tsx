import React, { useEffect, useRef } from 'react';

interface AdminModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export default function AdminModal({ show, onClose, title, children, size = 'md', footer }: AdminModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!backdropRef.current || !dialogRef.current) return;
    if (show) {
      backdropRef.current.style.opacity = '0';
      dialogRef.current.style.opacity = '0';
      dialogRef.current.style.transform = 'scale(0.96) translateY(-8px)';
      requestAnimationFrame(() => {
        backdropRef.current!.style.transition = 'opacity 200ms ease';
        dialogRef.current!.style.transition = 'opacity 220ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)';
        backdropRef.current!.style.opacity = '1';
        dialogRef.current!.style.opacity = '1';
        dialogRef.current!.style.transform = 'scale(1) translateY(0)';
      });
    }
  }, [show]);

  const handleClose = () => {
    if (!backdropRef.current || !dialogRef.current) return onClose();
    backdropRef.current.style.transition = 'opacity 160ms ease';
    dialogRef.current.style.transition = 'opacity 160ms ease, transform 160ms ease';
    backdropRef.current.style.opacity = '0';
    dialogRef.current.style.opacity = '0';
    dialogRef.current.style.transform = 'scale(0.97) translateY(4px)';
    setTimeout(onClose, 160);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    if (show) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [show]);

  if (!show) return null;

  const maxW = { sm: 400, md: 560, lg: 720, xl: 900 }[size];

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1055,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        ref={dialogRef}
        style={{
          width: '100%', maxWidth: maxW,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 48px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0',
          flexShrink: 0,
        }}>
          <h5 style={{ margin: 0, fontWeight: 700, fontSize: 17, color: '#111' }}>{title}</h5>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 6,
              borderRadius: 8, color: '#999', fontSize: 20, lineHeight: 1,
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f5f5f5'; (e.currentTarget as HTMLButtonElement).style.color = '#333'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#999'; }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #f0f0f0',
            display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}