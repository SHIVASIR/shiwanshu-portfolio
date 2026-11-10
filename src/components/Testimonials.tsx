/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  UserCheck, 
  Sparkles, 
  Grid, 
  Play, 
  Pause,
  MessageSquareQuote,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { testimonialList } from '../data';
import { Testimonial } from '../types';
import Guestbook from './Guestbook';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'guestbook'>('carousel');
  const [isAutoplay, setIsAutoplay] = useState(true);

  const total = testimonialList.length;

  // Autoplay functionality for carousel
  useEffect(() => {
    if (!isAutoplay || viewMode !== 'carousel') return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isAutoplay, viewMode]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const currentTestimonial: Testimonial = testimonialList[currentIndex];

  // Animation variants for carousel slides
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <section
      id="testimonials"
      className="py-24 sm:py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-black/10 dark:border-white/12 overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title and Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-[#FFD000]" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#050505] dark:text-[#FFD000] uppercase">
                09 / Testimonials & Endorsements
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight uppercase">
              Mentor & Peer{' '}
              <span className="font-editorial italic font-normal text-[#FFD000] lowercase">
                reviews.
              </span>
            </h2>
          </div>

          {/* View Controls & Autoplay Toggle */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            {/* Carousel / Grid / Guestbook Toggle */}
            <div className="bg-[#FAFAFA] dark:bg-[#101010] p-1 rounded-xl border border-black/10 dark:border-white/12 flex items-center gap-1 font-mono text-xs">
              <button
                id="testimonial-view-carousel"
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#FFD000] text-[#050505] font-bold shadow-sm'
                    : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Carousel</span>
              </button>
              <button
                id="testimonial-view-grid"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#FFD000] text-[#050505] font-bold shadow-sm'
                    : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>All Grid</span>
              </button>
              <button
                id="testimonial-view-guestbook"
                onClick={() => setViewMode('guestbook')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'guestbook'
                    ? 'bg-[#FFD000] text-[#050505] font-bold shadow-sm'
                    : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <MessageSquareQuote className="h-3.5 w-3.5" />
                <span>Community Wall</span>
              </button>
            </div>

            {/* Play/Pause Autoplay button when in Carousel mode */}
            {viewMode === 'carousel' && (
              <button
                id="testimonial-toggle-autoplay"
                onClick={() => setIsAutoplay(!isAutoplay)}
                title={isAutoplay ? 'Pause Autoplay' : 'Start Autoplay'}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isAutoplay
                    ? 'bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border-[#FFD000]/40 hover:bg-[#FFD000]/25'
                    : 'bg-[#FAFAFA] dark:bg-[#101010] text-[#525252] dark:text-[#A1A1A1] border-black/10 dark:border-white/12 hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* CAROUSEL VIEW */}
        {viewMode === 'carousel' && (
          <div
            className="relative"
            onMouseEnter={() => setIsAutoplay(false)}
            onMouseLeave={() => setIsAutoplay(true)}
          >
            {/* Main Carousel Card Container */}
            <div className="min-h-[320px] sm:min-h-[300px] flex items-center justify-center relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full max-w-4xl p-6 sm:p-10 rounded-2xl bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 relative overflow-hidden group"
                >
                  {/* Decorative Watermark Quote Icon */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.06] text-[#FFD000] pointer-events-none">
                    <Quote className="h-48 w-48 rotate-12" />
                  </div>

                  {/* Header Row: Badge & Rating */}
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40 rounded-md flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-[#050505] dark:text-[#FFD000]" />
                        {currentTestimonial.highlightBadge || 'Endorsement'}
                      </span>
                      <span className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1] font-semibold">
                        {currentTestimonial.date}
                      </span>
                    </div>

                    {/* 5 Star Rating */}
                    <div className="flex items-center space-x-1 bg-white dark:bg-[#171717] px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/12">
                      {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#FFD000] text-[#FFD000]" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <div className="relative z-10 my-4">
                    <p className="text-base sm:text-lg md:text-xl text-[#050505] dark:text-[#FFFFFF] font-medium leading-relaxed italic select-text">
                      "{currentTestimonial.quote}"
                    </p>
                  </div>

                  {/* Author Info Block */}
                  <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between flex-wrap gap-4 relative z-10">
                    <div className="flex items-center space-x-4">
                      {/* Avatar Initials Badge */}
                      <div className="w-12 h-12 rounded-xl bg-[#FFD000] flex items-center justify-center text-[#050505] font-display font-extrabold text-base shrink-0">
                        {currentTestimonial.initials}
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-[#050505] dark:text-[#FFFFFF] flex items-center">
                          {currentTestimonial.author}
                          <UserCheck className="h-4 w-4 text-[#FFD000] ml-1.5" />
                        </h4>
                        <p className="text-xs text-[#525252] dark:text-[#A1A1A1] font-medium">
                          {currentTestimonial.designation}
                        </p>
                        <p className="text-[11px] text-[#525252] dark:text-[#A1A1A1] flex items-center mt-0.5 font-mono">
                          <Building2 className="h-3 w-3 mr-1" />
                          {currentTestimonial.organization} •{' '}
                          <span className="text-[#050505] dark:text-[#FFD000] ml-1 font-semibold">
                            {currentTestimonial.relationship}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Counter Indicator */}
                    <div className="text-xs font-mono text-[#525252] dark:text-[#A1A1A1] bg-white dark:bg-[#171717] px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/12 font-bold">
                      <span className="text-[#050505] dark:text-[#FFD000]">0{currentIndex + 1}</span> / 0{total}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls Row */}
            <div className="flex items-center justify-between mt-8 max-w-4xl mx-auto px-2">
              {/* Dots */}
              <div className="flex items-center space-x-2">
                {testimonialList.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-8 bg-[#FFD000]'
                        : 'w-2.5 bg-black/15 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  id="testimonial-prev-btn"
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 text-[#050505] dark:text-[#FFFFFF] hover:border-[#FFD000] transition-all group active:scale-95 cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  id="testimonial-next-btn"
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 text-[#050505] dark:text-[#FFFFFF] hover:border-[#FFD000] transition-all group active:scale-95 cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {testimonialList.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="p-6 sm:p-8 rounded-2xl bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 flex flex-col justify-between hover:border-[#FFD000]/60 transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40 rounded-md">
                      {item.highlightBadge}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-[#FFD000] text-[#FFD000]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#050505]/90 dark:text-[#FFFFFF]/90 italic leading-relaxed mb-6">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD000] flex items-center justify-center text-[#050505] font-display font-bold text-sm shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#050505] dark:text-[#FFFFFF] leading-none flex items-center">
                      {item.author}
                      <UserCheck className="h-3.5 w-3.5 text-[#FFD000] ml-1" />
                    </h4>
                    <p className="text-[11px] text-[#525252] dark:text-[#A1A1A1] mt-1">
                      {item.designation}
                    </p>
                    <p className="text-[10px] text-[#525252] dark:text-[#A1A1A1] font-mono mt-0.5">
                      {item.organization} •{' '}
                      <span className="text-[#050505] dark:text-[#FFD000] font-semibold">
                        {item.relationship}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* GUESTBOOK VIEW */}
        {viewMode === 'guestbook' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Guestbook />
          </motion.div>
        )}
      </div>
    </section>
  );
}
