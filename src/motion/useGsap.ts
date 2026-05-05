import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGsap = (
  callback: () => void,
  options: any[] | { dependencies?: any[]; scope?: React.RefObject<any> } = []
) => {
  const deps = Array.isArray(options) ? options : (options.dependencies || []);
  const scope = Array.isArray(options) ? undefined : options.scope;

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(callback, scope?.current);
    return () => ctx.revert();
  }, deps);
};

export { gsap, ScrollTrigger };
