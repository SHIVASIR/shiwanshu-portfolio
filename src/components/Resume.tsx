/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Eye, FileText, Printer, Check, MapPin, Mail, Linkedin, ExternalLink } from 'lucide-react';
import { personalInfo, educationList, experienceList, projectList, certifications } from '../data';

export default function Resume() {
  const [viewMode, setViewMode] = useState<'interactive' | 'download'>('interactive');
  const [activeTab, setActiveTab] = useState<'interactive' | 'ats'>('interactive');
  const [downloaded, setDownloaded] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStub = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
    window.print();
  };

  return (
    <section
      id="resume"
      className="py-24 sm:py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-25 border-t border-black/10 dark:border-white/12 transition-colors duration-300"
    >
      {/* CSS Stylesheet specifically optimized for print layout on the A4 page */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-document, #print-document * {
            visibility: visible !important;
          }
          #print-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #print-document a {
            text-decoration: none !important;
            color: black !important;
          }
          #print-document h1, #print-document h2, #print-document h3 {
            color: black !important;
            font-family: serif !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="h-[1px] w-8 bg-[#FFD000]" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#050505] dark:text-[#FFD000] uppercase">
                10 / Curriculum Vitae
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight uppercase">
              ATS Resume &{' '}
              <span className="font-editorial italic font-normal text-[#FFD000] lowercase">
                dossier.
              </span>
            </h2>
            <p className="text-sm text-[#525252] dark:text-[#A1A1A1] mt-3 font-normal max-w-xl font-sans">
              Toggle between reading the interactive styled resume directly on screen or downloading the printer-ready PDF.
            </p>
          </div>

          {/* Main Mode Toggle Switch */}
          <div className="flex items-center justify-center p-1 bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 rounded-xl font-mono text-xs shrink-0 self-center md:self-end">
            <button
              id="resume-mode-interactive"
              onClick={() => setViewMode('interactive')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-[#FFD000] text-[#050505] font-bold shadow-sm'
                  : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Interactive</span>
            </button>
            <button
              id="resume-mode-download"
              onClick={() => {
                setViewMode('download');
                handleDownloadStub();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'download'
                  ? 'bg-[#FFD000] text-[#050505] font-bold shadow-sm'
                  : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Download PDF Panel */}
        {viewMode === 'download' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="mb-8 p-8 rounded-2xl border border-[#FFD000]/40 bg-[#FAFAFA] dark:bg-[#101010] text-center space-y-6"
          >
            <div className="inline-flex p-3 rounded-2xl bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40">
              <FileText className="h-8 w-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-display font-extrabold text-[#050505] dark:text-[#FFFFFF]">
                Download Official SDE Resume PDF
              </h3>
              <p className="text-xs text-[#525252] dark:text-[#A1A1A1] font-mono">
                Generated from verified ATS specifications. Contains full education, technical project links, SIH hackathon achievements, and contact details.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleDownloadStub}
                className="inline-flex items-center space-x-2 px-6 py-3 text-xs font-bold font-mono rounded-xl text-[#050505] bg-[#FFD000] hover:brightness-105 transition-all cursor-pointer"
              >
                {downloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                <span>{downloaded ? 'Opening Print / PDF Save Dialog...' : 'Trigger PDF Download Now'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 text-xs font-bold font-mono rounded-xl text-[#050505] dark:text-[#FFFFFF] bg-white dark:bg-[#171717] border border-black/10 dark:border-white/12 hover:border-[#FFD000] transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print A4 ATS Format</span>
              </button>

              <button
                onClick={() => setViewMode('interactive')}
                className="inline-flex items-center space-x-2 px-4 py-3 text-xs font-mono text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>Switch to Interactive View</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Toolbar for Interactive View Mode */}
        {viewMode === 'interactive' && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl border border-black/10 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010]">
            {/* Layout Selector */}
            <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-white dark:bg-[#171717] border border-black/10 dark:border-white/10">
              <button
                onClick={() => setActiveTab('interactive')}
                className={`px-3 py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'interactive'
                    ? 'bg-[#FFD000] text-[#050505]'
                    : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Interactive Styled View</span>
              </button>
              <button
                onClick={() => setActiveTab('ats')}
                className={`px-3 py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'ats'
                    ? 'bg-[#FFD000] text-[#050505]'
                    : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Standard ATS Sheet</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-mono font-semibold rounded-lg bg-white dark:bg-[#171717] text-[#050505] dark:text-[#FFFFFF] border border-black/10 dark:border-white/12 hover:border-[#FFD000] transition-all cursor-pointer"
                title="Print to Paper or Virtual PDF"
              >
                <Printer className="h-4 w-4" />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Display Canvas */}
        <div className="relative rounded-2xl border border-black/10 dark:border-white/12 bg-white dark:bg-[#101010] p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
          {/* Print container wrapper */}
          <div id="print-document" className="text-left select-text">
            {activeTab === 'interactive' ? (
              /* Designer Render */
              <div className="space-y-8 font-sans">
                {/* Header Block Info */}
                <div className="border-b border-black/10 dark:border-white/12 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-display font-extrabold text-[#050505] dark:text-[#FFFFFF] tracking-tight">
                      {personalInfo.name}
                    </h1>
                    <p className="text-[#050505] dark:text-[#FFD000] font-mono font-semibold text-xs uppercase tracking-wider">
                      {personalInfo.title}
                    </p>
                    <div className="text-xs text-[#525252] dark:text-[#A1A1A1] pt-1 leading-normal max-w-xl">
                      {personalInfo.summary}
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] text-[#525252] dark:text-[#A1A1A1] shrink-0">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3.5 w-3.5 text-[#FFD000] shrink-0" />
                      <span>{personalInfo.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3.5 w-3.5 text-[#FFD000] shrink-0" />
                      <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                        {personalInfo.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-3.5 w-3.5 text-[#FFD000] shrink-0" />
                      <a
                        href={personalInfo.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-[#050505] dark:text-[#FFD000]"
                      >
                        linkedin.com/in/shiwanshu-kumar-singh-931232334
                      </a>
                    </div>
                  </div>
                </div>

                {/* Experience Segment */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[#525252] dark:text-[#A1A1A1] uppercase">
                    EXPERIENCE
                  </h3>
                  <div className="space-y-6">
                    {experienceList.map((exp) => (
                      <div key={exp.id} className="space-y-2">
                        <div className="flex flex-wrap justify-between items-baseline gap-1">
                          <h4 className="text-sm font-bold text-[#050505] dark:text-[#FFFFFF]">
                            {exp.role}{' '}
                            <span className="text-[#050505] dark:text-[#FFD000] font-medium">
                              @ {exp.company}
                            </span>
                          </h4>
                          <span className="text-xs font-mono text-[#525252] dark:text-[#A1A1A1]">
                            {exp.duration}
                          </span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                          {exp.points.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects Detail */}
                <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/12">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[#525252] dark:text-[#A1A1A1] uppercase">
                    PROJECT SUMMARY
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectList.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 border border-black/10 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#171717] rounded-xl space-y-2 text-left"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-extrabold text-[#050505] dark:text-[#FFFFFF] leading-tight">
                            {proj.title}
                          </h4>
                          <span className="text-[9px] font-mono uppercase font-bold text-[#050505] dark:text-[#FFD000] shrink-0">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#525252] dark:text-[#A1A1A1] line-clamp-2">
                          {proj.description}
                        </p>
                        <div className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1] truncate pt-1">
                          STACK: {proj.techStack.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education, Tech Stack, Certifications grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-black/10 dark:border-white/12">
                  {/* Edu */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-[#525252] dark:text-[#A1A1A1] uppercase">
                      ACADEMIC BACKGROUND
                    </h3>
                    <div className="space-y-4">
                      {educationList.map((edu) => (
                        <div key={edu.id} className="space-y-1">
                          <h4 className="text-xs font-extrabold text-[#050505] dark:text-[#FFFFFF]">
                            {edu.institution}
                          </h4>
                          <div className="text-[11px] text-[#525252] dark:text-[#A1A1A1]">
                            {edu.degree}
                          </div>
                          <div className="text-[10px] text-[#525252] dark:text-[#A1A1A1] font-mono flex justify-between">
                            <span>{edu.duration}</span>
                            <span>{edu.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications and credentials list */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-[#525252] dark:text-[#A1A1A1] uppercase">
                      SELECTED RECOGNITIONS
                    </h3>
                    <ul className="space-y-3.5">
                      {certifications.map((cert) => (
                        <li key={cert.id} className="flex items-start justify-between gap-1.5 text-xs">
                          <div>
                            <h4 className="font-bold text-[#050505] dark:text-[#FFFFFF] leading-tight">
                              {cert.title}
                            </h4>
                            <div className="text-[10px] text-[#525252] dark:text-[#A1A1A1] mt-0.5">
                              {cert.issuer}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-[#050505] dark:text-[#FFD000] shrink-0">
                            {cert.date}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* ATS LaTeX-style Sheet */
              <div className="font-serif text-black bg-white p-8 max-w-[210mm] mx-auto text-sm leading-relaxed border border-gray-300 shadow-md">
                {/* PDF center header */}
                <div className="text-center space-y-1 pb-4 border-b border-gray-400">
                  <h1 className="text-2xl font-bold font-serif text-black uppercase tracking-wide">{personalInfo.name}</h1>
                  <p className="text-xs font-serif text-black italic">
                    {personalInfo.location} | {personalInfo.email} | {personalInfo.phone}
                  </p>
                  <p className="text-xs font-serif text-black">
                    <a href={personalInfo.linkedin} className="underline" target="_blank" rel="noreferrer">linkedin.com/in/shiwanshu-kumar-singh-931232334</a> | github.com/shiwanshusingh-code
                  </p>
                </div>

                {/* ATS Summary */}
                <div className="space-y-1 pt-4">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5">Summary</h2>
                  <p className="text-xs font-serif">{personalInfo.summary}</p>
                </div>

                {/* ATS Education */}
                <div className="space-y-2 pt-4">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5">Education</h2>
                  {educationList.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start text-xs font-serif">
                      <div className="space-y-0.5">
                        <div className="font-bold">{edu.institution}</div>
                        <div>{edu.degree}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{edu.location}</div>
                        <div className="italic">{edu.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ATS Experience */}
                <div className="space-y-3 pt-4">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5">Experience</h2>
                  {experienceList.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline text-xs font-serif">
                        <div className="font-bold">{exp.role} — {exp.company}</div>
                        <div className="text-right italic">{exp.duration} | {exp.location}</div>
                      </div>
                      <ul className="list-disc pl-5 text-xs font-serif space-y-0.5">
                        {exp.points.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* ATS Projects info */}
                <div className="space-y-2 pt-4">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5">Projects</h2>
                  {projectList.slice(0, 3).map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <div className="flex justify-between text-xs font-serif font-bold">
                        <div>{proj.title}</div>
                        <div className="font-normal italic">({proj.techStack.join(', ')})</div>
                      </div>
                      <p className="text-xs font-serif pl-4 text-neutral-800">{proj.description}</p>
                    </div>
                  ))}
                </div>

                {/* ATS Certifications */}
                <div className="space-y-2 pt-4">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider font-serif text-black border-b border-gray-400 pb-0.5">Technical SKILLS & CERTIFICATIONS</h2>
                  <div className="text-xs font-serif space-y-1.5">
                    <div>
                      <span className="font-bold">Technical Focus areas:</span> Machine Learning, Cloud Services, Python, SQL, C++, SQL Query Optimization.
                    </div>
                    <div>
                      <span className="font-bold">Credential list:</span> {certifications.map(c => `${c.title} (${c.issuer})`).join('; ')}.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
