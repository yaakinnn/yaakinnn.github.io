/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ClientReview } from '../types';

/**
 * Utility to convert user-friendly links into proper embeddable iframe URLs.
 * Works dynamically with YouTube, Google Drive, Instagram, and TikTok links.
 */
export function normalizeEmbedUrl(url: string, type: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();

  try {
    if (type === 'youtube') {
      // Handle when the URL is actually just a video ID (usually 11 characters)
      if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
        return `https://www.youtube.com/embed/${cleanUrl}?autoplay=0&mute=0&rel=0`;
      }

      // Handle standard sharing URLs with youtube.com/watch
      if (cleanUrl.includes('youtube.com/watch') || cleanUrl.includes('m.youtube.com/watch')) {
        try {
          const urlParams = new URLSearchParams(new URL(cleanUrl).search);
          const videoId = urlParams.get('v');
          if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&rel=0`;
        } catch {
          // If URL parsing fails, try manual regex fallback
          const match = cleanUrl.match(/[?&]v=([^&#]+)/);
          if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&mute=0&rel=0`;
        }
      }

      // Handle https://youtu.be/abc123yz
      if (cleanUrl.includes('youtu.be/')) {
        const parts = cleanUrl.split('youtu.be/');
        const videoIdWithQuery = parts[parts.length - 1];
        const videoId = videoIdWithQuery.split('?')[0].split('/')[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&rel=0`;
      }

      // Handle https://www.youtube.com/shorts/abc123yz
      if (cleanUrl.includes('youtube.com/shorts/')) {
        const parts = cleanUrl.split('/shorts/');
        const videoId = parts[parts.length - 1].split('?')[0].split('/')[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }

      // Return URL as-is if already in embed format
      if (cleanUrl.includes('youtube.com/embed/') || cleanUrl.includes('youtube-nocookie.com/embed/')) {
        return cleanUrl;
      }
    }

    if (type === 'gdrive') {
      // Handle standard sharing: https://drive.google.com/file/d/123456789X/view?usp=sharing
      if (cleanUrl.includes('drive.google.com/file/d/')) {
        const parts = cleanUrl.split('/file/d/');
        if (parts.length > 1) {
          const fileId = parts[1].split('/')[0];
          return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
      // Return as-is if already in preview format
      if (cleanUrl.includes('/preview')) {
        return cleanUrl;
      }
    }

    if (type === 'instagram') {
      // Handle instagram post: https://www.instagram.com/p/Cg_X123yz/
      // Instagram embeds require either the standard post iframe format or /embed suffix
      if (cleanUrl.includes('instagram.com/')) {
        const baseUrl = cleanUrl.split('?')[0]; // strip query parameters
        const suffix = baseUrl.endsWith('/') ? 'embed' : '/embed';
        return `${baseUrl}${suffix}`;
      }
    }

    if (type === 'tiktok') {
      // TikTok embeds usually require their full JS embed widget or block.
      // We can load a TikTok video identifier inside a simplified embed player or handle fallback gracefully.
      // E.g., https://www.tiktok.com/@creator/video/1234567890
      if (cleanUrl.includes('tiktok.com/')) {
        const parts = cleanUrl.split('/video/');
        if (parts.length > 1) {
          const videoId = parts[1].split('?')[0];
          return `https://www.tiktok.com/embed/v2/${videoId}`;
        }
      }
    }
  } catch (error) {
    console.error('Error normalizing embed URL:', error);
  }

  // Fallback to returning original URL
  return cleanUrl;
}

/**
 * Static projects array.
 * To ADD, REMOVE, or MODIFY projects:
 * Simply update this array. The UI will instantly reflect your changes.
 */
