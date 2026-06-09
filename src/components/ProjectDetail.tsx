/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, ArrowRight, Share2, Calendar, User, Eye, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Project } from '../types';
import MediaEmbed from './MediaEmbed';

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
  onNavigate: (path: string) => void;
  onBack: () => void;
}

export default function ProjectDetail({ project, allProjects, onNavigate, onBack }: ProjectDetailProps) {
  const [copied, setCopied] = useState(false);

  // Track key scroll-to-top when project page shifts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  const handleShare = () => {
    // Generate unique project URL
    const shareableUrl = `${window.location.origin}${window.location.pathname}#/project/${project.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find next project in array for cyclic navigation
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const handleNextProject = () => {
    onNavigate(`#/project/${nextProject.id}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-8 animate-fade-in" id="project-detail-portal">
      {/* Top back navigation and share link */}
      <div className="flex justify-between items-center mb-8 border-b border-white/[0.04] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-onyx-300 hover:text-white transition-all cursor-pointer group"
          data-cursor="BACK"
          id="btn-back-to-works"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Portfolio</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-full text-white transition-all cursor-pointer"
          data-cursor="SHARE"
          id="btn-share-project"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-semibold">LINK COPIED ✓</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Shareable link</span>
            </>
          )}
        </button>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Embed Component & Player */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <MediaEmbed project={project} />

          {/* Quick responsiveness notice */}
          <div className="p-4 bg-onyx-900 border border-white/[0.04] rounded-xl flex gap-3 items-center">
            <AlertCircle className="w-4 h-4 text-onyx-400 flex-shrink-0" />
            <p className="text-[10px] font-mono text-onyx-400 leading-normal uppercase tracking-wider">
              Note: This player naturally maintains original content proportions ({project.aspectRatio || '16:9'}). If video is unresponsive, check if third-party tracking embeds are blocked.
            </p>
          </div>
        </div>

        {/* Right Column: Descriptions & Meta tags */}
        <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-24">
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-onyx-500 font-medium">
                {project.category.replace('-', ' ')}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              {project.title}
            </h1>
          </div>

          <div className="h-[1px] bg-white/[0.06]" />

          {/* Project Details Sheet */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-onyx-500 font-semibold">
              Project Specification
            </h3>
            
            <div className="grid grid-cols-2 gap-4 bg-onyx-900 border border-white/[0.04] p-5 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] text-onyx-500 uppercase">CLIENT</span>
                <span className="text-xs font-display font-medium text-white break-words">{project.client}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] text-onyx-500 uppercase">YEAR</span>
                <span className="text-xs font-display font-medium text-white">{project.year}</span>
              </div>

              <div className="flex flex-col gap-1 col-span-2 border-t border-white/[0.03] pt-3 mt-1">
                <span className="font-mono text-[8px] text-onyx-500 uppercase font-medium">CREATIVE ROLE IN CHARGE</span>
                <span className="text-xs font-sans font-light text-white leading-relaxed">{project.role}</span>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-onyx-500 font-semibold">
              The Story / Narrative Brief
            </h3>
            <p className="text-sm text-onyx-300 font-sans font-light leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="h-[1px] bg-white/[0.06]" />

          {/* Next Project Carousel Cycle Trigger */}
          <button
            onClick={handleNextProject}
            className="w-full p-4 border border-white/10 hover:border-white/30 bg-onyx-900 hover:bg-white hover:text-black hover:scale-[1.01] rounded-2xl flex justify-between items-center group transition-all cursor-pointer shadow"
            data-cursor="NEXT"
            id="btn-navigate-next-project"
          >
            <div className="text-left">
              <p className="font-mono text-[8px] text-onyx-500 uppercase group-hover:text-black/50">Next creative project</p>
              <p className="font-display text-sm font-semibold uppercase group-hover:text-black mt-0.5 line-clamp-1">
                {nextProject.title}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
