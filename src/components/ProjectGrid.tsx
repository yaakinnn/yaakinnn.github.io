/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, List, ArrowUpRight, Play, Eye } from 'lucide-react';
import { Project } from '../types';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (slug: string) => void;
  activeCategory: string;
}

export default function ProjectGrid({ projects, onSelectProject, activeCategory }: ProjectGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [listHoverPos, setListHoverPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Track pointer for listing overlay
  const handleListMouseMove = (e: React.MouseEvent) => {
    if (viewMode !== 'list') return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Position floating thumbnail slightly offset from cursor
    setListHoverPos({
      x: e.clientX - rect.left + 20,
      y: e.clientY - rect.top - 60
    });
  };

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'video-editing': return 'Video Editing';
      case 'motion-3d': return 'Motion & 3D Design';
      case 'photography': return 'Photographic portfolio';
      default: return 'All Selected Works';
    }
  };

  return (
    <div className="w-full" ref={containerRef} id="portfolio-workspace">
      {/* Category header / layout toggle */}
      <div className="flex justify-between items-end border-b border-white/[0.06] pb-5 mb-10">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-onyx-500 uppercase mb-1.5">
            Portfolio / {getCategoryTitle().toUpperCase()}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-white tracking-tight">
            {getCategoryTitle()}
          </h2>
        </div>

        <div className="flex bg-onyx-900 border border-white/[0.06] p-1 rounded-full gap-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-black' : 'text-onyx-400 hover:text-white'
            }`}
            title="Grid View"
            data-cursor="GRID MODE"
            id="btn-toggle-grid-view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-white text-black' : 'text-onyx-400 hover:text-white'
            }`}
            title="List View"
            data-cursor="LIST MODE"
            id="btn-toggle-list-view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-onyx-900/45">
          <p className="font-mono text-sm text-onyx-400">No creative works added under this path yet.</p>
          <p className="font-mono text-xs text-onyx-600 mt-2">Add projects to /src/data/projects.ts to populate.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* --- GRID VIEW MODE --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-fade-in">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              className="group relative cursor-pointer flex flex-col bg-onyx-900 border border-white/[0.05] hover:border-white/[0.15] rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px]"
              data-cursor="VIEW"
              id={`project-card-${project.id}`}
            >
              {/* Image Container with loop preview nested inside */}
              <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[4/3] bg-onyx-950 overflow-hidden">
                <img
                  src={project.coverImageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Looping video preview playing on hover */}
                {project.videoPreviewUrl && hoveredProjectId === project.id && (
                  <video
                    src={project.videoPreviewUrl}
                    className="absolute inset-0 w-full h-full object-cover z-10 animate-fade-in"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                )}

                {/* Grid Overlay on Hover */}
                <div className="absolute inset-0 z-25 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white text-black px-4 py-2 rounded-full font-mono text-[9px] tracking-widest uppercase font-semibold flex items-center gap-1">
                    <span>LAUNCH PORTAL</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Small category bubble top edge */}
                <span className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded font-mono text-[8px] tracking-widest text-white uppercase border border-white/10">
                  {project.category.replace('-', ' ')}
                </span>

                {/* Year tag bottom right */}
                <span className="absolute bottom-4 right-4 z-20 px-2 py-0.5 bg-black/65 backdrop-blur-sm rounded font-mono text-[9px] text-onyx-300">
                  {project.year}
                </span>
              </div>

              {/* Title area */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-medium text-white group-hover:text-white transition-colors tracking-tight line-clamp-1 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-onyx-400 font-mono tracking-tight line-clamp-2">
                    {project.description}
                  </p>
                </div>
                
                {/* Secondary data tags */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/[0.04] text-[10px] font-mono text-onyx-500">
                  <span className="uppercase tracking-wider truncate max-w-[150px]">CL: {project.client}</span>
                  <span className="uppercase tracking-wider">ROLE: {project.embedType.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- LIST VIEW MODE (Highly Classy Pacome style) --- */
        <div 
          className="relative py-4 border-t border-white/[0.06] animate-fade-in select-none"
          onMouseMove={handleListMouseMove}
          id="project-list-wrapper"
        >
          {projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/[0.05] cursor-pointer"
              data-cursor="PLAY"
              id={`project-list-row-${project.id}`}
            >
              {/* Left group */}
              <div className="flex items-center gap-4 sm:gap-8 flex-grow">
                <span className="font-mono text-xs text-onyx-500 w-8">0{idx + 1}</span>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-normal text-onyx-400 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 uppercase tracking-tight">
                    {project.title}
                  </h3>
                  {/* Small tag row for mobile */}
                  <div className="flex md:hidden gap-2 mt-1.5">
                    <span className="px-1.5 py-0.5 bg-white/5 rounded font-mono text-[8px] text-onyx-300 uppercase">
                      {project.category.replace('-', ' ')}
                    </span>
                    <span className="font-mono text-[9px] text-onyx-500">
                      {project.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roles & Meta column - Desktop */}
              <div className="hidden md:flex items-center gap-12 text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-onyx-500">
                  <span className="text-onyx-400">ROLE:</span> {project.role}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-onyx-500">
                  <span className="text-onyx-400">CLIENT:</span> {project.client}
                </div>
                <div className="font-mono text-[11px] text-onyx-400 w-16">
                  {project.year}
                </div>
              </div>
            </div>
          ))}

          {/* Floating Hover Visual Follower Container (only on desktop helper) */}
          {hoveredProjectId && (
            <div
              className="absolute pointer-events-none z-30 overflow-hidden rounded-xl border border-white/20 bg-onyx-950 shadow-2xl transition-all duration-300 ease-out hidden sm:block w-72 aspect-video"
              style={{
                left: `${listHoverPos.x}px`,
                top: `${listHoverPos.y}px`,
              }}
            >
              {/* Find the loaded project image & pre-embed video */}
              {projects.map((proj) => {
                if (proj.id !== hoveredProjectId) return null;
                return (
                  <div key={proj.id} className="relative w-full h-full">
                    <img
                      src={proj.coverImageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {proj.videoPreviewUrl && (
                      <video
                        src={proj.videoPreviewUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
