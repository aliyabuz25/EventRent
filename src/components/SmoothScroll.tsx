import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '../motion/useGsap';
import gsap from 'gsap';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      document.documentElement.classList.remove('lenis');
      document.documentElement.classList.remove('lenis-smooth');
      document.documentElement.classList.remove('lenis-stopped');
      document.body.classList.remove('lenis');
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Bridge Lenis virtual scroll to GSAP ScrollTrigger so pinned/scrubbed
    // sections stay in sync with the smoothed scroll position.
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
    };
  }, []);

  return <>{children}</>;
}
