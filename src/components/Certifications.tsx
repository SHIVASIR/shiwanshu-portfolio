/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, ShieldCheck, ExternalLink } from 'lucide-react';
import { certifications } from '../data';

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-[#050505]/12 dark:border-white/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-[#FFD000]" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#525252] dark:text-[#FFD000] uppercase">
              08. Credentials
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight max-w-3xl">
            Accredited Industry{' '}
            <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
              Certifications
            </span>
          </h2>
        </div>

        {/* Clean Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              key={cert.id}
              className="p-6 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-colors flex flex-col justify-between gap-4 text-left group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#050505] dark:text-[#FFD000]" />
                    <span>{cert.date}</span>
                  </span>
                  <ShieldCheck className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                </div>

                <h3 className="font-display font-bold text-lg text-[#050505] dark:text-[#FFFFFF] group-hover:text-[#B89400] dark:group-hover:text-[#FFD000] transition-colors">
                  {cert.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                  <span className="text-[#050505] dark:text-[#FFD000] font-semibold">
                    {cert.issuer}
                  </span>
                  {cert.credentialId && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>ID: {cert.credentialId}</span>
                    </>
                  )}
                </div>
              </div>

              {cert.link && (
                <div className="pt-4 border-t border-[#050505]/10 dark:border-white/10">
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#050505] dark:text-[#FFD000] hover:underline"
                  >
                    <span>Verify Certificate</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
