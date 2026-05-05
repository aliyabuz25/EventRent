import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function Cursor() {
  const mouse = { x: useMotionValue(0), y: useMotionValue(0) };
  
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouse.x, springConfig);
  const cursorY = useSpring(mouse.y, springConfig);

  const [hoverType, setHoverType] = useState<'default' | 'button' | 'text'>('default');
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x.set(e.clientX - 6);
      mouse.y.set(e.clientY - 6);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isSelectable = target.closest('button, a, .interactive');
      const isText = target.closest('h1, h2, h3, p, span') && !isSelectable;

      if (isSelectable) {
        setHoverType('button');
      } else if (isText) {
        setHoverType('text');
      } else {
        setHoverType('default');
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-premium-orange rounded-full pointer-events-none z-[10000]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: hoverType !== 'default' ? 2 : (isClicking ? 0.8 : 1),
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-premium-orange/30 rounded-full pointer-events-none z-[9999]"
        style={{
          x: mouse.x,
          y: mouse.y,
          translateX: '-14px',
          translateY: '-14px',
        }}
        animate={{
          scale: hoverType === 'button' ? 2.5 : (hoverType === 'text' ? 1.8 : 1),
          opacity: isClicking ? 0 : 1,
          borderColor: hoverType === 'button' ? 'rgba(242, 125, 38, 0.6)' : 'rgba(242, 125, 38, 0.3)'
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      />
    </>
  );
}
