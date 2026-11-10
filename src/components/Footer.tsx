/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUp, Linkedin, Github, Code2 } from 'lucide-react';
import { personalInfo } from '../data';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-[#050505]/12 dark:border-white/12 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="text-left">
              <div className="font-display text-base font-bold tracking-tight text-[#050505] dark:text-[#FFFFFF]">
                Shiwanshu Kumar Singh<span className="font-editorial italic text-[#FFD000]">.</span>
              </div>
              <div className="text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider">
                Cloud Computing &amp; Machine Learning
              </div>
            </div>
          </div>

          <VisitorCounter variant="footer" />

          {/* Social links, copyright & Back to top */}
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 rounded-md text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] hover:border-[#FFD000] transition-colors"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 rounded-md text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] hover:border-[#FFD000] transition-colors"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://leetcode.com/u/shiwanshu0711/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#FAFAFA] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 rounded-md text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] hover:border-[#FFD000] transition-colors"
              title="LeetCode Profile"
              aria-label="LeetCode Profile"
            >
              <Code2 className="h-4 w-4" />
            </a>
            <span className="text-xs text-[#525252] dark:text-[#A1A1A1] font-mono tracking-wider px-1">
              &copy; {currentYear}
            </span>
            <button
              onClick={handleScrollTop}
              className="p-2 bg-[#FFD000] text-[#050505] rounded-md hover:bg-[#ffe047] transition-colors cursor-pointer"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
