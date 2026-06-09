/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import MouseFollower from './components/MouseFollower';
import ProjectGrid from './components/ProjectGrid';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import { projectsData } from './data/projects';
import { ArrowUp, Award, Clock } from 'lucide-react';

export default function App() {
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#/');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // 1. Synced Real-time UTC Clock (Improves high-end professional designer aesthetic)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Hash Routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentHash(hash);
      // Automatically scroll to top on page navigation
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3. Scroll to top visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  const handleBackToWorks = () => {
    const currentCategory = ['video-editing', 'motion-3d', 'photography'].find(cat => currentHash.includes(cat));
    if (currentCategory) {
      window.location.hash = `#/${currentCategory}`;
    } else {
      window.location.hash = '#/';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Resolve Route templates & filtering
  const renderRoute = () => {
    // A. Project details route match: #/project/:id
    if (currentHash.startsWith('#/project/')) {
      const projectId = currentHash.replace('#/project/', '');
      const project = projectsData.find((p) => p.id === projectId);
      
      if (project) {
        return (
          <ProjectDetail
            project={project}
            allProjects={projectsData}
            onNavigate={handleNavigate}
            onBack={handleBackToWorks}
          />
        );
      } else {
        // Project fallback
        return (
          <div className="py-24 text-center">
            <h2 className="font-display text-xl text-white mb-4 uppercase">Project Not Found</h2>
            <button 
              onClick={() => handleNavigate('#/')}
              className="px-6 py-2.5 bg-white text-black text-xs font-mono tracking-widest rounded-full uppercase"
            >
              Get Back to works
            </button>
          </div>
        );
      }
    }

    // B. Static pages
    switch (currentHash) {
      case '#/about':
        return <AboutPage />;
      case '#/contact':
        return <ContactPage />;
      
      // C. Filterable pages
      case '#/video-editing':
        return (
          <ProjectGrid
            projects={projectsData.filter((p) => p.category === 'video-editing')}
            onSelectProject={(slug) => handleNavigate(`#/project/${slug}`)}
            activeCategory="video-editing"
          />
        );
      case '#/motion-3d':
        return (
          <ProjectGrid
            projects={projectsData.filter((p) => p.category === 'motion-3d')}
            onSelectProject={(slug) => handleNavigate(`#/project/${slug}`)}
            activeCategory="motion-3d"
          />
        );
      case '#/photography':
        return (
          <ProjectGrid
            projects={projectsData.filter((p) => p.category === 'photography')}
            onSelectProject={(slug) => handleNavigate(`#/project/${slug}`)}
            activeCategory="photography"
          />
        );
      
      // Home / Selected Works fallback
      case '#/':
      default:
        return (
          <ProjectGrid
            projects={projectsData.filter((p) => p.featured === true)}
            onSelectProject={(slug) => handleNavigate(`#/project/${slug}`)}
            activeCategory="all"
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-onyx-950 text-white selection:bg-white selection:text-black">
      {/* 1. Custom Pointer Tracking Layer */}
      <MouseFollower />

      {/* 2. Premium Navbar HUD */}
      <Navbar currentPath={currentHash} onNavigate={handleNavigate} />

      {/* 3. Main Stage Content Container */}
      <main className="flex-grow pt-28 sm:pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto w-full">
        
        {/* Splash Jumbotron headers - ONLY shown on primary Home or categories */}
        {!currentHash.startsWith('#/project/') && currentHash !== '#/about' && currentHash !== '#/contact' && (
          <section className="mb-12 sm:mb-16 md:mb-20 max-w-4xl" id="stage-hero-heading animate-fade-in">
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9] text-white">
              CRAFTING SOUND & <br />
              <span className="text-stroke-white transition-all font-light italic">MOTION DESIGNS</span>
            </h1>
            <p className="mt-6 text-sm text-onyx-400 font-mono tracking-widest uppercase flex items-center gap-1.5 flex-wrap">
              <span>AVAILABLE NOW FOR COMMISSIONS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-white/20">|</span>
              <span>DIRECTOR • MOTION ARTIST • VIDEO EDITOR</span>
            </p>
          </section>
        )}

        {/* Dynamic page render with high-fidelity React Motion fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHash}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Editorial footer panel containing UTC clock and copyright */}
      <footer className="border-t border-white/[0.04] bg-onyx-950 py-10 px-6 sm:px-10" id="editorial-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <p className="font-display text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span>YAKIN MAULANA</span>
              <span className="text-white/40">✲</span>
              <span className="font-mono text-[9px] font-normal text-onyx-400">DESIGN PORTFOLIO 2026</span>
            </p>
            <p className="text-[10px] font-mono text-onyx-500 uppercase tracking-widest">
              Inspired by the minimalism of pacomepertant.com
            </p>
          </div>

          {/* Time and Active State widgets */}
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-[10px] font-mono text-onyx-400 tracking-wider">
              <Clock className="w-3.5 h-3.5 text-onyx-500" />
              <span>{currentTime || 'Syncing UTC time...'}</span>
            </div>
            
            <a 
              href="mailto:yakinm100@gmail.com"
              className="text-[10px] font-mono text-white hover:text-onyx-300 uppercase tracking-widest border border-white/10 hover:border-white/30 px-3.5 py-1.5 rounded-full transition-all"
              id="footer-mail-trigger"
            >
              HIRE@YAKINMAULANA.COM
            </a>
          </div>
        </div>
      </footer>

      {/* 5. Fluid back to top quick button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-white hover:bg-onyx-200 text-black rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 z-30 cursor-pointer border border-white/10"
          title="Scroll back to top"
          id="btn-scroll-to-top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
