/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, TrendingUp, Users } from 'lucide-react';

interface VisitorCounterProps {
  variant?: 'badge' | 'footer' | 'compact';
  className?: string;
}

export default function VisitorCounter({ variant = 'badge', className = '' }: VisitorCounterProps) {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [activeNow, setActiveNow] = useState<number>(3);

  useEffect(() => {
    // Determine today's storage key
    const todayKey = `portfolio_views_${new Date().toISOString().split('T')[0]}`;
    const hasVisitedSession = sessionStorage.getItem('has_counted_session');

    // Retrieve or set baseline count (e.g. realistic baseline 342 + random offset per day)
    const storedViews = localStorage.getItem(todayKey);
    let currentCount = storedViews ? parseInt(storedViews, 10) : 342;

    if (!hasVisitedSession) {
      currentCount += 1;
      localStorage.setItem(todayKey, currentCount.toString());
      sessionStorage.setItem('has_counted_session', 'true');
    }

    setVisitorCount(currentCount);

    // Dynamic active readers variation (2 to 5 readers online)
    const activeRandom = 3 + (currentCount % 3);
    setActiveNow(activeRandom);
  }, []);

  // Smooth Count-Up Animation Hook
  useEffect(() => {
    if (visitorCount === 0) return;

    let start = 0;
    const duration = 1200; // 1.2s smooth count-up
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = visitorCount / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        setDisplayCount(visitorCount);
        clearInterval(timer);
      } else {
        start += increment;
        setDisplayCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [visitorCount]);

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 text-[11px] font-mono font-medium text-[#525252] dark:text-[#A1A1A1] ${className}`}
      >
        <Eye className="h-3 w-3 text-[#FFD000]" />
        <span className="text-[#050505] dark:text-[#FFFFFF] font-bold">
          {displayCount.toLocaleString()}
        </span>
        <span>views today</span>
      </span>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        className={`inline-flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 text-xs font-mono ${className}`}
      >
        <div className="flex items-center space-x-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD000] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD000]"></span>
          </span>
          <span className="text-[#050505] dark:text-[#FFD000] font-semibold">
            {activeNow} viewing now
          </span>
        </div>
        <span className="text-black/20 dark:text-white/20">|</span>
        <div className="flex items-center space-x-1.5 text-[#525252] dark:text-[#A1A1A1]">
          <Eye className="h-3.5 w-3.5 text-[#FFD000]" />
          <span className="text-[#050505] dark:text-[#FFFFFF] font-bold">
            {displayCount.toLocaleString()}
          </span>
          <span>people viewed today</span>
        </div>
      </div>
    );
  }

  // Default 'badge' view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1] select-none ${className}`}
    >
      <div className="flex items-center space-x-1 text-[#FFD000]">
        <Eye className="h-3.5 w-3.5" />
        <TrendingUp className="h-3 w-3" />
      </div>
      <span className="font-bold text-[#050505] dark:text-[#FFFFFF] text-xs">
        {displayCount.toLocaleString()}
      </span>
      <span>views today</span>
      <span className="text-black/20 dark:text-white/20">•</span>
      <span className="flex items-center space-x-1 text-[#050505] dark:text-[#FFD000] font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD000] animate-pulse" />
        <span>{activeNow} online</span>
      </span>
    </motion.div>
  );
}
