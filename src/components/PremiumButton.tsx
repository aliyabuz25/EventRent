import React, { useRef, MouseEvent } from 'react';
import { cn } from '../lib/utils';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PremiumButton({ children, className, ...props }: PremiumButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty('--x', `${x}px`);
    btnRef.current.style.setProperty('--y', `${y}px`);
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden bg-white text-black px-12 py-5 rounded-[24px] font-black cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(227,6,19,0.3)] disabled:opacity-50 transition-shadow duration-500",
        className
      )}
      {...props}
    >
      <style>{`
        .premium-btn-overlay {
          clip-path: circle(0px at var(--x, 50%) var(--y, 50%));
          transition: clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .group:hover .premium-btn-overlay {
          clip-path: circle(150% at var(--x, 50%) var(--y, 50%));
        }
      `}</style>
      <div className="premium-btn-overlay absolute inset-0 bg-premium-orange pointer-events-none z-0" />
      
      <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-300 w-full h-full">
        {children}
      </span>
    </button>
  );
}
