/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { experienceList } from '../data';

export default function Experience() {
  const [selectedId, setSelectedId] = useState(experienceList[0].id);
  const selectedExp = experienceList.find((exp) => exp.id === selectedId) || experienceList[0];

  return (
    <section
      id="experience"
      className="py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-[#050505]/12 dark:border-white/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-[#FFD000]" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#525252] dark:text-[#FFD000] uppercase">
              04. Experience &amp; Leadership
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight max-w-3xl">
            Engineering Roles &amp;{' '}
            <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
              Technical Leadership
            </span>
          </h2>
        </div>

        {/* Interactive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Role Selector List */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 scrollbar-hide">
            {experienceList.map((exp, idx) => {
              const isSelected = exp.id === selectedId;
              const isCurrent = idx === 0;

              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedId(exp.id)}
                  className={`p-4 text-left rounded-xl transition-all shrink-0 relative cursor-pointer border ${
                    isSelected
                      ? 'bg-[#FAFAFA] dark:bg-[#101010] border-[#FFD000] text-[#050505] dark:text-[#FFFFFF]'
                      : 'bg-transparent border-[#050505]/10 dark:border-white/10 text-[#525252] dark:text-[#A1A1A1] hover:border-[#050505]/30 dark:hover:border-white/25 hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display font-bold text-sm tracking-tight">
                      {exp.role}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFD000] text-[#050505] font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#050505] dark:text-[#FFD000]">
                    {exp.company}
                  </div>
                  <div className="text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1] mt-1">
                    {exp.duration}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-8 min-h-[340px] text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedExp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 sm:p-8 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010]"
              >
                <div className="space-y-3 pb-6 border-b border-[#050505]/12 dark:border-white/12">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#050505] dark:text-[#FFFFFF]">
                      {selectedExp.role}{' '}
                      <span className="text-[#525252] dark:text-[#FFD000] font-normal">
                        @ {selectedExp.company}
                      </span>
                    </h3>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md bg-[#FFFFFF] dark:bg-[#171717] border border-[#050505]/12 dark:border-white/12 text-[#050505] dark:text-[#FFFFFF] shrink-0">
                      <Calendar className="h-3.5 w-3.5 text-[#050505] dark:text-[#FFD000]" />
                      <span>{selectedExp.duration}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#050505] dark:text-[#FFD000]" />
                      <span>{selectedExp.location}</span>
                    </span>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#525252] dark:text-[#A1A1A1]">
                    Key Deliverables &amp; Impact
                  </h4>
                  <ul className="space-y-3">
                    {selectedExp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm text-[#050505]/90 dark:text-[#FFFFFF]/90 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-[#050505] dark:text-[#FFD000] mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedExp.skills && (
                  <div className="pt-4 border-t border-[#050505]/12 dark:border-white/12 flex flex-wrap items-center gap-2 text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                    <span className="uppercase tracking-wider mr-1 text-[#050505] dark:text-[#FFFFFF]">
                      Stack:
                    </span>
                    {selectedExp.skills.map((sk, sIdx) => (
                      <span key={sIdx} className="inline-flex items-center gap-2">
                        <span>{sk}</span>
                        {sIdx < selectedExp.skills!.length - 1 && (
                          <span aria-hidden="true" className="text-[#FFD000]">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
