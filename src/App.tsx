/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Preloader from './components/Preloader';
import ScrollProgressBar from './components/ScrollProgressBar';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import LeadershipExperience from './components/LeadershipExperience';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import CodingProfiles from './components/CodingProfiles';
import Achievements from './components/Achievements';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Certifications from './components/Certifications';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CommandPalette from './components/CommandPalette';
import { initAnalytics, trackPageView } from './lib/analytics';

export default function App() {
  useEffect(() => {
    // Initialize analytics asynchronously on mount
    initAnalytics();

    const handleHashChange = () => {
      trackPageView(window.location.pathname + window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] transition-colors duration-300 selection:bg-[#FFD000] selection:text-[#050505] font-sans">
          <CustomCursor />
          <Preloader durationMs={1200} />
          <ScrollProgressBar />
          <Navigation />
          <main className="relative flex flex-col">
            <Hero />
            <About />
            <LeadershipExperience />
            <Skills />
            <Projects />
            <CodingProfiles />
            <Achievements />
            <Experience />
            <Testimonials />
            <Blog />
            <Certifications />
            <Resume />
            <Contact />
          </main>
          <Footer />
          <Chatbot />
          <CommandPalette />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
