/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Github, Linkedin, Code2, ArrowDown, Mail } from 'lucide-react';
import { personalInfo } from '../data';

const ROLES = [
  'Cloud Computing Enthusiast',
  'AI/ML Developer',
  'Software Engineer',
  'Problem Solver',
];

/**
 * Isolated role transition subcomponent.
 * Prevents parent Hero re-renders and respects prefers-reduced-motion.
 */
const RotatingRole = memo(function RotatingRole() {
  const [index, setIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 h-10 overflow-hidden select-none">
      <span className="h-[1px] w-8 bg-[#FFD000] shrink-0" aria-hidden="true" />
      <div className="relative h-8 flex items-center min-w-[240px] sm:min-w-[320px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={ROLES[index]}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial italic text-xl sm:text-2xl md:text-[26px] text-[#050505] dark:text-[#FFD000] tracking-wide whitespace-nowrap"
          >
            {ROLES[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  const scrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-10 overflow-hidden bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF]"
    >
      {/* Subtle architectural grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-80 pointer-events-none" />

      {/* Subtle golden hairline accent */}
      <div className="absolute top-24 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD000]/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-16 items-center">
          
          {/* LEFT COLUMN: Editorial Typography, Rotating Identity & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left space-y-6"
          >
            {/* Availability Indicator & Location */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-widest uppercase text-[#525252] dark:text-[#A1A1A1]">
              <span className="inline-flex items-center gap-2 text-[#050505] dark:text-[#FFFFFF] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#FFD000]" aria-hidden="true" />
                Available for Internships &amp; SWE Roles
              </span>
              <span aria-hidden="true" className="text-[#FFD000]">·</span>
              <span>Lucknow, India</span>
            </div>

            {/* Oversized Name Headline */}
            <div>
              <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl xl:text-[82px] leading-[0.96] tracking-tight uppercase text-[#050505] dark:text-[#FFFFFF]">
                <span className="block">SHIWANSHU</span>
                <span className="block mt-1.5">
                  KUMAR{' '}
                  <span className="relative inline-block text-[#050505] dark:text-[#FFD000]">
                    SINGH
                    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#FFD000]" aria-hidden="true" />
                  </span>
                </span>
              </h1>
            </div>

            {/* Smooth Rotating Professional Identity */}
            <RotatingRole />

            {/* Powerful Personal Introduction */}
            <p className="text-base sm:text-lg text-[#525252] dark:text-[#A1A1A1] max-w-2xl leading-relaxed font-sans">
              B.Tech Computer Science undergraduate at{' '}
              <span className="text-[#050505] dark:text-[#FFFFFF] font-medium">
                Babu Banarasi Das University
              </span>
              , specializing in Cloud Computing and Machine Learning. I engineer scalable cloud architectures, production ML pipelines, and resilient software systems built for real-world impact.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollTo('#projects')}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#FFD000] hover:bg-[#ffe047] glow-gold transition-all active:scale-95 cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider text-[#050505] dark:text-[#FFFFFF] bg-transparent border border-[#050505]/25 dark:border-white/20 hover:border-[#FFD000] dark:hover:border-[#FFD000] hover:text-[#050505] dark:hover:text-[#FFD000] transition-all active:scale-95 cursor-pointer"
              >
                <span>Contact Me</span>
              </button>
            </div>

            {/* Social & Coding Profiles */}
            <div className="pt-5 border-t border-[#050505]/12 dark:border-white/12 flex flex-wrap items-center gap-5">
              <a
                href="https://github.com/SHIVASIR"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] transition-colors editorial-underline"
              >
                <Github className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                <span>GitHub</span>
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] transition-colors editorial-underline"
              >
                <Linkedin className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://leetcode.com/u/shiwanshu0711/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode Profile"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] transition-colors editorial-underline"
              >
                <Code2 className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                <span>LeetCode</span>
              </a>

              <a
                href={`mailto:${personalInfo.email}`}
                aria-label="Send Email"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] transition-colors editorial-underline"
              >
                <Mail className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                <span>Email</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Framed Original Portrait Composition with Subtle Parallax */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center w-full"
          >
            <div className="relative w-full max-w-[400px] sm:max-w-[430px]">
              {/* Offset architectural golden corner frame */}
              <div
                className="hidden sm:block absolute -top-3 -right-3 w-full h-full border border-[#FFD000]/50 rounded-xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-[#050505]/15 dark:border-white/15 bg-[#F5F5F5] dark:bg-[#101010]">
                <motion.div style={{ y: imageY }} className="w-full h-full">
                  <img
                    src="/assets/aistudio/image_84dde20b.png"
                    alt="Shiwanshu Kumar Singh — Software Engineer & AI/ML Developer"
                    className="w-full h-full object-cover object-top"
                    fetchPriority="high"
                    loading="eager"
                  />
                </motion.div>

                {/* Subtle bottom scrim for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-transparent to-transparent pointer-events-none" />

                {/* Minimalist Portrait Caption */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display font-bold text-sm text-[#FFFFFF] tracking-tight">
                      Shiwanshu Kumar Singh
                    </p>
                    <p className="text-[11px] font-mono text-[#A1A1A1]">
                      B.Tech CSE · Cloud &amp; ML
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD000] border border-[#FFD000]/40 bg-[#050505]/80 px-2.5 py-1 rounded">
                    SIH &apos;25 Lead
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Guidance */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        onClick={() => scrollTo('#about')}
        className="mx-auto flex flex-col items-center gap-1.5 pb-2 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] transition-colors cursor-pointer select-none"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown className="h-4 w-4 text-[#FFD000]" />
      </motion.button>
    </section>
  );
}
