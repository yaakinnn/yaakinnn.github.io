/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Play, ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight, Loader2, Maximize2, X } from 'lucide-react';
import { normalizeEmbedUrl } from '../data/projects';
import { Project } from '../types';

interface MediaEmbedProps {
  project: Project;
}

export default function MediaEmbed({ project }: MediaEmbedProps) {
  const { embedType, embedUrl, aspectRatio, images, title } = project;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoaderActive, setIsLoaderActive] = useState(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Normalize final source URL based on helper
  const resolvedUrl = normalizeEmbedUrl(embedUrl, embedType);

  // Determine responsive aspect class
  let aspectClass = 'aspect-video'; // Default 16:9
  if (aspectRatio === 'vertical') {
    aspectClass = 'aspect-[9/16] max-w-[380px] mx-auto';
  } else if (aspectRatio === 'square') {
    aspectClass = 'aspect-square max-w-[550px] mx-auto';
  } else if (aspectRatio && aspectRatio.includes('/')) {
    aspectClass = `aspect-[${aspectRatio}]`;
  }

  // Handle ESC key to dismiss fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenOpen(false);
      } else if (e.key === 'ArrowRight' && isFullscreenOpen) {
        nextImage();
      } else if (e.key === 'ArrowLeft' && isFullscreenOpen) {
        prevImage();
      }
    };
    if (isFullscreenOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreenOpen, activeImageIndex]);

  const handleMediaLoad = () => {
    setIsLoaderActive(false);
  };

  const nextImage = () => {
    if (images && images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden bg-onyx-900 border border-white/[0.08] shadow-2xl">
      {/* 1. YouTube & custom iframe embedding */}
      {(embedType === 'youtube' || embedType === 'gdrive' || embedType === 'instagram' || embedType === 'tiktok') && (
        <div className={`relative w-full overflow-hidden transition-all duration-300 ${aspectClass}`}>
          {isLoaderActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-onyx-900 z-10">
              <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
              <p className="text-xs text-onyx-400 font-mono">Loading media stream...</p>
            </div>
          )}
          <iframe
            id={`embed-${project.id}`}
            src={resolvedUrl}
            title={`${title} Media Embed`}
            className="w-full h-full border-0 absolute inset-0 z-0 rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleMediaLoad}
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* 2. Direct HTML5 Video Player */}
      {embedType === 'video' && (
        <div className={`relative w-full ${aspectClass} bg-black`}>
          {!isVideoPlaying && (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer group bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${project.coverImageUrl})` }}
              onClick={() => setIsVideoPlaying(true)}
            >
              {/* Blur back drop */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                <p className="mt-4 text-xs font-mono tracking-widest text-white uppercase group-hover:text-white/80 transition-colors duration-200">
                  PLAY TRANSITION PREVIEW
                </p>
              </div>
            </div>
          )}
          
          {(isVideoPlaying || !project.coverImageUrl) && (
            <video
              src={embedUrl}
              className="w-full h-full object-contain rounded-xl"
              controls
              autoPlay
              onPlay={() => setIsVideoPlaying(true)}
              preload="auto"
            />
          )}
        </div>
      )}

      {/* 3. High Fidelity Photographic Image Gallery */}
      {embedType === 'images' && images && images.length > 0 && (
        <div className="flex flex-col w-full">
          {/* Main Visual Window with aspect ratio based on original photo */}
          <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-onyx-950 flex items-center justify-center group/gallery">
            <img
              src={images[activeImageIndex]}
              alt={`${title} Slide ${activeImageIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-all duration-500 cursor-pointer"
              id={`photographic-slide-${activeImageIndex}`}
              onClick={() => setIsFullscreenOpen(true)}
            />
            
            {/* Gallery Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                  aria-label="Previous image"
                  id={`btn-prev-image`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                  aria-label="Next image"
                  id={`btn-next-image`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Slider Counter overlay & Fullscreen Trigger button overlays */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsFullscreenOpen(true)}
                className="bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/10 p-1.5 rounded-md text-white transition-all shadow-md flex items-center justify-center gap-1.5 group/fs"
                title="View Fullscreen"
                id="btn-trigger-fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline">Fullscreen</span>
              </button>

              <div className="bg-black/55 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-md text-[10px] font-mono text-onyx-200 uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <ImageIcon className="w-3 h-3" />
                <span>{activeImageIndex + 1} / {images.length}</span>
              </div>
            </div>
          </div>

          {/* Thumbnails list below */}
          {images.length > 1 && (
            <div className="flex gap-2.5 p-3.5 bg-onyx-950/85 border-t border-white/[0.06] overflow-x-auto scrollbar-none justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                    activeImageIndex === idx ? 'border-white scale-105 shadow' : 'border-transparent opacity-40 hover:opacity-80'
                  }`}
                  id={`thumbnail-${idx}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Immersive Dark Fullscreen Lightbox Modal */}
          {isFullscreenOpen && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[99999] flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 animate-fade-in">
              {/* Header bar of Fullscreen Lightbox */}
              <div className="flex justify-between items-center w-full max-w-7xl mx-auto py-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-onyx-400 uppercase tracking-widest">PHOTOGRAPHY</span>
                  <span className="text-sm font-display text-white font-medium">{title}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-white/50">{activeImageIndex + 1} / {images.length}</span>
                  <button
                    onClick={() => setIsFullscreenOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/5"
                    aria-label="Close fullscreen view"
                    id="btn-close-fullscreen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Expanded Image Stage */}
              <div className="flex-1 flex items-center justify-center relative w-full h-[75vh]">
                {images.length > 1 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 z-10"
                    aria-label="Previous image"
                    id="btn-fs-prev"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                <img
                  src={images[activeImageIndex]}
                  alt={`${title} Fullscreen Slide`}
                  className="max-h-full max-w-full object-contain selection:bg-transparent rounded-lg shadow-2xl animate-scale-up"
                  id="fullscreen-active-image"
                />

                {images.length > 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 z-10"
                    aria-label="Next image"
                    id="btn-fs-next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Foot-Notes or thumbnails preview in Fullscreen mode */}
              <div className="w-full max-w-2xl mx-auto py-2 text-center">
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center overflow-x-auto py-2 scrollbar-none">
                    {images.map((img, idx) => (
                      <button
                        key={`fs-${idx}`}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-9 rounded overflow-hidden border transition-all ${
                          activeImageIndex === idx ? 'border-white scale-110 shadow' : 'border-white/10 opacity-30 hover:opacity-75'
                        }`}
                        id={`fs-thumbnail-${idx}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mt-2">
                  Use Left / Right arrow keys to navigate. Press ESC to close.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Embed tips guide bar to inform user about customization */}
      <div className="bg-onyx-950 p-3 flex justify-between items-center text-[10px] font-mono text-onyx-400 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>Source: {embedType.toUpperCase()} Source Verified</span>
        </div>
        <a 
          href={embedUrl || resolvedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
        >
          <span>Open Direct Link</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
