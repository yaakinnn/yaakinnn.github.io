/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Flame, Film, Palette } from 'lucide-react';
import { getStoredReviews, getStoredTimeline } from '../data/store';
import { ClientReview, TimelineItem } from '../types';
import ClientEndorsements from './ClientEndorsements';
import ProfileIntroBanner from './ProfileIntroBanner';

export default function AboutPage() {
  const [experience, setExperience] = useState<TimelineItem[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);

  useEffect(() => {
    setExperience(getStoredTimeline());
    setReviews(getStoredReviews());
  }, []);

  const skills = [
    { name: 'Video Editing', icon: Film, tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Capcut'] },
    { name: 'Motion Design', icon: Flame, tools: ['Adobe After Effects', 'Blender'] },
    { name: '3D Modeling & Rendering', icon: Palette, tools: ['Blender', 'Unreal Engine'] },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 animate-fade-in" id="about-workspace">
      {/* Intro visual banner */}
      <ProfileIntroBanner className="mb-20" />

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
                      - {tool}
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
      <ClientEndorsements reviews={reviews} />
    </div>
  );
}
