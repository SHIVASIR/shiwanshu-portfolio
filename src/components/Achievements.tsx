/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Award, Trophy, Users, Star } from 'lucide-react';
import { achievements } from '../data';

const achievementIcons: { [key: string]: any } = {
  'ach-1': Users,
  'ach-2': Trophy,
  'ach-3': Award,
};

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-[#050505]/12 dark:border-white/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-[#FFD000]" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#525252] dark:text-[#FFD000] uppercase">
              06. Honors &amp; Distinctions
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight max-w-3xl">
            National Recognitions &amp;{' '}
            <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
              Competitive Honors
            </span>
          </h2>
        </div>

        {/* Clean 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => {
            const IconComponent = achievementIcons[ach.id] || Award;

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                key={ach.id}
                className="p-6 sm:p-7 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-colors flex flex-col justify-between text-left group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg border border-[#050505]/12 dark:border-white/12 bg-[#FFFFFF] dark:bg-[#171717] text-[#050505] dark:text-[#FFD000]">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                      {ach.date}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-[#525252] dark:text-[#A1A1A1]">
                      {ach.issuer}
                    </p>
                    <h3 className="font-display font-bold text-lg text-[#050505] dark:text-[#FFFFFF] group-hover:text-[#B89400] dark:group-hover:text-[#FFD000] transition-colors leading-snug">
                      {ach.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#050505]/10 dark:border-white/10 pt-4 mt-6 flex items-center justify-between text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                  <span>Verified Distinction</span>
                  {ach.highlight && (
                    <span className="text-[#050505] dark:text-[#FFD000] inline-flex items-center gap-1 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-[#FFD000] text-[#FFD000]" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
