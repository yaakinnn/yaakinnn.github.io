/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ClientReview, TimelineItem } from '../types';
import { projectsData, clientReviews as defaultReviews } from './projects';

const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    year: '2022 - Present',
    role: 'Photographer, Videographer, Video Editor',
    company: 'LZY Visual',
    description: 'Captured and crafted compelling visual stories through photography, videography, and editing. Collaborated with teams to create high-quality content that connects brands with their audiences.'
  },
  {
    year: '2018 - 2022',
    role: 'Videographer, Video Editor, Motion Graphics',
    company: 'Freelancer',
    description: 'Creating high-quality visual content through videography, video editing, and motion graphics, delivering engaging and purposeful storytelling that aligns with brand identity and communication goals.'
  }
];

// LocalStorage Keys
const KEYS = {
  PROJECTS: 'portfolio_projects_data_v1',
  TIMELINE: 'portfolio_timeline_data_v1',
  REVIEWS: 'portfolio_reviews_data_v1'
};

// 1. PROJECTS STORE
export function getStoredProjects(): Project[] {
  try {
    const data = localStorage.getItem(KEYS.PROJECTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error parsing stored projects', e);
  }
  return projectsData;
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
}

// 2. TIMELINE STORE
export function getStoredTimeline(): TimelineItem[] {
  try {
    const data = localStorage.getItem(KEYS.TIMELINE);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error parsing stored timeline', e);
  }
  return DEFAULT_TIMELINE;
}

export function saveTimeline(timeline: TimelineItem[]): void {
  localStorage.setItem(KEYS.TIMELINE, JSON.stringify(timeline));
}

// 3. REVIEWS STORE
export function getStoredReviews(): ClientReview[] {
  try {
    const data = localStorage.getItem(KEYS.REVIEWS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error parsing stored reviews', e);
  }
  return defaultReviews;
}

export function saveReviews(reviews: ClientReview[]): void {
  localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
}

// 4. RESET ALL TO DEFAULT
export function resetAllData(): void {
  localStorage.removeItem(KEYS.PROJECTS);
  localStorage.removeItem(KEYS.TIMELINE);
  localStorage.removeItem(KEYS.REVIEWS);
}

// 5. HELPER TO EXPORT ENTIRE DATA FOR COPY-PASTE (PREVENTS BRACKET ERRORS)
export function generateTypeScriptCode(projects: Project[], timeline: TimelineItem[], reviews: ClientReview[]): string {
  const cleanProjects = JSON.stringify(projects, null, 2);
  const cleanTimeline = JSON.stringify(timeline, null, 2);
  const cleanReviews = JSON.stringify(reviews, null, 2);

  return `/**
 * COPY AND PASTE THIS DIRECTLY INTO YOUR FILES TO SAVE PERMANENTLY!
 * This avoids any syntax errors because it is generated automatically.
 */

// 1. PLACE THIS IN /src/data/projects.ts :
export const projectsData = ${cleanProjects};

export const clientReviews = ${cleanReviews};


// 2. PLACE THIS IN /src/components/AboutPage.tsx EXPERIENCE SECTION :
const defaultExperience = ${cleanTimeline};
`;
}
