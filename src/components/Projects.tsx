/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  ExternalLink,
  ShieldAlert,
  Cloud,
  Database,
  BarChart3,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Target,
  ArrowRight,
  Star,
} from 'lucide-react';
import { projectList } from '../data';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';

const categoryLabels = [
  { id: 'all', name: 'All Architectures' },
  { id: 'ml', name: 'Machine Learning' },
  { id: 'cloud', name: 'Cloud & Distributed' },
  { id: 'fullstack', name: 'Systems & DB' },
  { id: 'data-science', name: 'Data & Analytics' },
];

export default function Projects() {
  const { profile, toggleStarProject } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const starredProjects = profile?.starredProjects || [];

  const allTabs = [
    ...categoryLabels,
    ...(starredProjects.length > 0 ? [{ id: 'starred', name: `Saved (${starredProjects.length})` }] : []),
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const filteredProjects =
    activeTab === 'all'
      ? projectList
      : activeTab === 'starred'
      ? projectList.filter((proj) => starredProjects.includes(proj.id))
      : projectList.filter((proj) => proj.category === activeTab);

  const renderProjectPreview = (id: string) => {
    switch (id) {
      case 'proj-1':
        return (
          <div className="relative w-full h-56 sm:h-64 bg-[#0A0A0A] overflow-hidden border-b border-[#050505]/12 dark:border-white/12 flex flex-col justify-between p-6 group">
            <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FFD000] font-semibold">
                Imbalanced Dataset Classifier
              </span>
              <ShieldAlert className="h-5 w-5 text-[#FFD000]" />
            </div>

            <div className="z-10 p-4 rounded-lg bg-[#101010] border border-white/12 font-mono space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-[#A1A1A1]">
                <span>Model: LightGBM + SMOTE</span>
                <span className="text-[#FFD000] font-semibold">AUC-ROC: 0.96+</span>
              </div>
              <div className="flex items-center gap-1.5 h-6">
                <div className="h-full w-1/4 rounded bg-white/10 flex items-center justify-center text-[10px] text-white/70">
                  Legit: 99.8%
                </div>
                <div className="h-full w-3/4 rounded bg-[#FFD000] flex items-center justify-between px-2.5 text-[10px] text-[#050505] font-bold">
                  <span>Fraud Recall: 91%</span>
                  <span>&lt;14ms</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'proj-2':
        return (
          <div className="relative w-full h-52 bg-[#0A0A0A] overflow-hidden border-b border-[#050505]/12 dark:border-white/12 flex flex-col justify-between p-5 group">
            <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FFD000] font-semibold">
                Docker Microservice
              </span>
              <Cloud className="h-5 w-5 text-[#FFD000]" />
            </div>

            <div className="z-10 p-3.5 rounded-lg bg-[#101010] border border-white/12 font-mono text-[11px] text-[#A1A1A1] space-y-1">
              <div className="flex justify-between text-[#FFFFFF]">
                <span className="text-[#FFD000]">POST /api/v1/predict</span>
                <span>200 OK · 18ms</span>
              </div>
              <div className="text-[10px] text-[#A1A1A1]">
                180MB Alpine Container · AWS &amp; Azure Parity
              </div>
            </div>
          </div>
        );
      case 'proj-3':
        return (
          <div className="relative w-full h-52 bg-[#0A0A0A] overflow-hidden border-b border-[#050505]/12 dark:border-white/12 flex flex-col justify-between p-5 group">
            <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FFD000] font-semibold">
                B+ Tree Query Engine
              </span>
              <Database className="h-5 w-5 text-[#FFD000]" />
            </div>

            <div className="z-10 p-3.5 rounded-lg bg-[#101010] border border-white/12 font-mono text-[11px] text-[#A1A1A1] space-y-1">
              <div className="flex justify-between text-[#FFFFFF]">
                <span>SELECT * FROM records</span>
                <span className="text-[#FFD000]">Cost -60%</span>
              </div>
              <div className="text-[10px] text-[#A1A1A1]">
                C++ AST Parser · Predicate Pushdown · O(log N)
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-52 bg-[#0A0A0A] overflow-hidden border-b border-[#050505]/12 dark:border-white/12 flex flex-col justify-between p-5 group">
            <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FFD000] font-semibold">
                Timeseries Forecast SPA
              </span>
              <BarChart3 className="h-5 w-5 text-[#FFD000]" />
            </div>

            <div className="z-10 p-3.5 rounded-lg bg-[#101010] border border-white/12 font-mono text-[11px] text-[#A1A1A1] space-y-1">
              <div className="flex justify-between text-[#FFFFFF]">
                <span>Demand Forecast Index</span>
                <span className="text-[#FFD000]">60 FPS UI</span>
              </div>
              <div className="text-[10px] text-[#A1A1A1]">
                React 18 · Tailwind CSS · Pandas Analytics
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="projects"
      className="py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-25 border-t border-[#050505]/12 dark:border-white/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-[#FFD000]" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#525252] dark:text-[#FFD000] uppercase">
              03. Selected Works
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight max-w-3xl">
            Engineering Showcases &amp;{' '}
            <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
              Deployed Systems
            </span>
          </h2>
          <p className="text-base text-[#525252] dark:text-[#A1A1A1] mt-3 max-w-2xl font-sans">
            Production-grade systems exploring high-precision fraud detection, containerized inference engines, relational query optimizers, and interactive analytical web applications.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-5 border-b border-[#050505]/12 dark:border-white/12">
          {allTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFD000] text-[#050505] font-semibold'
                    : 'bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => {
              const isFirst = idx === 0 && activeTab === 'all';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  key={proj.id}
                  className={`flex flex-col rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] overflow-hidden hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-colors group ${
                    isFirst ? 'lg:col-span-12' : 'lg:col-span-6'
                  }`}
                >
                  {renderProjectPreview(proj.id)}

                  <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-display font-bold text-xl sm:text-2xl text-[#050505] dark:text-[#FFFFFF] group-hover:text-[#B89400] dark:group-hover:text-[#FFD000] transition-colors">
                          {proj.title}
                        </h3>

                        {isFirst && (
                          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded bg-[#FFD000] text-[#050505] text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                        {proj.description}
                      </p>

                      <ul className="space-y-2 pt-1">
                        {proj.points.slice(0, isFirst ? 3 : 2).map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#050505]/85 dark:text-[#FFFFFF]/85 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD000] mt-2 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                        {proj.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="inline-flex items-center gap-2">
                            <span>{tech}</span>
                            {tIdx < proj.techStack.length - 1 && (
                              <span aria-hidden="true" className="text-[#FFD000]">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#050505]/10 dark:border-white/10 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#171717] border border-[#050505]/12 dark:border-white/12 text-xs font-mono text-[#050505] dark:text-[#FFFFFF] hover:border-[#FFD000] transition-colors"
                            title="GitHub Repository"
                          >
                            <Github className="h-3.5 w-3.5 text-[#050505] dark:text-[#FFD000]" />
                            <span>Code</span>
                          </a>
                        )}

                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#171717] border border-[#050505]/12 dark:border-white/12 text-xs font-mono text-[#050505] dark:text-[#FFFFFF] hover:border-[#FFD000] transition-colors"
                            title="Live Deployment"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-[#050505] dark:text-[#FFD000]" />
                            <span>Demo</span>
                          </a>
                        )}

                        <button
                          onClick={() => toggleStarProject(proj.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer ${
                            starredProjects.includes(proj.id)
                              ? 'bg-[#FFD000] border-[#FFD000] text-[#050505] font-semibold'
                              : 'bg-[#FFFFFF] dark:bg-[#171717] border-[#050505]/12 dark:border-white/12 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                          }`}
                          title={starredProjects.includes(proj.id) ? 'Saved to profile' : 'Bookmark project'}
                        >
                          <Star className={`h-3 w-3 ${starredProjects.includes(proj.id) ? 'fill-[#050505]' : ''}`} />
                          <span>{starredProjects.includes(proj.id) ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FFD000] text-[#050505] hover:bg-[#ffe047] font-mono text-xs font-semibold tracking-wide transition-all group/btn cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Case Study</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* FULL CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-[#050505]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#FFFFFF] dark:bg-[#101010] border border-[#050505]/15 dark:border-white/15 rounded-2xl shadow-2xl overflow-y-auto z-10 flex flex-col p-6 sm:p-8 text-left scrollbar-hide"
            >
              <div className="flex items-start justify-between pb-6 border-b border-[#050505]/12 dark:border-white/12">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#B89400] dark:text-[#FFD000]">
                    Architectural Dossier · {selectedProject.id.toUpperCase()}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#050505] dark:text-[#FFFFFF]">
                    {selectedProject.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-md bg-[#FAFAFA] dark:bg-[#171717] border border-[#050505]/12 dark:border-white/12 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  aria-label="Close Case Study"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-6 space-y-7 text-[#525252] dark:text-[#A1A1A1] text-sm leading-relaxed">
                {selectedProject.caseStudy?.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedProject.caseStudy.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-3.5 bg-[#FAFAFA] dark:bg-[#171717] rounded-lg border border-[#050505]/10 dark:border-white/10 font-mono">
                        <div className="text-[10px] uppercase tracking-wider text-[#525252] dark:text-[#A1A1A1]">{m.label}</div>
                        <div className="text-lg font-bold text-[#050505] dark:text-[#FFD000] mt-0.5 tabular-nums">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#050505] dark:text-[#FFD000] uppercase tracking-wider">
                    <Target className="h-4 w-4" />
                    <span>01. Problem Statement</span>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FAFAFA] dark:bg-[#171717] border border-[#050505]/10 dark:border-white/10 text-[#050505] dark:text-[#FFFFFF] leading-relaxed">
                    {selectedProject.caseStudy?.problemStatement || selectedProject.description}
                  </div>
                </div>

                {selectedProject.caseStudy?.techStackDetailed && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#050505] dark:text-[#FFD000] uppercase tracking-wider">
                      <Cpu className="h-4 w-4" />
                      <span>02. Architectural Stack</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.caseStudy.techStackDetailed.map((item, cIdx) => (
                        <div key={cIdx} className="p-4 rounded-lg bg-[#FAFAFA] dark:bg-[#171717] border border-[#050505]/10 dark:border-white/10 space-y-1">
                          <span className="text-xs font-mono font-bold text-[#050505] dark:text-[#FFD000]">
                            {item.name}
                          </span>
                          <p className="text-xs text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                            {item.role}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.caseStudy?.challengesFaced && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#050505] dark:text-[#FFD000] uppercase tracking-wider">
                      <AlertTriangle className="h-4 w-4" />
                      <span>03. Engineering Challenges</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedProject.caseStudy.challengesFaced.map((ch, chIdx) => (
                        <li key={chIdx} className="flex items-start gap-3 p-3 bg-[#FAFAFA] dark:bg-[#171717] rounded-lg border border-[#050505]/10 dark:border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD000] mt-2 shrink-0" />
                          <span className="text-xs sm:text-sm text-[#050505] dark:text-[#FFFFFF]/90 leading-relaxed">{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.caseStudy?.resultsAndImpact && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#050505] dark:text-[#FFD000] uppercase tracking-wider">
                      <TrendingUp className="h-4 w-4" />
                      <span>04. Verifiable Impact</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedProject.caseStudy.resultsAndImpact.map((res, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-3 p-3 bg-[#FAFAFA] dark:bg-[#171717] rounded-lg border border-[#050505]/10 dark:border-white/10">
                          <CheckCircle2 className="h-4 w-4 text-[#050505] dark:text-[#FFD000] mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm text-[#050505] dark:text-[#FFFFFF] leading-relaxed">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#050505]/12 dark:border-white/12 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#FFD000] text-[#050505] font-mono font-semibold text-xs hover:bg-[#ffe047] transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>View GitHub Code</span>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#FAFAFA] dark:bg-[#171717] border border-[#050505]/15 dark:border-white/15 text-[#050505] dark:text-[#FFFFFF] font-mono font-semibold text-xs hover:border-[#FFD000] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 rounded-md bg-[#FAFAFA] dark:bg-[#171717] border border-[#050505]/12 dark:border-white/12 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] text-xs font-mono transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
