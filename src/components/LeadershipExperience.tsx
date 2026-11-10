/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Share2,
  Compass,
  Megaphone,
  PenTool,
  Users,
  Rocket,
  GitBranch,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ResponsibilityArea {
  id: string;
  index: string;
  title: string;
  focus: string;
  icon: typeof Share2;
}

const RESPONSIBILITY_AREAS: ResponsibilityArea[] = [
  {
    id: 'social-strategy',
    index: '01',
    title: 'Social Media Strategy',
    focus: 'Channel architecture & editorial cadence',
    icon: Share2,
  },
  {
    id: 'brand-positioning',
    index: '02',
    title: 'Brand Building & Positioning',
    focus: 'Identity clarity & market narrative',
    icon: Compass,
  },
  {
    id: 'digital-marketing',
    index: '03',
    title: 'Digital Marketing',
    focus: 'Cross-channel reach & growth funnels',
    icon: Megaphone,
  },
  {
    id: 'content-planning',
    index: '04',
    title: 'Content Planning & Strategy',
    focus: 'Storytelling frameworks & calendars',
    icon: PenTool,
  },
  {
    id: 'audience-engagement',
    index: '05',
    title: 'Audience Engagement',
    focus: 'Community resonance & feedback loops',
    icon: Users,
  },
  {
    id: 'marketing-campaigns',
    index: '06',
    title: 'Marketing Campaigns',
    focus: 'Launch execution & initiative rollouts',
    icon: Rocket,
  },
  {
    id: 'team-coordination',
    index: '07',
    title: 'Team Coordination',
    focus: 'Cross-functional creative alignment',
    icon: GitBranch,
  },
  {
    id: 'digital-presence',
    index: '08',
    title: 'Digital Brand Presence',
    focus: 'Cohesive touchpoints across platforms',
    icon: Globe,
  },
];

const INSOLZE_URL = 'https://insolze.com/';
const INSOLZE_LOGO_PRIMARY = 'https://www.insolze.com/favicon-circle.png';
const INSOLZE_LOGO_FALLBACK = 'https://www.insolze.com/logo.jpg';

export default function LeadershipExperience() {
  const [logoSrc, setLogoSrc] = useState<string>(INSOLZE_LOGO_PRIMARY);
  const [logoFailed, setLogoFailed] = useState(false);

  const handleLogoError = () => {
    if (logoSrc === INSOLZE_LOGO_PRIMARY) {
      setLogoSrc(INSOLZE_LOGO_FALLBACK);
    } else {
      setLogoFailed(true);
    }
  };

  return (
    <section
      id="leadership"
      className="py-24 sm:py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-[#050505]/12 dark:border-white/12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — Asymmetric Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 pb-8 border-b border-[#050505]/10 dark:border-white/10">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-[2px] w-8 bg-[#FFD000]" />
              <span className="text-xs font-mono tracking-[0.22em] text-[#525252] dark:text-[#FFD000] uppercase">
                03. Leadership &amp; Experience
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight leading-[1.08]"
            >
              Leading Ideas.{' '}
              <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
                Building Influence.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-5 lg:text-right flex flex-col lg:items-end justify-end gap-3"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#FFD000]/50 bg-[#FFD000]/10 text-[11px] font-mono uppercase tracking-[0.18em] text-[#050505] dark:text-[#FFD000] w-fit">
              <Sparkles className="h-3 w-3 text-[#FFD000]" />
              <span>Engineer | Leader | Creator</span>
            </span>
            <p className="text-sm sm:text-base text-[#525252] dark:text-[#A1A1A1] leading-relaxed max-w-md font-sans">
              Beyond technology, I believe in building brands, leading initiatives, and creating meaningful digital experiences.
            </p>
          </motion.div>
        </div>

        {/* Main Asymmetric Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (5 cols): Featured InSolZe Executive Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col justify-between p-7 sm:p-8 rounded-2xl bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 hover:border-[#FFD000] transition-colors duration-300 relative overflow-hidden"
          >
            {/* Subtle Top Gold Hairline Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FFD000]" />

            <div className="space-y-6">
              {/* Top Row: Official Logo + Current Position Indicator */}
              <div className="flex items-start justify-between gap-4">
                <a
                  href={INSOLZE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  aria-label="Visit InSolZe official website"
                >
                  <div className="h-14 w-14 rounded-xl bg-[#050505] border border-[#FFD000]/40 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#FFD000] transition-colors">
                    {!logoFailed ? (
                      <img
                        src={logoSrc}
                        alt="InSolZe Official Logo"
                        onError={handleLogoError}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-display font-bold text-lg text-[#FFD000] tracking-tight">
                        IS
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-2xl text-[#050505] dark:text-[#FFFFFF] group-hover:text-[#B89400] dark:group-hover:text-[#FFD000] transition-colors tracking-tight">
                        InSolZe
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[#FFD000] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <span className="text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1] tracking-wider">
                      insolze.com
                    </span>
                  </div>
                </a>

                {/* Current Status Indicator */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FFFFFF] dark:bg-[#171717] border border-[#FFD000]/50 shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD000] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD000]" />
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#050505] dark:text-[#FFD000]">
                    Current
                  </span>
                </div>
              </div>

              {/* Designation Block */}
              <div className="pt-4 border-t border-[#050505]/10 dark:border-white/10 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#525252] dark:text-[#A1A1A1]">
                  Designation
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#050505] dark:text-[#FFFFFF] leading-snug">
                  Head of Social Media &amp;{' '}
                  <span className="text-[#050505] dark:text-[#FFD000]">Marketing</span>
                </h3>
              </div>

              {/* Role Description */}
              <p className="text-sm text-[#525252] dark:text-[#A1A1A1] leading-relaxed font-sans">
                Leading social media and marketing initiatives, contributing to brand positioning, digital presence, content strategy, and audience engagement.
              </p>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-8 mt-8 border-t border-[#050505]/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                <span className="block text-[9px] uppercase tracking-widest opacity-75">
                  Official Portal
                </span>
                <a
                  href={INSOLZE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#050505] dark:text-[#FFFFFF] hover:text-[#FFD000] transition-colors underline underline-offset-4 decoration-[#FFD000]/50"
                >
                  https://insolze.com/
                </a>
              </div>

              <a
                href={INSOLZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#FFD000] hover:bg-[#ffe047] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shrink-0"
              >
                <span>EXPLORE INSOLZE</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Column (7 cols): Key Responsibilities Matrix */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#525252] dark:text-[#A1A1A1]">
                Key Responsibility Areas
              </span>
              <span className="text-[11px] font-mono text-[#050505] dark:text-[#FFD000]">
                08 Core Pillars
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 h-full">
              {RESPONSIBILITY_AREAS.map((area, idx) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={area.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className="group p-4 sm:p-5 rounded-xl bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/10 dark:border-white/10 hover:border-[#FFD000] transition-all duration-200 flex items-start gap-4"
                  >
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#171717] border border-[#050505]/10 dark:border-white/10 text-[#050505] dark:text-[#FFD000] group-hover:bg-[#FFD000] group-hover:text-[#050505] group-hover:border-[#FFD000] transition-colors shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-display font-bold text-sm text-[#050505] dark:text-[#FFFFFF] leading-snug">
                          {area.title}
                        </h4>
                        <span className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1] group-hover:text-[#050505] dark:group-hover:text-[#FFD000] transition-colors shrink-0">
                          {area.index}
                        </span>
                      </div>
                      <p className="text-xs text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                        {area.focus}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
