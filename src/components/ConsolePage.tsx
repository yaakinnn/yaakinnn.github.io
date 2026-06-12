/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Project, 
  ClientReview, 
  TimelineItem, 
  ProjectCategory, 
  EmbedType 
} from '../types';
import { 
  getStoredProjects, 
  saveProjects, 
  getStoredTimeline, 
  saveTimeline, 
  getStoredReviews, 
  saveReviews, 
  resetAllData,
  generateTypeScriptCode 
} from '../data/store';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  Copy, 
  Check, 
  RefreshCw, 
  Database, 
  Briefcase, 
  FileText, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  Lock,
  Unlock,
  Key,
  LogOut
} from 'lucide-react';

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'timeline' | 'endorsements' | 'export'>('projects');
  
  // Simple username & password lock
  const [isLocked, setIsLocked] = useState(true);
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);

  // Check login state on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('portfolio_editor_authorized');
    if (isAuth === 'true') {
      setIsLocked(false);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Predefined secure default credentials
    if (inputUser.trim() === 'admin' && inputPass === 'admin123') {
      setIsLocked(false);
      sessionStorage.setItem('portfolio_editor_authorized', 'true');
      setLoginError('');
      showToast('Welcome back, Creative Director!');
    } else {
      setLoginError('Invalid Username or Password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLocked(true);
    sessionStorage.removeItem('portfolio_editor_authorized');
    setInputUser('');
    setInputPass('');
    showToast('Secure session logged out.');
  };

  // UI Feedback
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states - Projects
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    id: '',
    title: '',
    category: 'video-editing',
    description: '',
    client: '',
    role: '',
    year: new Date().getFullYear().toString(),
    embedType: 'youtube',
    embedUrl: '',
    coverImageUrl: '',
    videoPreviewUrl: '',
    aspectRatio: 'video',
    images: [],
    featured: false,
    videoForm: 'long'
  });
  const [commaImages, setCommaImages] = useState('');

  // Form states - Timeline
  const [editingTimelineIdx, setEditingTimelineIdx] = useState<number | null>(null);
  const [timelineForm, setTimelineForm] = useState<TimelineItem>({
    year: '',
    role: '',
    company: '',
    description: ''
  });

  // Form states - Reviews
  const [editingReviewIdx, setEditingReviewIdx] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState<ClientReview>({
    name: '',
    role: '',
    company: '',
    comment: ''
  });

  // Load datasets on mount
  useEffect(() => {
    setProjects(getStoredProjects());
    setTimeline(getStoredTimeline());
    setReviews(getStoredReviews());
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetToStatic = () => {
    if (window.confirm('Are you sure you want to reset all data back to the default original portfolio state? This will clear local browser edits.')) {
      resetAllData();
      setProjects(getStoredProjects());
      setTimeline(getStoredTimeline());
      setReviews(getStoredReviews());
      showToast('All databases reverted to original defaults!');
      setShowResetConfirm(false);
    }
  };

  // --- PROJECT ACTIONS ---
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-slugify id if empty
    const slugId = projectForm.id?.trim() || 
      (projectForm.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (!slugId) {
      showToast('Please provide a title or ID first.');
      return;
    }

    const imgArray = commaImages
      ? commaImages.split(',').map(img => img.trim()).filter(img => img.length > 0)
      : [];

    const finalProject: Project = {
      ...(projectForm as Project),
      id: slugId,
      images: imgArray
    };

    let updated: Project[];
    if (editingProjectId) {
      // Edit
      updated = projects.map(p => p.id === editingProjectId ? finalProject : p);
      showToast('Project updated successfully.');
    } else {
      // Add
      if (projects.some(p => p.id === slugId)) {
        showToast(`Error: A project with ID "${slugId}" already exists.`);
        return;
      }
      updated = [...projects, finalProject];
      showToast('New project created and stored!');
    }

    setProjects(updated);
    saveProjects(updated);
    resetProjectForm();
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      id: '',
      title: '',
      category: 'video-editing',
      description: '',
      client: '',
      role: '',
      year: new Date().getFullYear().toString(),
      embedType: 'youtube',
      embedUrl: '',
      coverImageUrl: '',
      videoPreviewUrl: '',
      aspectRatio: 'video',
      images: [],
      featured: false,
      videoForm: 'long'
    });
    setCommaImages('');
  };

  const handleEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm(p);
    setCommaImages(p.images ? p.images.join(', ') : '');
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (window.confirm(`Delete project "${name}"? This will update the storage immediately.`)) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
      showToast('Project deleted.');
      if (editingProjectId === id) resetProjectForm();
    }
  };

  // --- TIMELINE ACTIONS ---
  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineForm.year || !timelineForm.role || !timelineForm.company) {
      showToast('Please print all main fields (Year, Role, Company)');
      return;
    }

    let updated: TimelineItem[];
    if (editingTimelineIdx !== null) {
      updated = [...timeline];
      updated[editingTimelineIdx] = timelineForm;
      showToast('Timeline chronology row updated!');
    } else {
      updated = [...timeline, timelineForm];
      showToast('New timeline chronology event added!');
    }

    setTimeline(updated);
    saveTimeline(updated);
    resetTimelineForm();
  };

  const resetTimelineForm = () => {
    setEditingTimelineIdx(null);
    setTimelineForm({
      year: '',
      role: '',
      company: '',
      description: ''
    });
  };

  const handleDeleteTimeline = (idx: number) => {
    if (window.confirm('Remove this chronology item from your professional timeline?')) {
      const updated = timeline.filter((_, i) => i !== idx);
      setTimeline(updated);
      saveTimeline(updated);
      showToast('Timeline event removed.');
      if (editingTimelineIdx === idx) resetTimelineForm();
    }
  };

  // --- REVIEWS ACTIONS ---
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.company || !reviewForm.comment) {
      showToast('All testimonial fields are required.');
      return;
    }

    let updated: ClientReview[];
    if (editingReviewIdx !== null) {
      updated = [...reviews];
      updated[editingReviewIdx] = reviewForm;
      showToast('Client review updated list!');
    } else {
      updated = [...reviews, reviewForm];
      showToast('New client endorsement published!');
    }

    setReviews(updated);
    saveReviews(updated);
    resetReviewForm();
  };

  const resetReviewForm = () => {
    setEditingReviewIdx(null);
    setReviewForm({
      name: '',
      role: '',
      company: '',
      comment: ''
    });
  };

  const handleDeleteReview = (idx: number) => {
    if (window.confirm('Delete this client endorsement?')) {
      const updated = reviews.filter((_, i) => i !== idx);
      setReviews(updated);
      saveReviews(updated);
      showToast('Endorsement review deleted.');
      if (editingReviewIdx === idx) resetReviewForm();
    }
  };

  const triggerCopyCode = () => {
    const code = generateTypeScriptCode(projects, timeline, reviews);
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      showToast('Source code copied to your clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLocked) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4 sm:py-24 animate-fade-in" id="console-auth-container">
        {notification && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase px-6 py-3 rounded-full shadow-2xl z-[9999] flex items-center gap-2 border border-black/10 transition-all duration-300 animate-slide-up">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>{notification}</span>
          </div>
        )}

        <div className="border border-white/[0.08] bg-onyx-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 shadow-lg">
              <Lock className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white uppercase col-span-2">
              CREATIVE LOCKBOX
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-widest text-onyx-400 mt-2">
              SECURE PORTFOLIO GATEWAY
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 text-xs text-onyx-200" id="login-form">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-widest flex items-center gap-1.5 font-medium">
                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                <span>USERNAME</span>
              </label>
              <input
                type="text"
                required
                value={inputUser}
                onChange={e => setInputUser(e.target.value)}
                placeholder="Enter console username"
                className="w-full bg-black/60 border border-white/10 focus:border-white rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none transition-colors font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-widest flex items-center gap-1.5 font-medium">
                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                <span>SECURED PASSWORD</span>
              </label>
              <input
                type="password"
                required
                value={inputPass}
                onChange={e => setInputPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-white/10 focus:border-white rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none transition-colors font-mono"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/25 border border-red-500/25 text-red-400 rounded-lg font-mono text-[10px] uppercase tracking-wider text-center animate-shake" id="login-error-alert">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3.5 bg-white text-black font-semibold text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all hover:bg-onyx-100 flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer group mt-2"
              id="btn-login-submit"
            >
              <Unlock className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Unlock Admin Console</span>
            </button>
          </form>

          {/* Elegant hint explaining values - super clean developer touch */}
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <span className="font-mono text-[8px] tracking-widest text-onyx-500 uppercase block select-none">
              DEFAULT SYSTEM CREDENTIALS:
            </span>
            <div className="inline-flex gap-4 font-mono text-[9px] text-yellow-400/80 bg-white/[0.02] border border-white/[0.04] px-4 py-2 rounded-full mt-3">
              <span>USER: <strong className="text-white">admin</strong></span>
              <span className="text-white/20">|</span>
              <span>PASS: <strong className="text-white">admin123</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-8 animate-fade-in" id="console-workspace">
      {/* Toast notifier banner */}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase px-6 py-3 rounded-full shadow-2xl z-[9999] flex items-center gap-2 border border-black/10 transition-all duration-300 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Jumbotron HUD Header bar */}
      <div className="border border-white/[0.05] bg-onyx-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.015] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-lg">
            <Database className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-onyx-400">CONSOLE SESSION STABLE</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              CREATIVE DESK CONSOLE
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToStatic}
            className="px-4 py-2 bg-transparent hover:bg-red-950/20 text-red-400 border border-red-500/10 hover:border-red-500/30 font-mono text-[9px] tracking-widest uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset storage override back to stock files data"
            id="btn-revert-database"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Database Defaults</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/5 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 font-mono text-[9px] tracking-widest uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Securely lock the console session"
            id="btn-logout"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation and tab controllers */}
      <div className="flex border-b border-white/[0.06] mb-8 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`py-3 px-5 border-b-2 font-mono text-[10px] tracking-widest uppercase transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'border-white text-white font-medium'
              : 'border-transparent text-onyx-400 hover:text-white'
          }`}
          id="tab-projects"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-5 border-b-2 font-mono text-[10px] tracking-widest uppercase transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-white text-white font-medium'
              : 'border-transparent text-onyx-400 hover:text-white'
          }`}
          id="tab-timeline"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline ({timeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('endorsements')}
          className={`py-3 px-5 border-b-2 font-mono text-[10px] tracking-widest uppercase transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'endorsements'
              ? 'border-white text-white font-medium'
              : 'border-transparent text-onyx-400 hover:text-white'
          }`}
          id="tab-endorsements"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Endorsements ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`py-3 px-5 border-b-2 font-mono text-[10px] tracking-widest uppercase transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'export'
              ? 'border-white text-white font-medium'
              : 'border-transparent text-nyx-100 text-yellow-400 hover:text-yellow-300'
          }`}
          id="tab-export-sync"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sync & Export Code</span>
        </button>
      </div>

      {/* --- TAB CONTENT: PROJECTS MANAGER --- */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Edit / Add Project Panel (Left column - Form) */}
          <div className="lg:col-span-12 xl:col-span-8 bg-onyx-900 border border-white/[0.04] rounded-2xl p-6 shadow-xl">
            <h2 className="font-display text-lg font-medium text-white mb-6 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>{editingProjectId ? `EDITING PROJECT ID: ${editingProjectId}` : 'ADD A NEW PORTFOLIO PROJECT'}</span>
            </h2>

            <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-onyx-200">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">PROJECT TITLE *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title || ''}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Cyberpunk Neon Drifts"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors font-sans text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">
                  PROJECT ID SLUG (AUTO-GENERATES IF EMPTY)
                </label>
                <input
                  type="text"
                  value={projectForm.id || ''}
                  onChange={e => setProjectForm({ ...projectForm, id: e.target.value })}
                  placeholder="e.g. cyberpunk-neon-drifts"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors font-mono"
                  disabled={!!editingProjectId}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">DISCIPLINE CATEGORY *</label>
                <select
                  required
                  value={projectForm.category}
                  onChange={e => setProjectForm({ ...projectForm, category: e.target.value as ProjectCategory })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono uppercase tracking-widest text-[10px]"
                >
                  <option value="video-editing">VIDEO EDITING / FILMS</option>
                  <option value="motion-3d">MOTION & 3D ART</option>
                  <option value="photography">PHOTOGRAPHY / GRAPHICS</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">CLIENT NAME *</label>
                <input
                  type="text"
                  required
                  value={projectForm.client || ''}
                  onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                  placeholder="e.g. Cyberpunk Apparel Co."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors font-sans text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">CREATIVE ROLE IN CHARGE *</label>
                <input
                  type="text"
                  required
                  value={projectForm.role || ''}
                  onChange={e => setProjectForm({ ...projectForm, role: e.target.value })}
                  placeholder="e.g. Lead Video Editor & Colorist"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors font-sans text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">PRODUCTION YEAR *</label>
                <input
                  type="text"
                  required
                  value={projectForm.year || ''}
                  onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                  placeholder="e.g. 2026"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">EMBED PLAYER TYPE *</label>
                <select
                  required
                  value={projectForm.embedType}
                  onChange={e => setProjectForm({ ...projectForm, embedType: e.target.value as EmbedType })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono uppercase tracking-widest text-[10px]"
                >
                  <option value="youtube">YouTube (Video / Short)</option>
                  <option value="gdrive">Google Drive Video Player</option>
                  <option value="instagram">Instagram Post / Reel</option>
                  <option value="tiktok">TikTok Embed Player</option>
                  <option value="video">Direct Looping Video (.mp4 link)</option>
                  <option value="images">Slide Show Gallery (Photography)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">
                  EMBED TARGET / SHARING LINK
                </label>
                <input
                  type="url"
                  value={projectForm.embedUrl || ''}
                  onChange={e => setProjectForm({ ...projectForm, embedUrl: e.target.value })}
                  placeholder="YouTube watch link, drive file link, Instagram reel link..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">
                  PROJECT EXPERIENCE / STORY DESCRIPTION *
                </label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.description || ''}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Tell the story or specifications of your creative project, custom color gradings, pacing details..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors font-sans text-sm resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">GRID COVER IMAGE COVER URL *</label>
                <input
                  type="url"
                  required
                  value={projectForm.coverImageUrl || ''}
                  onChange={e => setProjectForm({ ...projectForm, coverImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">
                  VIDEO LOOP PREVIEW URL (.mp4 optional)
                </label>
                <input
                  type="url"
                  value={projectForm.videoPreviewUrl || ''}
                  onChange={e => setProjectForm({ ...projectForm, videoPreviewUrl: e.target.value })}
                  placeholder="A fast 1-5 second looping ambient clip link"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">GRID PORTFOLIO ASPECT RATIO</label>
                <select
                  value={projectForm.aspectRatio}
                  onChange={e => setProjectForm({ ...projectForm, aspectRatio: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono text-[10px] uppercase tracking-widest"
                >
                  <option value="video">Widescreen Video (16:9)</option>
                  <option value="square">Square Frame (1:1 / Insta Grid)</option>
                  <option value="vertical">Vertical Mobile Reel (9:16)</option>
                </select>
              </div>

              {projectForm.category === 'video-editing' && (
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">VIDEO DURATION FORMAT</label>
                  <select
                    value={projectForm.videoForm}
                    onChange={e => setProjectForm({ ...projectForm, videoForm: e.target.value as 'long' | 'short' })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors font-mono text-[10px] uppercase tracking-widest"
                  >
                    <option value="long">Long Form / Cinema / Brand Doc</option>
                    <option value="short">Short Form / Social Reel / Ad Clip</option>
                  </select>
                </div>
              )}

              {projectForm.embedType === 'images' && (
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">
                    MULTIPLE PHOTOGRAPHY IMAGES (COMMA-SEPARATED IMAGE LINKS)
                  </label>
                  <textarea
                    rows={2}
                    value={commaImages}
                    onChange={e => setCommaImages(e.target.value)}
                    placeholder="https://image-link1.com, https://image-link2.com, https://image-link3.com"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-xs resize-none font-mono"
                  />
                </div>
              )}

              <div className="md:col-span-2 py-2 flex items-center gap-6">
                <label className="flex items-center gap-2.5 font-mono text-[10px] tracking-wider uppercase text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!projectForm.featured}
                    onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="w-4 h-4 bg-black/40 border border-white/10 rounded border-white/20 accent-white shrink-0 focus:ring-0 cursor-pointer"
                  />
                  <span>FEATURE ON HOME PAGE ("SELECTED WORKS")</span>
                </label>
              </div>

              <div className="md:col-span-2 pt-4 flex gap-3 border-t border-white/[0.04] mt-2 justify-end">
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="px-5 py-2.5 bg-transparent border border-white/15 hover:bg-white/5 text-white text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all"
                  >
                    Cancel Editing
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingProjectId ? 'Save Project Details' : 'Deploy This Project'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Stored Projects Inventory Index (Right column) */}
          <div className="lg:col-span-12 xl:col-span-4 bg-onyx-900/50 border border-white/[0.04] rounded-2xl p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="font-display text-sm font-medium text-white mb-4 uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span>PROJECT LIST ({projects.length})</span>
              <span className="text-[10px] font-mono text-white/40">ACTION HUB</span>
            </h2>

            {projects.length === 0 ? (
              <p className="font-mono text-[10px] text-onyx-500 py-10 text-center">No projects in database directory.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      editingProjectId === proj.id 
                        ? 'bg-white/10 border-white' 
                        : 'bg-black/30 border-white/[0.04] hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded overflow-hidden aspect-square border border-white/[0.08] shrink-0 bg-black flex items-center justify-center">
                        {proj.coverImageUrl ? (
                          <img src={proj.coverImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Database className="w-4 h-4 text-onyx-500" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-display text-white font-medium truncate leading-tight">{proj.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap overflow-hidden">
                          <span className="font-mono text-[8px] text-onyx-500 uppercase tracking-widest truncate">{proj.category}</span>
                          {proj.featured && (
                            <span className="text-[7px] font-mono bg-yellow-400 text-black px-1 rounded-sm leading-none shrink-0 font-bold">SELECTED</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEditProject(proj)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-white transition-colors border border-white/5"
                        title="Edit project dataset parameters"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-1.5 rounded bg-red-950/20 hover:bg-red-950/55 text-red-400 hover:text-red-300 transition-colors border border-red-500/10"
                        title="Delete project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: TIMELINE CHRONOLOGY MANAGER --- */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Edit / Add Timeline Item */}
          <div className="lg:col-span-12 xl:col-span-7 bg-onyx-900 border border-white/[0.04] rounded-2xl p-6 shadow-xl">
            <h2 className="font-display text-lg font-medium text-white mb-6 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>{editingTimelineIdx !== null ? `EDITING INDEX #${editingTimelineIdx}` : 'ADD EVENT TO TIMELINE'}</span>
            </h2>

            <form onSubmit={handleTimelineSubmit} className="flex flex-col gap-5 text-xs text-onyx-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">PERIOD YEAR RATIO *</label>
                  <input
                    type="text"
                    required
                    value={timelineForm.year}
                    onChange={e => setTimelineForm({ ...timelineForm, year: e.target.value })}
                    placeholder="e.g. 2025 - Present, or 2024"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">OFFICIAL RECOGNIZED ROLE *</label>
                  <input
                    type="text"
                    required
                    value={timelineForm.role}
                    onChange={e => setTimelineForm({ ...timelineForm, role: e.target.value })}
                    placeholder="e.g. Senior Video Director"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">COMPANY OR PUBLICATION HUB *</label>
                <input
                  type="text"
                  required
                  value={timelineForm.company}
                  onChange={e => setTimelineForm({ ...timelineForm, company: e.target.value })}
                  placeholder="e.g. Metropolis Digital Studios Paris"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">DUTIES & ACHIEVEMENTS NARRATIVE</label>
                <textarea
                  rows={4}
                  value={timelineForm.description}
                  onChange={e => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  placeholder="Summarize the dynamic assignments handled, collaborative studios directed, visual awards..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-white/[0.04] justify-end">
                {editingTimelineIdx !== null && (
                  <button
                    type="button"
                    onClick={resetTimelineForm}
                    className="px-5 py-2.5 bg-transparent border border-white/15 hover:bg-white/5 text-white text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingTimelineIdx !== null ? 'Save Chronology Row' : 'Append to Timeline'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Chronology List */}
          <div className="lg:col-span-12 xl:col-span-5 bg-onyx-900/50 border border-white/[0.04] rounded-2xl p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="font-display text-sm font-medium text-white mb-4 uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span>TIMELINE INDEX EVENTS ({timeline.length})</span>
              <span className="text-[10px] font-mono text-white/40">INDEXED CHRONOLOGY</span>
            </h2>

            {timeline.length === 0 ? (
              <p className="font-mono text-[10px] text-onyx-500 py-10 text-center">No chronology events published yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {timeline.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-2.5 transition-colors ${
                      editingTimelineIdx === idx 
                        ? 'bg-white/10 border-white' 
                        : 'bg-black/30 border-white/[0.04] hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[9px] text-white bg-white/10 px-2 py-0.5 rounded leading-none shrink-0 font-bold uppercase tracking-widest">
                          {item.year}
                        </span>
                        <h3 className="text-xs font-display text-white font-semibold mt-2">{item.role}</h3>
                        <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-0.5">{item.company}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingTimelineIdx(idx);
                            setTimelineForm(item);
                          }}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-white transition-colors border border-white/5"
                          title="Edit timeline criteria"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTimeline(idx)}
                          className="p-1.5 rounded bg-red-950/20 hover:bg-red-950/55 text-red-400 hover:text-red-300 transition-colors border border-red-500/10"
                          title="Delete chronological segment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] font-light text-onyx-300 leading-relaxed max-w-sm mt-1">
                      {item.description || 'No description listed'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: CLIENT TESTIMONIALS MANAGER --- */}
      {activeTab === 'endorsements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Edit / Add Testimonial */}
          <div className="lg:col-span-12 xl:col-span-7 bg-onyx-900 border border-white/[0.04] rounded-2xl p-6 shadow-xl">
            <h2 className="font-display text-lg font-medium text-white mb-6 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>{editingReviewIdx !== null ? `EDITING TESTIMONIAL #${editingReviewIdx}` : 'ADD DIRECT CLIENT ENDORSEMENT'}</span>
            </h2>

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-5 text-xs text-onyx-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">CLIENT FULL NAME *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">CLIENT DESIGNATION ROLE *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.role}
                    onChange={e => setReviewForm({ ...reviewForm, role: e.target.value })}
                    placeholder="e.g. Art Director"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">COMPANY CORP BRAND *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.company}
                    onChange={e => setReviewForm({ ...reviewForm, company: e.target.value })}
                    placeholder="e.g. Cyberpunk Apparel Co."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-wider">DIRECT FEEDBACK / COMMENT *</label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Praising words of high quality, visual editing styles, fast delivery timescales..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-onyx-600 focus:outline-none focus:border-white transition-colors text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-white/[0.04] justify-end">
                {editingReviewIdx !== null && (
                  <button
                    type="button"
                    onClick={resetReviewForm}
                    className="px-5 py-2.5 bg-transparent border border-white/15 hover:bg-white/5 text-white text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all"
                  >
                    Cancel Editing
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingReviewIdx !== null ? 'Update Endorsement' : 'Publish Endorsement'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Testimonial review database */}
          <div className="lg:col-span-12 xl:col-span-5 bg-onyx-900/50 border border-white/[0.04] rounded-2xl p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="font-display text-sm font-medium text-white mb-4 uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span>EXISTING ENDORSEMENTS ({reviews.length})</span>
              <span className="text-[10px] font-mono text-white/40">REVIEWS PANEL</span>
            </h2>

            {reviews.length === 0 ? (
              <p className="font-mono text-[10px] text-onyx-500 py-10 text-center">No endorsements recorded in directory local storage yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((rev, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-colors ${
                      editingReviewIdx === idx 
                        ? 'bg-white/10 border-white' 
                        : 'bg-black/30 border-white/[0.04] hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-display text-white font-semibold leading-none">{rev.name}</h4>
                        <p className="font-mono text-[9px] text-onyx-500 uppercase tracking-widest mt-1.5">
                          {rev.role}, <span className="text-white/45">{rev.company}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingReviewIdx(idx);
                            setReviewForm(rev);
                          }}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-white transition-colors border border-white/5"
                          title="Edit client parameters"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(idx)}
                          className="p-1.5 rounded bg-red-950/20 hover:bg-red-950/55 text-red-400 hover:text-red-300 transition-colors border border-red-500/10"
                          title="Delete endorsement review"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] font-sans italic text-onyx-300 leading-relaxed mt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: EXPORT CODE / FILES SYNC HUB --- */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-12 lg:col-span-12 bg-onyx-900 border border-white/[0.04] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 text-emerald-500 font-mono text-[9px] bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 tracking-widest uppercase flex items-center gap-1 shadow">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>CODER SAFE BUILD</span>
            </div>

            <h2 className="font-display text-lg font-medium text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>PRODUCE ERROR-FREE CODE</span>
            </h2>

            <p className="text-xs text-onyx-300 leading-relaxed mb-6 font-sans">
              Since adding rows or columns in raw TypeScript arrays can easily be prone to syntax errors (like missing commas or trailing brackets), this tool takes your active browser-based local dataset and instantly packs them into an absolute flawless, compiled TypeScript declaration code box below.
              Simply click <strong className="text-white">"Copy Full Source Code"</strong>, open your files, select all and replace. It completely bypasses any esbuild or syntax errors, keeping your portfolio perfectly pristine.
            </p>

            {/* Code Output Window with custom JetBrains monospace fonts */}
            <div className="relative w-full border border-white/10 rounded-xl overflow-hidden bg-black/60 shadow-inner flex flex-col mb-6">
              <div className="bg-black/80 border-b border-white/[0.05] p-3.5 flex items-center justify-between text-[10px] font-mono text-onyx-400 tracking-wider">
                <span>COMPILED FOR: /src/data/projects.ts & /src/components/AboutPage.tsx</span>
                <button
                  type="button"
                  onClick={triggerCopyCode}
                  className="bg-white hover:bg-onyx-200 text-black px-4 py-1.5 rounded-md font-mono text-[9px] tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:scale-103 shadow-md"
                  id="btn-copy-generated-code"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied code!' : 'Copy Full Source Code'}</span>
                </button>
              </div>

              <pre className="p-6 overflow-x-auto text-[11px] font-mono leading-relaxed text-indigo-100 max-h-[50vh] scrollbar-thin selection:bg-white/25">
                <code>
                  {generateTypeScriptCode(projects, timeline, reviews)}
                </code>
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-white/[0.04]">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-onyx-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-onyx-400 leading-relaxed max-w-xl">
                  <strong>Permanent Data Tip:</strong> Changes made here persist in your local browser storage instantly. When you are fully satisfied with your catalog, copy this compiled box and save it directly into the codebase to sync beautifully!
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#/"
                  className="px-5 py-2.5 border border-white/10 hover:border-white/30 text-white font-mono text-[9px] tracking-widest uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer bg-white/[0.01]"
                  id="btn-console-back-home"
                >
                  <span>Return to Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
