/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'WORKS', path: '#/' },
    { label: 'VIDEO EDITING', path: '#/video-editing' },
    { label: 'MOTION & 3D', path: '#/motion-3d' },
    { label: 'PHOTOGRAPHIC', path: '#/photography' },
    { label: 'ABOUT', path: '#/about' },
    { label: 'CONTACT', path: '#/contact' },
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const isCurrentActive = (itemPath: string) => {
    if (itemPath === '#/') {
      return currentPath === '#/' || currentPath === '';
    }
    return currentPath === itemPath;
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled || isMobileMenuOpen
          ? 'bg-[#050505]/95 backdrop-blur-2xl border-b border-white/[0.04] py-3.5' 
          : 'bg-transparent py-5'
      }`}
      id="header-navigation"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        {/* Brand/Logo */}
        <button 
          onClick={() => handleItemClick('#/')}
          className="flex items-center gap-2 group text-left cursor-pointer"
          data-cursor="HOME"
          id="btn-brand-home"
        >
          <span className="font-display font-bold tracking-tight text-sm text-white group-hover:text-onyx-300 transition-colors uppercase">
            YAKIN MAULANA
          </span>
          <span className="text-white hover:text-white inline-block animate-spin-slow font-display text-base">
            ✲
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleItemClick(item.path)}
              className={`px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                isCurrentActive(item.path)
                  ? 'bg-white text-black font-semibold shadow-md translate-y-[-1px]'
                  : 'text-onyx-300 hover:text-white hover:bg-white/[0.05]'
              }`}
              data-cursor={item.label}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="mailto:pertantpacome@gmail.com"
            className="ml-2 px-4 py-2 border border-white/10 hover:border-white/30 text-white hover:text-black hover:bg-white rounded-full font-mono text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-1 cursor-pointer"
            id="nav-direct-mail"
          >
            <span>HIRE</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white p-1 hover:text-onyx-300 transition-colors cursor-pointer"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          id="btn-mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 h-screen w-screen bg-[#050505] z-30 lg:hidden flex flex-col justify-between p-8 pt-24 pb-12 overflow-y-auto animate-fade-in">
          <nav className="flex flex-col gap-5 mt-4">
            {navItems.map((item, idx) => (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                className={`py-2.5 text-left font-display text-xl tracking-tight transition-all duration-300 border-b border-white/[0.03] ${
                  isCurrentActive(item.path)
                    ? 'text-white font-bold translate-x-2'
                    : 'text-onyx-400 hover:text-white hover:translate-x-1'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
                id={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex justify-between items-center">
                  <span>{item.label}</span>
                  <span className="font-mono text-[10px] text-white/30">0{idx + 1}</span>
                </div>
              </button>
            ))}
          </nav>

          <div className="border-t border-white/[0.06] pt-6 flex flex-col gap-2.5">
            <p className="text-[10px] font-mono text-onyx-500 uppercase tracking-widest">Available for contract commissions</p>
            <a 
              href="mailto:yakinm100@gmail.com"
              className="text-sm font-mono text-white hover:text-onyx-300 flex items-center gap-1 underline underline-offset-4"
              id="mobile-nav-email-link"
            >
              <span>yakinm100@gmail.com</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
