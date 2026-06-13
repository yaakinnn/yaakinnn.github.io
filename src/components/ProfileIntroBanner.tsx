/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUpRight, Sparkles } from 'lucide-react';

interface ProfileIntroBannerProps {
  className?: string;
}

export default function ProfileIntroBanner({ className = '' }: ProfileIntroBannerProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${className}`}>
      {/* Left Column: Title and Bio */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] border border-white/[0.08] w-fit rounded-full text-[9px] font-mono tracking-widest text-onyx-300 uppercase">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
          <span>Creative Multimedia Artist</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-none uppercase">
          CRAFTING IMMERSIVE <span className="font-bold">VISUAL ENGINES</span>
        </h1>

        <p className="text-sm sm:text-base text-onyx-300 leading-relaxed font-sans font-light">
          Hi my name is Yakin, I'm fluent in the Adobe Creative Suite, mainly working around videography and video editing. Right now, I'm building my motion design portfolio while slowly getting into motion graphics and 3D.
        </p>

        <p className="text-sm text-onyx-400 leading-relaxed font-sans font-light">
          I like turning ideas into visuals that actually feel alive and meaningful, not just something that looks good. Most of my focus right now is growing my skills and exploring how video, motion, and 3D can work together in a more interesting way.
        </p>

        <div className="pt-4 flex flex-wrap gap-4">
          <a
            href="#/contact"
            className="px-6 py-3 bg-white hover:bg-onyx-200 text-black font-semibold rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
            data-cursor="LET'S CHAT"
            id="about-hire-cta"
          >
            <span>Initialize Commission</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="mailto:yakinworkspace@gmail.com"
            className="px-6 py-3 border border-white/10 hover:border-white/30 text-white rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 hover:bg-white/[0.03] active:scale-95 cursor-pointer"
            data-cursor="EMAIL ME"
            id="about-email-cta"
          >
            <span>Get Resume</span>
          </a>
        </div>
      </div>

      {/* Right Column: Abstract Portrait Image Overlay */}
      <div className="lg:col-span-5 relative group">
        <div className="absolute inset-x-0 -bottom-8 -right-4 w-full h-full bg-onyx-900 border border-white/[0.04] rounded-2xl -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500" />
        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-onyx-900 border border-white/[0.08] shadow-2xl">
          <img
            src="assets/img/yaakinnn.webp"
            alt="Mochammad Ainul Yakin yaakinnn Creative portrait"
            className="w-full h-full object-cover grayscale brightness-90 group-hover:brightness-100 group-hover:scale-102 transition-all duration-700"
            id="author-profile-photo"
          />
          {/* Ambient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-6 left-6 right-6">
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1">Located in</p>
            <p className="font-display text-lg text-white font-medium flex items-center gap-1">
              <span>Surabaya, Indonesia</span>
              <span className="text-xs text-onyx-400">GMT+7</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
