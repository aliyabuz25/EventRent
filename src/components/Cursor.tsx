import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

const INTERACTIVE = [
  'a[href]', 'button', 'summary', 'select', 'label',
  '[role="button"]', '[role="link"]', '[role="menuitem"]',
  '[tabindex]:not([tabindex="-1"])', '.interactive', '[data-cursor="button"]',
].join(', ');

const INPUT = [
  'textarea',
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="color"])',
  '[contenteditable=""]', '[contenteditable="true"]', '[role="textbox"]',
].join(', ');

const TEXT = [
  'p', 'span', 'li', 'blockquote', 'figcaption', 'small',
  'strong', 'em', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  '[data-cursor="text"]',
].join(', ');

type CursorType = 'default' | 'interactive' | 'input' | 'text';

export default function Cursor() {
  const mouse = { x: useMotionValue(0), y: useMotionValue(0) };
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouse.x, springConfig);
  const cursorY = useSpring(mouse.y, springConfig);

  const [type, setType] = useState<CursorType>('default');

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(INTERACTIVE)) setType('interactive');
      else if (t.closest(INPUT))   setType('input');
      else if (t.closest(TEXT))    setType('text');
      else                          setType('default');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [mouse.x, mouse.y]);

  const isInteractive = type === 'interactive';
  const isInput       = type === 'input';
  const isText        = type === 'text';

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] bg-premium-orange"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', width: 12, height: 12 }}
        animate={{
          scaleX:  isInteractive ? 0.35 : isText ? 0.15 : 1,
          scaleY:  isInteractive ? 0.35 : isText ? 1.6  : 1,
          opacity: isInteractive ? 0    : 1,
          borderRadius: isText ? 2 : 9999,
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      />

      {/* Ring — becomes a tall narrow ellipse on text */}
      <motion.div
        className="fixed top-0 left-0 border border-premium-orange/30 pointer-events-none z-[9999]"
        style={{ x: mouse.x, y: mouse.y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width:       isInteractive || isText ? 18 : 40,
          height:      isInteractive ? 18 : isText ? 28 : 40,
          borderRadius: 9999,
          opacity:     isInput || isInteractive ? 0 : isText ? 0.35 : 1,
          borderColor: isInteractive
            ? 'rgba(227, 6, 19, 0)'
            : isText
            ? 'rgba(242, 125, 38, 0.45)'
            : 'rgba(242, 125, 38, 0.3)',
          scale: isInteractive ? 0.55 : 1,
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 170 }}
      />
    </>
  );
}