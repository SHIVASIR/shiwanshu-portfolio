/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete?: () => void;
  durationMs?: number;
}

export default function Preloader({ onComplete, durationMs = 950 }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasLoaded = sessionStorage.getItem('portfolio_preloader_shown');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !hasLoaded && !prefersReduced;
  });

  useEffect(() => {
    if (!isVisible) {
      if (onComplete) onComplete();
      return;
    }

    sessionStorage.setItem('portfolio_preloader_shown', 'true');

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, durationMs);

    return () => {
      clearTimeout(timer);
    };
  }, [durationMs, isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-2 mb-6"
            >
              <span className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#FFFFFF]">
                SHIWANSHU
              </span>
              <span className="font-editorial italic text-3xl sm:text-4xl text-[#FFD000]">
                .
              </span>
            </motion.div>

            <div className="w-40 h-[2px] bg-white/10 overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full bg-[#FFD000]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
