import React, { useState, useRef, useEffect } from 'react';
import { INSTAGRAM_POSTS } from '../data/products';
import { usePortal } from '../context/PortalContext';
import {
  Instagram,
  Heart,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  MessageCircle,
  Share2,
  Check,
  Music,
  Film,
} from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface InstagramPostItem {
  id: string;
  image: string;
  caption: string;
  likes: string;
  url: string;
  videoUrl?: string;
  audioUrl?: string;
  soundLabel?: string;
  productName?: string;
}

const POSTS_MEDIA_ENRICHMENT: Record<string, { videoUrl: string; audioUrl: string; soundLabel: string; productName: string }> = {
  'post-1': {
    videoUrl: '/assets/videos/reel_flower_bouquet.mp4',
    audioUrl: '/assets/audio/bollywood_romance.mp3',
    soundLabel: 'Bollywood Romance • Acoustic & Bansuri Flute',
    productName: 'Fresh Blooms Flower Bouquets',
  },
  'post-2': {
    videoUrl: '/assets/videos/reel_custom_basket.mp4',
    audioUrl: '/assets/audio/trending_reels_beat.mp3',
    soundLabel: 'Trending Reels Lo-Fi Beat • Studio Vibe',
    productName: 'Build A Gift Basket (You Choose The Vibe)',
  },
  'post-3': {
    videoUrl: '/assets/videos/reel_anniversary.mp4',
    audioUrl: '/assets/audio/turkish_cinematic_strings.mp3',
    soundLabel: 'Turkish / Mediterranean Strings • Soulful',
    productName: 'Anniversary Elegance Rose & Keepsake Hamper',
  },
  'post-4': {
    videoUrl: '/assets/videos/reel_bracelets.mp4',
    audioUrl: '/assets/audio/boutique_acoustic_shimmer.mp3',
    soundLabel: 'Boutique Shimmer • 12-String Acoustic & Chimes',
    productName: 'Designer Bracelets & Boutique Accessories',
  },
  'post-5': {
    videoUrl: '/assets/videos/reel_watch_perfume.mp4',
    audioUrl: '/assets/audio/hollywood_luxury_lounge.mp3',
    soundLabel: 'Hollywood Prestige Luxury Lounge Beat',
    productName: 'Watch & Perfume Luxury Box for Him',
  },
  'post-6': {
    videoUrl: '/assets/videos/reel_packaging.mp4',
    audioUrl: '/assets/audio/aesthetic_asmr_unboxing.mp3',
    soundLabel: 'Aesthetic ASMR Music Box & Velvet Chimes',
    productName: 'Customized Packaging & Magnetic Boxes',
  },
};

