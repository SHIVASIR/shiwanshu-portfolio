/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, Search, ArrowUpRight } from 'lucide-react';
import { useTheme } from './ThemeContext';
import UserAuthMenu from './UserAuthMenu';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const y = window.scrollY;
      const isPast = y > 20;
      setScrolled((prev) => (prev !== isPast ? isPast : prev));

      const scrollPosition = y + 140;
      for (const item of navItems) {
        const sectionId = item.href.slice(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection((prev) => (prev !== sectionId ? sectionId : prev));
            break;
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#FFFFFF]/95 dark:bg-[#050505]/95 backdrop-blur-md border-b border-[#050505]/10 dark:border-white/12'
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            
            {/* Brand Wordmark */}
            <a
              href="#home"
              onClick={(e) => handleClick(e, '#home')}
              className="flex items-baseline gap-1.5 group shrink-0 whitespace-nowrap"
            >
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#050505] dark:text-[#FFFFFF] group-hover:text-[#B89400] dark:group-hover:text-[#FFD000] transition-colors">
                SHIWANSHU
              </span>
              <span className="font-editorial italic text-xl text-[#FFD000]">.</span>
            </a>

            {/* Primary Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Primary Navigation">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className={`relative px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-[#050505] dark:text-[#FFD000] font-semibold'
                        : 'text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FFD000]"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] bg-[#F5F5F5] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 hover:border-[#FFD000] rounded-md transition-colors cursor-pointer"
                title="Command Palette (⌘K)"
                aria-label="Open Command Palette"
              >
                <Search className="h-3.5 w-3.5 text-[#050505] dark:text-[#FFD000]" />
                <kbd className="text-[10px] font-mono">⌘K</kbd>
              </button>

              <div className="shrink-0">
                <UserAuthMenu />
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFD000] bg-[#F5F5F5] dark:bg-[#101010] border border-[#050505]/12 dark:border-white/12 hover:border-[#FFD000] rounded-md transition-colors cursor-pointer"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <a
                href="#contact"
                onClick={(e) => handleClick(e, '#contact')}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-mono font-semibold uppercase tracking-wider text-[#050505] bg-[#FFD000] hover:bg-[#ffe047] transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Hire Me</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-[#050505] dark:text-[#FFFFFF] rounded-md border border-[#050505]/15 dark:border-white/15 bg-[#F5F5F5] dark:bg-[#101010] cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[62px] z-40 lg:hidden border-b border-[#050505]/12 dark:border-white/12 bg-[#FFFFFF]/98 dark:bg-[#050505]/98 backdrop-blur-xl px-5 pt-4 pb-6 shadow-2xl"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className={`px-4 py-3 rounded-md text-sm font-mono uppercase tracking-wider transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#FFD000] text-[#050505] font-semibold'
                        : 'text-[#525252] dark:text-[#A1A1A1] hover:bg-[#F5F5F5] dark:hover:bg-[#101010] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                );
              })}
              <div className="pt-3 mt-2 border-t border-[#050505]/10 dark:border-white/10 flex gap-2">
                <a
                  href="#resume"
                  onClick={(e) => handleClick(e, '#resume')}
                  className="flex-1 text-center py-3 rounded-md text-xs font-mono font-semibold uppercase tracking-wider border border-[#050505]/15 dark:border-white/15 text-[#050505] dark:text-[#FFFFFF]"
                >
                  Resume
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleClick(e, '#contact')}
                  className="flex-1 text-center py-3 rounded-md text-xs font-mono font-semibold uppercase tracking-wider bg-[#FFD000] text-[#050505]"
                >
                  Contact
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
