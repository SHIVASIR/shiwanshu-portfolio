/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Terminal,
  Globe,
  Cloud,
  Brain,
  Database,
  Wrench,
} from 'lucide-react';
import { skillCategories } from '../data';

interface SkillGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  items: string[];
}

// Organize verified skills from data.ts into the 6 core engineering domains
const getOrganizedSkillGroups = (): SkillGroup[] => {
  const byId = Object.fromEntries(skillCategories.map((c) => [c.id, c.skills.map((s) => s.name)]));
  const dbAndWeb = byId['db'] || [];

  return [
    {
      id: 'lang',
      title: 'Programming Languages',
      subtitle: 'Core systems, scripting, and algorithmic problem solving',
      icon: Terminal,
      items: byId['lang'] || ['Python', 'SQL', 'C++', 'Java', 'JavaScript'],
    },
    {
      id: 'web',
      title: 'Web Development',
      subtitle: 'Responsive interfaces, single-page applications, and REST APIs',
      icon: Globe,
      items: [
        ...dbAndWeb.filter((s) => s.includes('HTML') || s.includes('React')),
        'REST APIs Engineering',
      ],
    },
    {
      id: 'cloud',
      title: 'Cloud Computing',
      subtitle: 'Containerization, cloud platforms, and distributed deployment',
      icon: Cloud,
      items: byId['cloud'] || [],
    },
    {
      id: 'mlds',
      title: 'AI & Machine Learning',
      subtitle: 'Predictive pipelines, feature engineering, and model evaluation',
      icon: Brain,
      items: byId['mlds'] || [],
    },
    {
      id: 'db',
      title: 'Databases',
      subtitle: 'Relational schemas, query optimization, and data modeling',
      icon: Database,
      items: dbAndWeb.filter((s) => s.includes('Database') || s.includes('Db2')),
    },
    {
      id: 'tools',
      title: 'Developer Tools',
      subtitle: 'Version control, agile workflows, and engineering environments',
      icon: Wrench,
      items: (byId['tools'] || []).filter((s) => !s.includes('REST APIs')),
    },
  ];
};

const skillGroups = getOrganizedSkillGroups();

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const visibleGroups =
    activeFilter === 'all'
      ? skillGroups
      : skillGroups.filter((group) => group.id === activeFilter);

  return (
    <section
      id="skills"
      className="py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-25 border-t border-[#050505]/12 dark:border-white/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#FFD000]" />
              <span className="text-xs font-mono tracking-[0.2em] text-[#525252] dark:text-[#FFD000] uppercase">
                02. Technical Stack
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight">
              Capabilities &amp;{' '}
              <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
                Core Technologies
              </span>
            </h2>
          </div>

          <p className="text-sm text-[#525252] dark:text-[#A1A1A1] max-w-md font-sans leading-relaxed">
            Verified tools and technologies applied across internships, national hackathons, and deployed engineering projects.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-5 border-b border-[#050505]/12 dark:border-white/12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#FFD000] text-[#050505] font-semibold'
                : 'bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
            }`}
          >
            All Domains
          </button>
          {skillGroups.map((group) => {
            const isSelected = activeFilter === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setActiveFilter(group.id)}
                className={`px-3.5 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFD000] text-[#050505] font-semibold'
                    : 'bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                {group.title}
              </button>
            );
          })}
        </div>

        {/* 6-Domain Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {visibleGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="p-6 sm:p-7 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-2.5 rounded-lg border border-[#050505]/12 dark:border-white/12 bg-[#FFFFFF] dark:bg-[#171717] text-[#050505] dark:text-[#FFD000]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-[#525252] dark:text-[#A1A1A1]">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#050505] dark:text-[#FFFFFF] group-hover:text-[#B89400] dark:group-hover:text-[#FFD000] transition-colors">
                    {group.title}
                  </h3>
                  <p className="text-xs text-[#525252] dark:text-[#A1A1A1] mt-1.5 leading-relaxed">
                    {group.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#050505]/10 dark:border-white/10 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded bg-[#FFFFFF] dark:bg-[#171717] border border-[#050505]/10 dark:border-white/10 text-xs font-mono text-[#050505] dark:text-[#FFFFFF]/90"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
