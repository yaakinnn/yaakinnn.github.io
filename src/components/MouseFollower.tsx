/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function MouseFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('VIEW');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Motion coordinates for physics-based spring lag
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 350, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch capable devices to prevent lag or overlay issues
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16); // Center the custom cursor
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Track active mouse followers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverAttr = target.closest('[data-cursor]');
      
      if (hoverAttr) {
        setIsHovered(true);
        const text = hoverAttr.getAttribute('data-cursor') || 'VIEW';
        setHoverText(text);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.body.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.body.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-50 mix-blend-difference flex items-center justify-center text-[8px] font-mono tracking-widest text-black"
      style={{
        x: cursorX,
        y: cursorY,
        width: isHovered ? '70px' : '32px',
        height: isHovered ? '70px' : '32px',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
        borderColor: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
      }}
      transition={{
        width: { type: 'spring', damping: 25, stiffness: 200 },
        height: { type: 'spring', damping: 25, stiffness: 200 },
        backgroundColor: { duration: 0.15 },
        borderColor: { duration: 0.15 },
      }}
      id="custom-mouse-follower"
    >
      {isHovered && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="font-bold text-black select-none pointer-events-none font-display uppercase"
        >
          {hoverText}
        </motion.span>
      )}
    </motion.div>
  );
}
