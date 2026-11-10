/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { GraduationCap, Code, Brain, Cloud, Database, MapPin } from 'lucide-react';
import { educationList } from '../data';

const coreDomains = [
  {
    number: '01',
    name: 'Cloud Computing & Distributed Systems',
    icon: Cloud,
    desc: 'Designing containerized microservices with Docker, evaluating cloud latency across AWS and Azure, and managing API gateways.',
  },
  {
    number: '02',
    name: 'Machine Learning & Predictive Modeling',
    icon: Brain,
    desc: 'End-to-end ML pipelines: LightGBM for extreme imbalanced fraud datasets, SMOTE calibration, and ROC-AUC score optimization.',
  },
  {
    number: '03',
    name: 'Algorithms & Data Structures',
    icon: Code,
    desc: '240+ LeetCode problems solved with focus on optimal asymptotic complexity, graph traversals, and dynamic programming.',
  },
  {
    number: '04',
    name: 'Relational Database Engineering',
    icon: Database,
    desc: 'Custom B+ tree disk indexing, schema validation, ACID relational algebra execution, and IBM Db2 SQL query optimization.',
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-[#050505]/12 dark:border-white/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-[#FFD000]" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#525252] dark:text-[#FFD000] uppercase">
              01. About &amp; Philosophy
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#050505] dark:text-[#FFFFFF] leading-[1.1]">
            Merging Cloud Architecture with{' '}
            <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
              Machine Intelligence.
            </span>
          </h2>
        </motion.div>

        {/* Asymmetrical Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          
          {/* Left Column: Narrative & Core Domains (7 cols) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            <div className="space-y-6 text-base sm:text-lg text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
              <p>
                I am a Computer Science undergraduate at{' '}
                <strong className="text-[#050505] dark:text-[#FFFFFF] font-semibold">
                  Babu Banarasi Das University
                </strong>
                , Lucknow, specializing in Cloud Computing and Machine Learning.
              </p>
              <p>
                My engineering journey is anchored in algorithmic rigor, architectural scalability, and measurable utility. From building an end-to-end Credit Card Fraud Detection System that lifted minority recall to 91% to leading team{' '}
                <em className="text-[#050505] dark:text-[#FFFFFF] not-italic font-medium">
                  Awishkari Syndicate
                </em>{' '}
                at the Smart India Hackathon (SIH 2025), I focus on software that holds up under real-world constraints.
              </p>

              <div className="pt-4 border-t border-[#050505]/12 dark:border-white/12">
                <p className="text-xs font-mono uppercase tracking-widest text-[#B89400] dark:text-[#FFD000] mb-2">
                  Career Objective
                </p>
                <p className="text-sm sm:text-base text-[#050505] dark:text-[#FFFFFF]/90 leading-relaxed">
                  Eager to leverage specialized training in distributed cloud systems and machine learning to engineer high-throughput, fault-tolerant backend solutions.
                </p>
              </div>
            </div>

            {/* 2x2 Minimalist Swiss Domain Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {coreDomains.map((domain, idx) => {
                const Icon = domain.icon;
                return (
                  <motion.div
                    key={domain.number}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className="p-6 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-[#525252] dark:text-[#FFD000]">
                        {domain.number}
                      </span>
                      <Icon className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                    </div>
                    <h3 className="font-display font-bold text-base text-[#050505] dark:text-[#FFFFFF] mb-2 group-hover:text-[#B89400] dark:group-hover:text-[#FFD000] transition-colors">
                      {domain.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                      {domain.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Academic Background & Key Distinctions (5 cols) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            {/* Academic Timeline */}
            <div className="p-6 sm:p-8 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010]">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#050505]/12 dark:border-white/12">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-5 w-5 text-[#050505] dark:text-[#FFD000]" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#050505] dark:text-[#FFFFFF]">
                    Education
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                  2024 – 2028
                </span>
              </div>

              <div className="space-y-8">
                {educationList.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className={`${idx !== 0 ? 'pt-6 border-t border-[#050505]/10 dark:border-white/10' : ''}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#525252] dark:text-[#A1A1A1] mb-1.5">
                      <span className="text-[#050505] dark:text-[#FFD000] font-semibold">
                        {edu.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {edu.location}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-[#050505] dark:text-[#FFFFFF]">
                      {edu.institution}
                    </h4>
                    <p className="text-xs font-medium text-[#525252] dark:text-[#FFFFFF]/80 mt-0.5">
                      {edu.degree}
                    </p>
                    {edu.description && (
                      <p className="text-xs text-[#525252] dark:text-[#A1A1A1] leading-relaxed mt-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="p-6 sm:p-8 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#050505]/12 dark:border-white/12">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#050505] dark:text-[#FFFFFF]">
                  Notable Milestones
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#FFD000]" aria-hidden="true" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#050505] dark:text-[#FFD000] font-semibold">
                      Smart India Hackathon 2025
                    </span>
                    <span className="text-[#525252] dark:text-[#A1A1A1]">National Finalist</span>
                  </div>
                  <p className="text-xs text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                    Team Leader for Awishkari Syndicate — engineered microservices architecture presented to Government of India evaluation panel.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#050505]/10 dark:border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#050505] dark:text-[#FFD000] font-semibold">
                      Problem of the Week Winner
                    </span>
                    <span className="text-[#525252] dark:text-[#A1A1A1]">BBDU Engineering</span>
                  </div>
                  <p className="text-xs text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                    First place ranking in university algorithmic challenges with optimal space-time asymptotic complexity in C++.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