export const projectsData: Project[] = [
  {
    id: 'cyberpunk-neon-drifts',
    title: 'Cyberpunk Neon Drifts',
    category: 'video-editing',
    description: 'A high-octane cinematic promotional reel blending aggressive pacing, split-second speed transitions, and custom sound design. Color-graded using extreme high-contrast cyan & magenta tones to highlight urban midnight aesthetics.',
    client: 'Cyberpunk Apparel Co.',
    role: 'Lead Video Editor & Designer',
    year: '2026',
    embedType: 'youtube',
    embedUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // Smooth lo-fi aesthetic placeholder
    coverImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    videoPreviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-building-at-night-34282-large.mp4',
    aspectRatio: 'video', // 16:9
    featured: true, // Appears on Home page (Selected Works)
    videoForm: 'long',
  },
  {
    id: 'fluidic-sculptures-2025',
    title: 'Fluidic Sculptures & Co.',
    category: 'motion-3d',
    description: 'An abstract exploration of virtual physics, simulating high-viscosity metals suspended in negative gravity. Created with Blender, rendered using Cycles, and composited in After Effects with specialized frequency sounds.',
    client: 'Metropolitan Digital Gallery',
    role: '3D Designer & Sound Architect',
    year: '2025',
    embedType: 'video',
    embedUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fluid-paint-mixing-abstract-background-34346-large.mp4', // Highly aesthetic background dynamic simulation
    coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    videoPreviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fluid-paint-mixing-abstract-background-34346-large.mp4',
    aspectRatio: 'video',
    featured: true, // Appears on Home page (Selected Works)
  },
  {
    id: 'urban-isolation-journal',
    title: 'Silence of Metropolis',
    category: 'photography',
    description: 'A structural visual study exploring the psychological resonance of scale and emptiness in modern high-density architecture. Shot across Tokyo and Seoul over four weeks of solo dawn walks.',
    client: 'Editorial Project',
    role: 'Independent Photographer & Writer',
    year: '2026',
    embedType: 'images',
    embedUrl: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square', // 1:1 format for urban blocks
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true, // Appears on Home page (Selected Works)
  },
  {
    id: 'tokyo-neon-reels',
    title: 'Tokyo Nocturnal Loops',
    category: 'video-editing',
    description: 'A dynamic social cut celebrating Tokyo nightlife, synchronized to an upbeat lo-fi groove. It emphasizes speed ramps, retro camcorder noise overlays, and custom glowing neon text tracks designed to capture vertical attention spans.',
    client: 'Nocturnal Japan Magazine',
    role: 'Video Editor & Colorist',
    year: '2025',
    embedType: 'instagram',
    embedUrl: 'https://www.instagram.com/p/DOk8BN8kacO/', // Placeholder style of Instagram link
    coverImageUrl: 'https://www.instagram.com/p/DOk8BN8kacO/',
    videoPreviewUrl: 'https://www.instagram.com/p/DOk8BN8kacO/',
    aspectRatio: 'vertical', // 9:16 vertical ratio for social reels
    videoForm: 'short',
  },
  {
    id: 'nordic-silence-documentary',
    title: 'Echoes of the North',
    category: 'video-editing',
    description: 'A long-form atmospheric brand documentary exploring Arctic isolation and sustainable design ethos. Features slow, rhythmic pacing, ambient local field-recording soundscapes, and cinematic desaturated pastel grading.',
    client: 'Nordic Travel Board',
    role: 'Documentary Editor',
    year: '2025',
    embedType: 'youtube',
    embedUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // Clean lo-fi aesthetic placeholder
    coverImageUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=1200&q=80',
    videoPreviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cold-stream-in-a-snowy-forest-34133-large.mp4',
    aspectRatio: 'video',
    videoForm: 'long',
  },
  {
    id: 'geometric-monoliths-3d',
    title: 'Geometric Monoliths',
    category: 'motion-3d',
    description: 'An architectural 3D looping installation featuring brutalist concrete monolithic structures interacting with soft natural atmospheric conditions. Rendered utilizing Octane and modeled in Cinema 4D.',
    client: 'Dimension Studio',
    role: 'Creative Director & 3D Artist',
    year: '2026',
    embedType: 'video',
    embedUrl: 'https://assets.mixkit.co/videos/preview/mixkit-white-marble-blocks-sliding-34358-large.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    videoPreviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-white-marble-blocks-sliding-34358-large.mp4',
    aspectRatio: 'video'
  },
  {
    id: 'organic-light-refraction',
    title: 'Organic Light Refractions',
    category: 'photography',
    description: 'A macro photographic exploration capturing how natural light interacts, bends, and decomposes when traveling through custom glass prisms and liquid crystals. Highlighting secondary rainbow color dispersals.',
    client: 'Prism Glass Labs',
    role: 'Creative Photographer',
    year: '2025',
    embedType: 'images',
    embedUrl: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    images: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'creative-shorts-review',
    title: 'Vertical Cinematic Short',
    category: 'video-editing',
    description: 'A high-impact storytelling format optimized for vertical viewing platforms like TikTok. Focuses on cinematic framing, native captioning integration, and rapid scene changes matching sound design triggers.',
    client: 'Self-Initiated',
    role: 'Director, Editor & Motion Designer',
    year: '2026',
    embedType: 'tiktok',
    embedUrl: 'https://www.tiktok.com/@tiktok/video/7108426002933796138', // Sample URL
    coverImageUrl: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1200&q=80',
    videoPreviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-with-led-skateboards-at-night-42407-large.mp4',
    aspectRatio: 'vertical', // 9:16
    videoForm: 'short',
  }
];