export const InstagramSection: React.FC = () => {
  const { siteSettings, socialPages } = usePortal();
  const [selectedPost, setSelectedPost] = useState<InstagramPostItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(0.28);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const posts: InstagramPostItem[] = React.useMemo(() => {
    const fromDb = socialPages.filter((s) => s.entryType === 'instagram_post' && s.isActive);
    if (fromDb.length > 0) {
      return fromDb.map((s, idx) => {
        const fallbackPostKey = `post-${(idx % 6) + 1}`;
        const meta = POSTS_MEDIA_ENRICHMENT[fallbackPostKey] || POSTS_MEDIA_ENRICHMENT['post-1'];
        return {
          id: s.id,
          image: s.imageUrl || '/assets/images/tgg_hero_curated_gifting_1790253103850.jpg',
          caption: s.caption,
          likes: s.likesCount || '1,420',
          url: s.url || siteSettings.instagramUrl,
          videoUrl: meta.videoUrl,
          audioUrl: meta.audioUrl,
          soundLabel: meta.soundLabel,
          productName: meta.productName,
        };
      });
    }

    return INSTAGRAM_POSTS.map((p) => {
      const meta = POSTS_MEDIA_ENRICHMENT[p.id] || POSTS_MEDIA_ENRICHMENT['post-1'];
      return {
        ...p,
        url: siteSettings.instagramUrl,
        videoUrl: meta.videoUrl,
        audioUrl: meta.audioUrl,
        soundLabel: meta.soundLabel,
        productName: meta.productName,
      };
    });
  }, [socialPages, siteSettings.instagramUrl]);

  // Sync video and audio playback
  useEffect(() => {
    if (selectedPost) {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.volume = soundVolume;
        if (isPlaying) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        audioRef.current.volume = soundVolume;
        if (isPlaying && !isMuted) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [selectedPost, isPlaying, isMuted, soundVolume]);

  const handleOpenPreview = (post: InstagramPostItem, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPost(post);
    setIsPlaying(true);
    setIsMuted(false);
  };

  const handleTogglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (videoRef.current) {
      if (nextPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
    if (audioRef.current) {
      if (nextPlaying && !isMuted) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  };

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScrollToReels = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('brand-reels');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = (caption: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(
          `${caption} — The Gift Gallery: ${window.location.href}`
        );
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1500);
    }
  };

  return (
    <section className="py-10 min-[800px]:py-24 bg-[#FBF9F5] border-t border-[#EADBCE]">
      {/* Background audio player */}
      {selectedPost?.audioUrl && (
        <audio
          ref={audioRef}
          src={selectedPost.audioUrl}
          loop
          preload="auto"
        />
      )}

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-7 min-[800px]:mb-12">
          <a
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C59B27] hover:text-[#14382C] transition-colors mb-1.5 min-[800px]:mb-2"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>COMMUNITY &amp; INSPIRATION</span>
          </a>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-2 min-[800px]:mb-3 text-balance">
            Follow The Moments
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-light mb-3">
            Click any post below to preview authentic videos, bouquet crafting &amp; unboxing reels with music.
          </p>
          <a
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-serif font-bold text-[#14382C] hover:text-[#C59B27] transition-colors"
          >
            <span>{siteSettings.instagramHandle}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C59B27]" />
          </a>
        </div>

        {/* Visual Instagram Grid: 6 responsive square cards with interactive modal trigger */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-7 min-[800px]:mb-10">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={(e) => handleOpenPreview(post, e)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#EADBCE] shadow-xs block active:scale-[0.98] transition-all cursor-pointer hover:border-[#C59B27] hover:shadow-md"
            >
              <OptimizedImage
                src={post.image}
                alt="The Gift Gallery moment"
                aspectRatio="aspect-square"
                className="w-full h-full"
                imgClassName="group-hover:scale-105 transition-transform duration-500"
                fallbackTitle={post.caption}
                categoryName="Instagram"
              />

              {/* Corner TGG Hallmark Badge */}
              <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1 rounded-md border border-[#C59B27]/40 shadow-xs opacity-90 group-hover:opacity-100 transition-opacity z-10">
                <img src="/tgg_logo.png" alt="TGG Official" className="w-5 h-auto object-contain" referrerPolicy="no-referrer" />
              </div>

              {/* Play / Reel Badge in top left */}
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-[#DFC066] flex items-center gap-1 z-10">
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>PREVIEW</span>
              </div>

              {/* Mobile Subtle Scrim + Desktop Full Hover Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent min-[800px]:bg-[#14382C]/80 opacity-100 min-[800px]:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 text-white z-20">
                <p className="text-[10px] sm:text-[11px] line-clamp-1 sm:line-clamp-2 mb-1 font-medium leading-tight">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#DFC066] tabular-nums">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-rose-400" /> {post.likes}
                  </span>
                  <span className="underline text-[10px] flex items-center gap-0.5">
                    <span>Watch</span>
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons: Instagram Profile + Watch Commercials & Reels */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 shadow-xs transition-all duration-200"
          >
            <Instagram className="w-4 h-4 text-[#C59B27]" />
            <span>Visit Instagram Profile</span>
          </a>

          <a
            href="#brand-reels"
            onClick={handleScrollToReels}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#14382C] hover:bg-[#0D261E] border border-[#C59B27]/50 shadow-xs transition-all duration-200"
          >
            <Film className="w-3.5 h-3.5 text-[#DFC066]" />
            <span>Watch Full Cinema Showcase</span>
          </a>
        </div>

      </div>

      {/* ========================================================
          INTERACTIVE INSTAGRAM REEL / POST PREVIEW MODAL
         ======================================================== */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedPost(null)} />

          <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#0D261E] border border-[#C59B27]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">
            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-black/90 flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Media Column */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[420px] overflow-hidden">
              {selectedPost.videoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={selectedPost.videoUrl}
                    poster={selectedPost.image}
                    playsInline
                    loop
                    autoPlay
                    muted={isMuted}
                    className="max-h-[460px] w-full object-contain mx-auto"
                  />

                  {/* Play / Pause Toggle Center Button */}
                  <button
                    onClick={handleTogglePlay}
                    className={`absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#DFC066]/90 text-[#0D261E] hover:bg-[#DFC066] flex items-center justify-center shadow-xl transition-all cursor-pointer border-2 border-white/80 ${
                      isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
                  </button>

                  {/* Floating Sound Toggle with Volume & Animated Equalizer */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] flex items-center gap-2 border border-white/20 shadow-md">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-[#DFC066] transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#DFC066]" />}
                      <span className="font-mono">{isMuted ? 'Muted' : `${Math.round(soundVolume * 100)}%`}</span>
                    </button>
                    {!isMuted && isPlaying && (
                      <div className="flex items-end gap-0.5 h-2.5">
                        <span className="w-0.5 h-1.5 bg-[#DFC066] animate-pulse" />
                        <span className="w-0.5 h-2.5 bg-[#DFC066] animate-pulse delay-75" />
                        <span className="w-0.5 h-1 bg-[#DFC066] animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={selectedPost.image}
                  alt={selectedPost.caption}
                  className="max-h-[460px] w-full object-contain"
                />
              )}
            </div>

            {/* Right Details Column */}
            <div className="md:w-80 p-5 bg-[#0D261E] text-white flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#C59B27]/30">
              <div>
                <div className="flex items-center justify-between text-xs text-[#DFC066] font-semibold mb-3">
                  <span className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram Reel</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">{selectedPost.likes} Likes</span>
                </div>

                <p className="text-xs sm:text-sm text-[#D4C3B3] leading-relaxed mb-4">
                  {selectedPost.caption}
                </p>

                {/* Soundtrack Tag with Volume Slider */}
                {selectedPost.soundLabel && (
                  <div className="p-3 rounded-2xl bg-[#14382C] border border-[#C59B27]/30 mb-4 text-xs space-y-2">
                    <div className="text-[10px] text-[#DFC066] font-semibold uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        <span>Harmonic Audio Track</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D261E] text-[#DFC066]">
                        Soft &amp; Decent
                      </span>
                    </div>
                    <div className="text-[11px] text-white font-medium">
                      🎵 {selectedPost.soundLabel}
                    </div>

                    {/* Master Volume Slider */}
                    <div className="pt-2 border-t border-[#1D4E3E]/60 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 shrink-0">Vol:</span>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.01"
                        value={isMuted ? 0 : soundVolume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSoundVolume(val);
                          if (isMuted && val > 0) setIsMuted(false);
                        }}
                        className="w-full h-1 bg-[#0D261E] rounded-lg appearance-none cursor-pointer accent-[#DFC066]"
                      />
                      <span className="text-[10px] font-mono text-[#DFC066] shrink-0">
                        {isMuted ? '0%' : `${Math.round(soundVolume * 100)}%`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#1D4E3E] space-y-2">
                <button
                  onClick={() => {
                    const msg = `Hi The Gift Gallery! I saw your reel "${selectedPost.caption}" and would love to place an order.`;
                    window.open(`${siteSettings.whatsappUrl}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleLike(selectedPost.id)}
                    className="text-slate-300 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[selectedPost.id] ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{likedPosts[selectedPost.id] ? 'Liked!' : 'Like Reel'}</span>
                  </button>

                  <button
                    onClick={() => handleShare(selectedPost.caption)}
                    className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  <a
                    href={selectedPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DFC066] hover:underline flex items-center gap-1"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
