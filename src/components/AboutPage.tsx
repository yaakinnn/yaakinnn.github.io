/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUpRight, Award, Flame, Film, Palette, Cpu, Sparkles } from 'lucide-react';
import { clientReviews } from '../data/projects';

export default function AboutPage() {
  const skills = [
    { name: 'Video Editing', icon: Film, tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Avid Media Composer'] },
    { name: 'Motion Design', icon: Flame, tools: ['Adobe After Effects', 'Cinema 4D', 'Blender'] },
    { name: '3D Modeling & Rendering', icon: Palette, tools: ['Blender 4.0', 'Octane Render', 'Redshift'] },
    { name: 'Digital Art', icon: Cpu, tools: ['Photoshop', 'Illustrator', 'Figma'] }
  ];

  const experience = [
    {
      year: '2025 - Present',
      role: 'Senior Motion & Video Director',
      company: 'Metropolis Digital Studios',
      description: 'Directing cinematic content and commercial video campaigns for global lifestyle brands. Leading a team of three editors and sound designers.'
    },
    {
      year: '2023 - 2025',
      role: 'Creative Motion Designer',
      company: 'Dimension Studio Paris',
      description: 'Designed and composite 3D fluid simulations and structural architectural installations for commercial spaces.'
    },
    {
      year: '2021 - 2023',
      role: 'Junior Video Editor',
      company: 'French National Broadcast Corp.',
      description: 'Assisted in offline video editing, audio synchronization, speed-ramping, and localized trailer color corrections.'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 animate-fade-in" id="about-workspace">
      {/* Intro visual banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-20">
        
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
            I am a video editor, motion director, and 3D designer focused on the synthesis of motion, space, and sound. Based on physical phenomena and modern metropolitan pacing, my creative workflow explores the overlap of high-contrast cyber aesthetics with realistic raw photography.
          </p>

          <p className="text-sm text-onyx-400 leading-relaxed font-sans font-light">
            By combining standard timelines with dynamic virtual simulations (Fluidics, cloth dynamics, brutalist architecture), I aim with every frame to guide viewer curiosity without cluttering screens.
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
              href="mailto:yakinm100@gmail.com"
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
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
              alt="Yakin Maulana Creative portrait"
              className="w-full h-full object-cover grayscale brightness-90 group-hover:brightness-100 group-hover:scale-102 transition-all duration-700"
              id="author-profile-photo"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1">Located in</p>
              <p className="font-display text-lg text-white font-medium flex items-center gap-1">
                <span>Jakarta, Indonesia</span>
                <span className="text-xs text-onyx-400">GMT+7</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expertise Tech Grid */}
      <div className="border-t border-white/[0.06] pt-16 mb-20">
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight uppercase mb-10 text-white">
          TECHNICAL STACK & CAPABILITIES
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, idx) => {
            const Icon = skill.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-onyx-900 border border-white/[0.04] flex flex-col justify-between hover:border-white/[0.08] transition-colors"
                id={`tech-card-${idx}`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white mb-4">
                    <Icon className="w-5 h-5 text-onyx-200" />
                  </div>
                  <h3 className="font-display text-lg font-medium text-white mb-2">{skill.name}</h3>
                </div>
                <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-white/[0.04]">
                  {skill.tools.map((tool, tIdx) => (
                    <span key={tIdx} className="font-mono text-[10px] text-onyx-400 uppercase tracking-wide">
                      • {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience Chronology */}
      <div className="border-t border-white/[0.06] pt-16 mb-20">
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight uppercase mb-10 text-white">
          TIMELINE & CHRONOLOGY
        </h2>

        <div className="flex flex-col">
          {experience.map((job, idx) => (
            <div 
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 py-8 border-b border-white/[0.05] gap-4 md:gap-8 hover:bg-white/[0.01] px-2 rounded-lg transition-colors"
              id={`experience-timeline-row-${idx}`}
            >
              <div className="md:col-span-3">
                <span className="font-mono text-xs text-onyx-400 tracking-wider font-semibold">
                  {job.year}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-display text-base font-medium text-white">{job.role}</h3>
                <p className="font-mono text-[11px] text-onyx-500 uppercase tracking-widest mt-0.5">{job.company}</p>
              </div>
              <div className="md:col-span-5">
                <p className="text-xs sm:text-sm text-onyx-300 font-light leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clients Endorsements & Reviews */}
      <div className="border-t border-white/[0.06] pt-16 pb-12">
        <div className="flex items-center gap-2 mb-10">
          <Award className="w-5 h-5 text-yellow-500" />
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight uppercase text-white">
            CLIENT ENDORSEMENTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clientReviews.map((review, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-onyx-900 border border-white/[0.04] flex flex-col justify-between hover:bg-white/[0.02]"
              id={`endorsement-review-${idx}`}
            >
              <p className="text-xs sm:text-sm text-onyx-300 font-sans italic leading-relaxed mb-6">
                "{review.comment}"
              </p>
              <div>
                <p className="text-xs font-display font-medium text-white">{review.name}</p>
                <p className="font-mono text-[9px] text-onyx-500 uppercase tracking-wider">
                  {review.role}, <span className="text-onyx-400 font-medium">{review.company}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