export const clientReviews: ClientReview[] = [
  {
    name: 'Oasis South Florida Cigar Lounge',
    role: 'Video Editor',
    company: 'Charlotte Creative',
    comment: 'I am very satisfied with the work of this editor. Communication was clear and fast, and their approach to revisions was professional and solution-oriented. They analyzed the raw footage very well and built the rhythm and story in the right way. The color, pacing, and music synchronization fully matched my expectations. Most importantly, they didn’t just “edit and deliver” — they truly took ownership of the project. The work was delivered on time, and no details were neglected. I would definitely work with them again and highly recommend them to anyone looking for a reliable and professional video editor.'
  },
  {
    name: 'Wedding film of Kristin & Patrick',
    role: 'Video Editor',
    company: 'ACK Wedding',
    comment: 'I worked with this editor on a second project and once again had a very positive experience. They followed the instructions carefully, understood the style I was looking for, and delivered clean, well-paced edits. Communication was smooth throughout the process, and revisions were handled quickly and professionally. The final result was consistent with my expectations and delivered on time. I appreciate their reliability and attention to detail, and I would be happy to work with them again on future projects.'
  },
  {
    name: 'Dream teamtales',
    role: 'Video Editor',
    company: 'Birthday Surprises Video',
    comment: 'Yakin was very quick and very responsive. He made all the changes i requested and was very patient with me. He understood what I was requesting very quickly and the process was easy and pain-free. I would highly recommend working with him! I am very happy with the result :)'
  },
  {
    name: 'Omar Hernande',
    role: 'Motion graphic',
    company: 'DAS Report',
    comment: 'As always, thank you for the services and open to received our request to modify the projects went was need it.'
  },
  {
    name: 'Brian',
    role: 'Video Editor',
    company: 'brianshotwells',
    comment: 'Exactly what I wanted. Great communication, fast delivery. Will use again.'
  },
  {
    name: 'Antonio',
    role: 'Video Editor',
    company: 'Teacher material',
    comment: 'Wonderful experience. The seller went above and beyond to deliver what I needed. Thanks!'
  },
  {
    name: "healvc's",
    role: 'Video Editor',
    company: 'Personal Content',
    comment: 'Literally couldn’t of asked for more, incredible person to work with'
  },
  {
    name: 'Mike',
    role: 'Video Editor',
    company: 'Leadfeeder',
    comment: "Great work. I'm a repeat customer, and I've never been disappointed."
  },
    {
    name: "Joharof's",
    role: 'Video Editor',
    company: 'Prima Villa',
    comment: 'Great working with yakin.'
  },
    {
    name: "jennifer rokasky's",
    role: 'Video Editor',
    company: 'Prince William Education Assiociation',
    comment: 'This was my first experience with fiverr and yakinm was great to work with! I would use them again.'
  }

];
