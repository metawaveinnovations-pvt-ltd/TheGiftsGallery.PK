import React, { useState, useEffect, useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { Logo } from './Logo';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Share2,
  MessageCircle,
  Sparkles,
  Film,
  Video,
  Eye,
  Clock,
  ArrowRight,
  X,
  Check,
  Instagram,
  Music,
  Sliders,
  Radio,
  RotateCcw,
} from 'lucide-react';

export interface SoundTheme {
  id: string;
  name: string;
  genre: 'bollywood' | 'trending' | 'turkish' | 'hollywood' | 'asmr' | 'boutique';
  genreLabel: string;
  audioUrl: string;
  tagline: string;
  moodTag: string;
  bpm: string;
  key: string;
  instrumentPhrase: string;
  matchedProduct: string;
}

export const SOUND_THEMES: SoundTheme[] = [
  {
    id: 'bollywood_romance',
    name: 'Bollywood Romance • Acoustic & Bansuri',
    genre: 'bollywood',
    genreLabel: 'Bollywood Romance',
    audioUrl: '/assets/audio/bollywood_romance.mp3',
    tagline: 'Soulful acoustic guitar & singing Bansuri flute inspired by Raag Yaman love melodies',
    moodTag: '🌹 Romantic & Soulful',
    bpm: '85 BPM',
    key: 'D Major',
    instrumentPhrase: 'Bansuri Flute Legato Hook & Plucked Acoustic Guitar',
    matchedProduct: 'Fresh Blooms Flower Bouquets',
  },
  {
    id: 'trending_reels_beat',
    name: 'Trending Reels Lo-Fi Beat',
    genre: 'trending',
    genreLabel: 'Trending Lo-Fi',
    audioUrl: '/assets/audio/trending_reels_beat.mp3',
    tagline: 'Neo-Soul Rhodes chords, gentle vinyl finger snaps and warm rhythmic bass',
    moodTag: '⚡ Aesthetic & Chill',
    bpm: '78 BPM',
    key: 'C Major / Am',
    instrumentPhrase: 'Neo-Soul Rhodes 7th Chords & Gentle Finger Snaps',
    matchedProduct: 'Build A Gift Basket (You Choose The Vibe)',
  },
  {
    id: 'turkish_cinematic_strings',
    name: 'Turkish / Mediterranean Strings',
    genre: 'turkish',
    genreLabel: 'Turkish Strings',
    audioUrl: '/assets/audio/turkish_cinematic_strings.mp3',
    tagline: 'Emotional harmonic minor strings, Turkish Oud plucks, and cinematic cello swell',
    moodTag: '🎻 Soulful & Grand',
    bpm: '80 BPM',
    key: 'A Minor / Dm',
    instrumentPhrase: 'Emotive Cello Swell & Turkish Oud Melodic Motif',
    matchedProduct: 'Midnight Anniversary Surprise Delivery',
  },
  {
    id: 'hollywood_luxury_lounge',
    name: 'Hollywood Prestige Luxury Lounge',
    genre: 'hollywood',
    genreLabel: 'Hollywood Luxury',
    audioUrl: '/assets/audio/hollywood_luxury_lounge.mp3',
    tagline: 'Deep sophisticated synth bass, crisp velvet rimshot, and glossy lounge keys',
    moodTag: '⌚ Prestige & Suave',
    bpm: '92 BPM',
    key: 'Eb Minor',
    instrumentPhrase: 'Suave Velvet Synth Bass & Prestige Lounge Keys',
    matchedProduct: 'Gentleman’s Watch & Fragrance Box',
  },
  {
    id: 'aesthetic_asmr_unboxing',
    name: 'Aesthetic ASMR Music Box',
    genre: 'asmr',
    genreLabel: 'Aesthetic ASMR',
    audioUrl: '/assets/audio/aesthetic_asmr_unboxing.mp3',
    tagline: 'Delicate celestial music box bells and velvet soft ambiance for satin packaging',
    moodTag: '🎀 Soft & Satisfying',
    bpm: '76 BPM',
    key: 'E Major',
    instrumentPhrase: 'Celestial Music Box Bells & Satin Velvet Ambiance',
    matchedProduct: 'Custom Magnetic Packaging & Gold Foil Ribbon',
  },
  {
    id: 'boutique_acoustic_shimmer',
    name: 'Boutique Shimmer • Acoustic Plucks & Chimes',
    genre: 'boutique',
    genreLabel: 'Boutique Shimmer',
    audioUrl: '/assets/audio/boutique_acoustic_shimmer.mp3',
    tagline: 'Delicate 12-string guitar arpeggio and crystalline chimes for fine jewelry & bracelets',
    moodTag: '✨ Sparkling & Pure',
    bpm: '88 BPM',
    key: 'G Major',
    instrumentPhrase: '12-String Acoustic Arpeggios & Crystalline Chimes',
    matchedProduct: 'Permanent Bracelets & Boutique Jewelry',
  },
];

export interface CommercialFilm {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  views: string;
  thumbnail: string;
  videoUrl: string;
  badge: string;
  highlights: string[];
  productId?: string;
  storyDescription: string;
  defaultSoundThemeId: string;
}

export interface SocialReel {
  id: string;
  title: string;
  caption: string;
  category: string;
  views: string;
  likes: number;
  thumbnail: string;
  videoUrl: string;
  soundLabel: string;
  productId?: string;
  whatsappMessage: string;
  defaultSoundThemeId: string;
}

const COMMERCIAL_FILMS: CommercialFilm[] = [
  {
    id: 'film-artisan-bouquet',
    title: 'Fresh Blooms, Lasting Smiles • Flower Bouquets',
    subtitle: 'Daily cut garden roses wrapped in signature botanical emerald paper with gold-foil trim & satin bow.',
    category: 'Fresh Flowers',
    duration: '0:29',
    views: '36.8k',
    thumbnail: '/assets/images/tgg_flower_bouquet_roses_1791323354001.jpg',
    videoUrl: '/assets/videos/film_flower_bouquet.mp4',
    badge: 'NEW ARRIVAL • FROM RS. 350',
    highlights: ['Cut Fresh Daily', 'Dark Emerald Wrap', 'Gold Foil Trim', 'Custom Sentiment Card'],
    productId: 'fresh-blooms-bouquet',
    storyDescription:
      'Watch our master florists hand-arrange velvety red roses, white lilies, and delicate baby breath. Finished with our signature dark green botanical wrap and gold hallmark badge.',
    defaultSoundThemeId: 'bollywood_romance',
  },
  {
    id: 'film-luxury-unboxing',
    title: 'The Art of Giving • Anniversary Romance Hamper',
    subtitle: 'Unboxing our flagship emerald velvet magnetic box with silk eternity roses, Lindt Lindor & custom vows.',
    category: 'Anniversary Gifts',
    duration: '0:38',
    views: '48.2k',
    thumbnail: '/assets/images/tgg_hero_floral_luxury_1791323375875.jpg',
    videoUrl: '/assets/videos/film_anniversary_romance.mp4',
    badge: 'COMMERCIAL FILM • LUXURY EDIT',
    highlights: ['Silk Eternity Roses', 'Lindt Lindor Chocolates', 'Velvet Magnetic Box', 'Midnight Delivery'],
    productId: 'anniversary-rose-luxe',
    storyDescription:
      'Experience the magic of an unboxing that leaves memories forever. Designed for couples celebrating timeless love stories across Pakistan.',
    defaultSoundThemeId: 'turkish_cinematic_strings',
  },
  {
    id: 'film-behind-the-craft',
    title: 'Behind The Craft • Curating Bespoke Gift Baskets',
    subtitle: 'You choose the vibe, we create the basket. Wicker weaving, luxury fragrance placement & custom notes.',
    category: 'Customized Gift Baskets',
    duration: '0:45',
    views: '52.4k',
    thumbnail: '/assets/images/tgg_custom_gift_basket_1791323363511.jpg',
    videoUrl: '/assets/videos/film_custom_basket.mp4',
    badge: 'ARTISAN PROCESS • BEHIND THE SCENES',
    highlights: ['Bespoke Customization', 'Imported Gourmet Treats', 'Designer Perfumes', 'Pristine Packaging'],
    productId: 'build-a-gift-basket',
    storyDescription:
      'Step inside our gifting atelier where every basket is carefully assembled with hand-selected items, cushioned with botanical tissue, and sealed with our signature wax medallion.',
    defaultSoundThemeId: 'trending_reels_beat',
  },
];

const SOCIAL_REELS: SocialReel[] = [
  {
    id: 'reel-1',
    title: 'Fresh Blooms Bouquet Unboxing (Starting Rs. 350!) 🌹',
    caption: 'Because every moment deserves fresh flowers. Small bouquet for Rs. 350 & Medium for Rs. 500! 🌿✨ #TheGiftGallery #FreshBlooms #RosesPK',
    category: 'Fresh Flowers',
    views: '18.4k',
    likes: 1420,
    thumbnail: '/assets/images/tgg_flower_bouquet_roses_1791323354001.jpg',
    videoUrl: '/assets/videos/reel_flower_bouquet.mp4',
    soundLabel: 'Bollywood Romance • Acoustic & Bansuri',
    productId: 'fresh-blooms-bouquet',
    whatsappMessage: 'Hi The Gift Gallery! I saw your Fresh Blooms reel and want to order the flower bouquet for Rs. 350/500.',
    defaultSoundThemeId: 'bollywood_romance',
  },
  {
    id: 'reel-2',
    title: 'Build A Gift Basket With Me 🧺🍫',
    caption: 'You choose the vibe, we create the basket. Lindt Lindor, Chanel fragrance & ceramic mug! ✨ #GiftBasket #CustomHamper #Pakistan',
    category: 'Customized Baskets',
    views: '27.1k',
    likes: 2380,
    thumbnail: '/assets/images/tgg_custom_gift_basket_1791323363511.jpg',
    videoUrl: '/assets/videos/reel_custom_basket.mp4',
    soundLabel: 'Trending Reels Lo-Fi Beat • Studio Vibe',
    productId: 'build-a-gift-basket',
    whatsappMessage: 'Hi The Gift Gallery! I saw your Build A Gift Basket reel and want to customize one with chocolates and fragrances.',
    defaultSoundThemeId: 'trending_reels_beat',
  },
  {
    id: 'reel-3',
    title: 'Gentleman’s Prestige Watch & Fragrance Box ⌚🖤',
    caption: 'Unboxing our top-selling gift set for him. Chronograph watch & prestige perfume in matte black. #GiftsForHim #WatchesPK',
    category: 'Special Gifts',
    views: '34.5k',
    likes: 3110,
    thumbnail: '/assets/images/tgg_luxury_watch_perfume_box_1790253135569.jpg',
    videoUrl: '/assets/videos/reel_watch_perfume.mp4',
    soundLabel: 'Hollywood Prestige Luxury Lounge Beat',
    productId: 'watch-perfume',
    whatsappMessage: 'Hi The Gift Gallery! I saw your Gentleman’s Prestige Watch & Fragrance reel and want to order this gift box.',
    defaultSoundThemeId: 'hollywood_luxury_lounge',
  },
  {
    id: 'reel-4',
    title: 'Permanent Bracelets & Boutique Jewelry ✨💍',
    caption: 'Layered charm bracelets and anti-tarnish boutique accessories packaged with love in velvet pouches. #Bracelets #BoutiquePK',
    category: 'Accessories',
    views: '19.3k',
    likes: 1640,
    thumbnail: '/assets/images/tgg_accessories_jewellery_1791323387866.jpg',
    videoUrl: '/assets/videos/reel_bracelets.mp4',
    soundLabel: 'Boutique Shimmer • Acoustic Plucks & Chimes',
    productId: 'bracelets-boutique',
    whatsappMessage: 'Hi The Gift Gallery! I saw your Permanent Bracelets & Boutique Jewelry reel and would love to place an order.',
    defaultSoundThemeId: 'boutique_acoustic_shimmer',
  },
  {
    id: 'reel-5',
    title: 'Midnight Anniversary Surprise Delivery 🌙❤️',
    caption: 'Delivering at exactly 12:00 AM in Hyderabad! Their reaction was priceless 🥹🌹 #MidnightDelivery #AnniversarySurprise',
    category: 'Anniversaries',
    views: '42.9k',
    likes: 4200,
    thumbnail: '/assets/images/tgg_hero_floral_luxury_1791323375875.jpg',
    videoUrl: '/assets/videos/reel_anniversary.mp4',
    soundLabel: 'Turkish / Mediterranean Strings • Soulful',
    productId: 'anniversary-rose-luxe',
    whatsappMessage: 'Hi The Gift Gallery! I want to arrange a Midnight Surprise delivery for an upcoming anniversary.',
    defaultSoundThemeId: 'turkish_cinematic_strings',
  },
  {
    id: 'reel-6',
    title: 'Custom Magnetic Packaging & Gold Foil Ribbon 🎀📦',
    caption: 'Luxury is in the details. Magnetic closure, velvet foam cushioning, and hot-stamped gold foil. #LuxuryPackaging #CustomBoxes',
    category: 'Packaging',
    views: '22.6k',
    likes: 1890,
    thumbnail: '/assets/images/tgg_packaging_boxes_1791323401254.jpg',
    videoUrl: '/assets/videos/reel_packaging.mp4',
    soundLabel: 'Aesthetic ASMR Music Box & Velvet Chimes',
    productId: 'signature-packaging',
    whatsappMessage: 'Hi The Gift Gallery! I am interested in your Customized Packaging & Magnetic Boxes for gifting.',
    defaultSoundThemeId: 'aesthetic_asmr_unboxing',
  },
];

interface BrandReelsShowcaseProps {
  onSelectProductForOrder?: (productId: string) => void;
}

export const BrandReelsShowcase: React.FC<BrandReelsShowcaseProps> = ({ onSelectProductForOrder }) => {
  const { siteSettings } = usePortal();
  
  // Default to 'all' so ALL 9 media cards are immediately visible!
  const [activeTab, setActiveTab] = useState<'all' | 'films' | 'reels'>('all');
  
  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'film' | 'reel';
    film?: CommercialFilm;
    reel?: SocialReel;
  } | null>(null);

  // Playback & Studio Sound state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false); // Unmuted soft sound by default on user click!
  const [soundVolume, setSoundVolume] = useState<number>(0.28); // Gentle, decent, non-irritating 28% (-11 dB)
  const [audioTuneMode, setAudioTuneMode] = useState<'soft' | 'phrase' | 'lofi' | 'cinema'>('soft');
  const [isFastBeat, setIsFastBeat] = useState<boolean>(false);
  const [showStudioTuning, setShowStudioTuning] = useState<boolean>(true);
  const [activeSoundThemeId, setActiveSoundThemeId] = useState<string>('bollywood_romance');
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [likedReelIds, setLikedReelIds] = useState<Record<string, boolean>>({});
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTheme = SOUND_THEMES.find((s) => s.id === activeSoundThemeId) || SOUND_THEMES[0];

  // Sync video play/pause with modal state
  useEffect(() => {
    if (activeMediaModal) {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.volume = soundVolume;
        if (isPlaying) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }

      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        audioRef.current.volume = soundVolume;
        if (isPlaying && !isMuted) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, soundVolume, activeMediaModal, activeSoundThemeId]);

  const handleOpenFilm = (film: CommercialFilm) => {
    setActiveSoundThemeId(film.defaultSoundThemeId || 'bollywood_romance');
    setActiveMediaModal({ type: 'film', film });
    setIsPlaying(true);
    setIsMuted(false);
    setPlaybackProgress(0);
  };

  const handleOpenReel = (reel: SocialReel) => {
    setActiveSoundThemeId(reel.defaultSoundThemeId || 'bollywood_romance');
    setActiveMediaModal({ type: 'reel', reel });
    setIsPlaying(true);
    setIsMuted(false);
    setPlaybackProgress(0);
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
    setLikedReelIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
    setPlaybackProgress(percent);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (percent / 100) * videoRef.current.duration;
    }
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
    }
  };

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(
          `${title} — Experience luxury gifting at The Gift Gallery: ${window.location.href}`
        );
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleOrderWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`${siteSettings.whatsappUrl}?text=${encoded}`, '_blank');
  };

  return (
    <section id="brand-reels" className="py-12 min-[800px]:py-24 bg-[#14382C] text-[#FBF9F5] relative overflow-hidden border-y border-[#C59B27]/30">
      {/* Background ambient audio player for synchronization */}
      <audio
        ref={audioRef}
        src={currentTheme.audioUrl}
        loop
        preload="auto"
      />

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#1D4E3E]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Luxury Brand Kicker */}
        <div className="text-center max-w-3xl mx-auto mb-8 min-[800px]:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D4E3E] border border-[#C59B27]/40 text-[#DFC066] text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
            <Film className="w-3.5 h-3.5" />
            <span>CINEMATIC FILMS &amp; TRENDING REELS WITH SOUND</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-3">
            Crafted in Motion • Watch The Art of Gifting
          </h2>
          <p className="text-xs sm:text-base text-[#D4C3B3] font-light max-w-2xl mx-auto leading-relaxed">
            Garden-fresh rose bouquets, midnight velvet hampers, and bespoke gift baskets with authentic audio soundtracks: Bollywood romance, Turkish strings, Hollywood luxury &amp; trending lo-fi beats.
          </p>

          {/* Tab Switcher: All (9) vs Commercial Films (3) vs Trending Reels (6) */}
          <div className="mt-6 inline-flex p-1 rounded-full bg-[#0D261E] border border-[#C59B27]/30 shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#DFC066] text-[#0D261E] shadow-sm font-bold'
                  : 'text-[#D4C3B3] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Showcase (9)</span>
            </button>
            <button
              onClick={() => setActiveTab('films')}
              className={`min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'films'
                  ? 'bg-[#DFC066] text-[#0D261E] shadow-sm font-bold'
                  : 'text-[#D4C3B3] hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Commercial Films (3)</span>
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reels'
                  ? 'bg-[#DFC066] text-[#0D261E] shadow-sm font-bold'
                  : 'text-[#D4C3B3] hover:text-white'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Trending Reels (6)</span>
            </button>
          </div>
        </div>

        {/* 1. Commercial Films Section (16:9 Cinematic Video Cards) */}
        {(activeTab === 'all' || activeTab === 'films') && (
          <div className="mb-12">
            {activeTab === 'all' && (
              <div className="flex items-center justify-between mb-4 border-b border-[#1D4E3E] pb-2">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#DFC066]" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                    Featured Commercial Films (3)
                  </h3>
                </div>
                <span className="text-xs text-[#DFC066] font-medium hidden sm:inline">
                  Click to play with light sound &amp; interactive unboxing
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {COMMERCIAL_FILMS.map((film) => (
                <div
                  key={film.id}
                  onClick={() => handleOpenFilm(film)}
                  className="group cursor-pointer bg-[#0D261E]/90 rounded-2xl overflow-hidden border border-[#C59B27]/30 hover:border-[#DFC066] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between"
                >
                  {/* Visual Video Stream with Underlaid Poster for Reliable Preview */}
                  <div className="relative aspect-video overflow-hidden bg-black/60">
                    {/* Underlying fallback image: Guaranteed instant preview */}
                    <img
                      src={film.thumbnail}
                      alt={film.title}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Autoplaying muted video loop with smooth opacity */}
                    <video
                      src={film.videoUrl}
                      poster={film.thumbnail}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="auto"
                      className="w-full h-full object-cover relative z-1 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none z-2" />

                    {/* Corner Badge */}
                    <div className="absolute top-3 left-3 bg-[#0D261E]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#C59B27]/50 text-[10px] font-bold tracking-wider text-[#DFC066] uppercase pointer-events-none z-3">
                      {film.badge}
                    </div>

                    {/* Sound Badge */}
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#DFC066] flex items-center gap-1 pointer-events-none z-3">
                      <Music className="w-3 h-3 text-[#DFC066]" />
                      <span>Sound Included</span>
                    </div>

                    {/* Centered Pulse Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-3">
                      <div className="w-13 h-13 rounded-full bg-[#DFC066]/90 text-[#0D261E] group-hover:bg-[#DFC066] group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-xl border-2 border-white/60">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom View Counter */}
                    <div className="absolute bottom-2.5 left-3 text-[11px] text-slate-300 flex items-center gap-1.5 font-medium pointer-events-none z-3">
                      <Eye className="w-3 h-3 text-[#DFC066]" />
                      <span>{film.views} views</span>
                      <span className="text-slate-400">· {film.duration}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-[#DFC066] transition-colors leading-snug mb-1.5 line-clamp-1">
                        {film.title}
                      </h4>
                      <p className="text-xs text-[#D4C3B3] line-clamp-2 font-light leading-relaxed mb-3">
                        {film.subtitle}
                      </p>

                      {/* Highlight Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {film.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1D4E3E] text-[#EADBCE] border border-[#C59B27]/20"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-[#1D4E3E] flex items-center justify-between text-xs font-semibold text-[#DFC066]">
                      <span className="flex items-center gap-1.5">
                        <Music className="w-3 h-3 text-[#DFC066]" />
                        <span>Play Film With Sound</span>
                      </span>
                      <span className="text-[11px] text-white/60 group-hover:text-white transition-colors">
                        Interactive →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Trending Reels Section (9:16 Vertical Smartphone Reels) */}
        {(activeTab === 'all' || activeTab === 'reels') && (
          <div>
            {activeTab === 'all' && (
              <div className="flex items-center justify-between mb-4 border-b border-[#1D4E3E] pb-2">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#DFC066]" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                    Trending Mobile Reels &amp; Unboxings (6)
                  </h3>
                </div>
                <span className="text-xs text-[#DFC066] font-medium hidden sm:inline">
                  Bollywood, Trending &amp; ASMR audio
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {SOCIAL_REELS.map((reel) => {
                const isLiked = !!likedReelIds[reel.id];
                const likesCount = isLiked ? reel.likes + 1 : reel.likes;
                return (
                  <div
                    key={reel.id}
                    onClick={() => handleOpenReel(reel)}
                    className="group cursor-pointer bg-[#0D261E] rounded-2xl overflow-hidden border border-[#C59B27]/30 hover:border-[#DFC066] transition-all duration-300 hover:-translate-y-1 shadow-md relative flex flex-col aspect-[9/16]"
                  >
                    {/* Underlying fallback image: Guaranteed instant preview */}
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Vertical Video Stream */}
                    <video
                      src={reel.videoUrl}
                      poster={reel.thumbnail}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="auto"
                      className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-700 z-1"
                    />

                    {/* Gradient Scrim for readable overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 group-hover:from-black/95 transition-all pointer-events-none z-2" />

                    {/* Top Bar: TGG Logo & Views */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-3 pointer-events-none">
                      <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[#DFC066] flex items-center gap-1">
                        <Music className="w-2.5 h-2.5" />
                        REEL
                      </span>
                      <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-white/90">
                        {reel.views}
                      </span>
                    </div>

                    {/* Center Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/60 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-[#DFC066] group-hover:text-[#0D261E] transition-all">
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Reel Caption & Engagement Bar */}
                    <div className="absolute bottom-0 inset-x-0 p-3 z-3 flex flex-col justify-end">
                      <p className="text-[11px] font-medium text-white line-clamp-2 leading-tight mb-2 group-hover:text-[#DFC066] transition-colors">
                        {reel.title}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-300">
                        <button
                          onClick={(e) => handleToggleLike(reel.id, e)}
                          className={`flex items-center gap-1 transition-colors ${
                            isLiked ? 'text-red-400 font-bold' : 'hover:text-red-400'
                          }`}
                          title="Like Reel"
                        >
                          <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{likesCount}</span>
                        </button>

                        <span className="text-[9px] text-[#DFC066] underline flex items-center gap-0.5">
                          <span>Watch Reel</span>
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Brand Guarantee Bar */}
        <div className="mt-10 pt-8 border-t border-[#1D4E3E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D4C3B3]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DFC066]" />
            <span>All videos, reels, and photos are authentic creations crafted at The Gift Gallery studio.</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1D4E3E] text-[#DFC066] hover:bg-[#DFC066] hover:text-[#0D261E] font-semibold transition-all border border-[#C59B27]/40 shadow-xs"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Watch More on {siteSettings.instagramHandle}</span>
            </a>
          </div>
        </div>

      </div>

      {/* ========================================================
          FULL-SCREEN INTERACTIVE CINEMATIC VIDEO & REEL MODAL
         ======================================================== */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          {/* Backdrop Click to Close */}
          <div
            className="absolute inset-0"
            onClick={() => setActiveMediaModal(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl max-h-[94vh] bg-[#0D261E] border border-[#C59B27]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row z-10">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/70 text-white hover:bg-black/90 flex items-center justify-center border border-white/20 transition-all cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Interactive HTML5 Video Player Display */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[340px] sm:min-h-[480px] overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={activeMediaModal.film?.videoUrl || activeMediaModal.reel?.videoUrl}
                  poster={activeMediaModal.film?.thumbnail || activeMediaModal.reel?.thumbnail}
                  playsInline
                  loop
                  autoPlay
                  muted={isMuted}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration && !isNaN(v.duration)) {
                      setPlaybackProgress((v.currentTime / v.duration) * 100);
                    }
                  }}
                  className="max-h-[500px] w-full object-contain mx-auto"
                />

                {/* Animated luxury ambient lighting sheen overlay during play */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#C59B27]/15 via-transparent to-[#14382C]/30 animate-pulse pointer-events-none" />
                )}

                {/* Official Hallmark Stamp watermark in top-left */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C59B27]/40 pointer-events-none">
                  <Logo variant="mark" size={24} />
                  <span className="text-[11px] font-serif font-bold text-[#DFC066]">
                    THE GIFT GALLERY
                  </span>
                </div>

                {/* Center Play / Pause Indicator */}
                <button
                  onClick={handleTogglePlay}
                  className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#DFC066]/90 text-[#0D261E] hover:bg-[#DFC066] flex items-center justify-center shadow-2xl transition-all cursor-pointer border-2 border-white/80 active:scale-95 ${
                    isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                  }`}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Video Player Floating Bottom Control Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 flex flex-col gap-2">
                {/* Progress Timeline Scrubber */}
                <div
                  onClick={handleSeek}
                  className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer relative group"
                >
                  <div
                    className="h-full bg-[#DFC066] transition-all duration-100"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlay}
                      className="text-white hover:text-[#DFC066] transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={handleToggleMute}
                      className="text-white hover:text-[#DFC066] transition-colors flex items-center gap-1.5 cursor-pointer"
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#DFC066]" />
                      )}
                      <span className="text-[10px] font-mono">
                        {isMuted ? 'Muted' : `${Math.round(soundVolume * 100)}% Sound`}
                      </span>
                    </button>

                    {/* Equalizer animation when playing with sound */}
                    {isPlaying && !isMuted && (
                      <div className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 h-2 bg-[#DFC066] animate-pulse" />
                        <span className="w-0.5 h-3 bg-[#DFC066] animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-[#DFC066] animate-pulse delay-150" />
                        <span className="w-0.5 h-2.5 bg-[#DFC066] animate-pulse delay-100" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-300">
                      {Math.floor((playbackProgress / 100) * 4)}s / 4s
                    </span>

                    <button
                      onClick={(e) =>
                        handleShare(
                          activeMediaModal.film?.title || activeMediaModal.reel?.title || 'TGG',
                          e
                        )
                      }
                      className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
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
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Information, Audio Sound Chooser & Direct Actions */}
            <div className="lg:w-96 p-5 sm:p-6 bg-[#0D261E] text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#C59B27]/30 overflow-y-auto max-h-[94vh]">
              <div>
                {/* Kicker & Category */}
                <div className="flex items-center justify-between text-xs text-[#DFC066] font-semibold mb-2">
                  <span className="uppercase tracking-wider">
                    {activeMediaModal.film?.category || activeMediaModal.reel?.category || 'Curated'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {activeMediaModal.film?.views || activeMediaModal.reel?.views} views
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-white mb-2 leading-snug">
                  {activeMediaModal.film?.title || activeMediaModal.reel?.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#D4C3B3] font-light leading-relaxed mb-4">
                  {activeMediaModal.film?.storyDescription ||
                    activeMediaModal.reel?.caption ||
                    activeMediaModal.film?.subtitle}
                </p>

                {/* ========================================================
                    SMART STUDIO AUDIO ENGINE & ORIGINAL PHRASE TUNER
                   ======================================================== */}
                <div className="p-4 rounded-2xl bg-[#14382C] border border-[#C59B27]/40 mb-4 space-y-3 shadow-lg">
                  {/* Header with Live Dancing Equalizer */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#0D261E] border border-[#C59B27]/40 flex items-center justify-center text-[#DFC066]">
                        <Music className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-[#DFC066] block leading-tight">
                          Studio Audio &amp; Sound Phrases
                        </span>
                        <span className="text-[10px] text-slate-300 font-light">
                          High-Fidelity Harmonic Acoustic Engine
                        </span>
                      </div>
                    </div>

                    {/* Live Dancing Equalizer Spectrum */}
                    <div className="flex items-end gap-1 h-5 px-2 py-1 rounded bg-[#0D261E] border border-[#C59B27]/25">
                      {[
                        { h: 'h-2', a: 'animate-pulse' },
                        { h: 'h-4', a: 'animate-pulse delay-75' },
                        { h: 'h-3', a: 'animate-pulse delay-150' },
                        { h: 'h-5', a: 'animate-pulse delay-100' },
                        { h: 'h-2.5', a: 'animate-pulse delay-200' },
                        { h: 'h-4.5', a: 'animate-pulse delay-300' },
                        { h: 'h-3.5', a: 'animate-pulse delay-75' },
                      ].map((bar, bi) => (
                        <span
                          key={bi}
                          className={`w-1 rounded-full ${
                            isPlaying && !isMuted ? `${bar.h} ${bar.a} bg-[#DFC066]` : 'h-1.5 bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Matched Musical Phrase Display */}
                  <div className="p-3 rounded-xl bg-[#0D261E]/90 border border-[#C59B27]/30 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-white truncate">
                        {currentTheme.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14382C] text-[#DFC066] font-mono font-bold shrink-0">
                        {currentTheme.key} · {currentTheme.bpm}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#DFC066] font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#DFC066] shrink-0" />
                      <span className="truncate">Phrase: {currentTheme.instrumentPhrase}</span>
                    </div>

                    <p className="text-[10px] text-[#D4C3B3] font-light italic leading-snug">
                      {currentTheme.tagline}
                    </p>

                    <div className="pt-1.5 border-t border-[#1D4E3E] flex items-center justify-between text-[10px] text-slate-300">
                      <span>Matched Product: <strong className="text-white">{currentTheme.matchedProduct}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play().catch(() => {});
                          }
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().catch(() => {});
                          }
                          setIsPlaying(true);
                          setIsMuted(false);
                        }}
                        className="text-[#DFC066] hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        title="Replay from intro hook"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Replay Phrase</span>
                      </button>
                    </div>
                  </div>

                  {/* Sound Presets (Anti-Fatigue / Phrase Hook / Lo-Fi / Cinema) */}
                  <div>
                    <div className="text-[10px] text-[#DFC066] font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Sound Setting Preset:</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {audioTuneMode === 'soft' && '🌸 Soft Anti-Fatigue'}
                        {audioTuneMode === 'phrase' && '🎵 Original Phrase'}
                        {audioTuneMode === 'lofi' && '☕ Lo-Fi Warmth'}
                        {audioTuneMode === 'cinema' && '🎻 Cinematic Prestige'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAudioTuneMode('soft');
                          setSoundVolume(0.25);
                          setIsMuted(false);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          audioTuneMode === 'soft'
                            ? 'bg-[#DFC066] text-[#0D261E] font-bold shadow-xs'
                            : 'bg-[#0D261E] text-slate-300 hover:text-white border border-[#C59B27]/20'
                        }`}
                      >
                        <span>🌸</span>
                        <span className="truncate">Soft Instrumental (25%)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAudioTuneMode('phrase');
                          setSoundVolume(0.35);
                          setIsMuted(false);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          audioTuneMode === 'phrase'
                            ? 'bg-[#DFC066] text-[#0D261E] font-bold shadow-xs'
                            : 'bg-[#0D261E] text-slate-300 hover:text-white border border-[#C59B27]/20'
                        }`}
                      >
                        <span>🎵</span>
                        <span className="truncate">Original Phrase Hook (35%)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAudioTuneMode('lofi');
                          setSoundVolume(0.28);
                          setIsMuted(false);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          audioTuneMode === 'lofi'
                            ? 'bg-[#DFC066] text-[#0D261E] font-bold shadow-xs'
                            : 'bg-[#0D261E] text-slate-300 hover:text-white border border-[#C59B27]/20'
                        }`}
                      >
                        <span>☕</span>
                        <span className="truncate">Lo-Fi Mellow Warmth (28%)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAudioTuneMode('cinema');
                          setSoundVolume(0.45);
                          setIsMuted(false);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          audioTuneMode === 'cinema'
                            ? 'bg-[#DFC066] text-[#0D261E] font-bold shadow-xs'
                            : 'bg-[#0D261E] text-slate-300 hover:text-white border border-[#C59B27]/20'
                        }`}
                      >
                        <span>🎻</span>
                        <span className="truncate">Cinematic Prestige (45%)</span>
                      </button>
                    </div>
                  </div>

                  {/* Master Volume Slider with Decibel Feedback */}
                  <div className="pt-2 border-t border-[#1D4E3E] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-medium flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-[#DFC066]" />
                        <span>Master Volume:</span>
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className={isMuted ? 'text-red-400' : 'text-[#DFC066] font-bold'}>
                          {isMuted ? 'MUTED' : `${Math.round(soundVolume * 100)}%`}
                        </span>
                        {!isMuted && (
                          <span className="text-slate-400 text-[10px]">
                            ({Math.round(20 * Math.log10(Math.max(soundVolume, 0.01)))} dB)
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                            isMuted ? 'bg-red-900/80 text-white' : 'bg-[#0D261E] text-[#DFC066] border border-[#C59B27]/30'
                          }`}
                        >
                          {isMuted ? 'Unmute' : 'Mute'}
                        </button>
                      </div>
                    </div>

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
                      className="w-full h-1.5 bg-[#0D261E] rounded-lg appearance-none cursor-pointer accent-[#DFC066]"
                    />
                  </div>

                  {/* Six Audio Genre / Theme Selectors */}
                  <div className="pt-2 border-t border-[#1D4E3E]">
                    <div className="text-[10px] text-[#DFC066] font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Clip Instrument Phrasing:</span>
                      <span className="text-[10px] text-slate-400 font-normal">6 Studio Soundscapes</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {SOUND_THEMES.map((theme) => {
                        const isSelected = activeSoundThemeId === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => {
                              setActiveSoundThemeId(theme.id);
                              setIsMuted(false);
                            }}
                            className={`p-2 rounded-xl text-[10px] font-semibold transition-all text-left flex flex-col gap-0.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#DFC066] text-[#0D261E] font-bold shadow-md ring-1 ring-white/50'
                                : 'bg-[#0D261E] text-slate-300 hover:text-white border border-[#C59B27]/25 hover:border-[#DFC066]'
                            }`}
                          >
                            <span className="truncate font-bold">{theme.genreLabel}</span>
                            <span className={`text-[9px] truncate ${isSelected ? 'text-[#0D261E]/80 font-medium' : 'text-slate-400'}`}>
                              {theme.key} · {theme.bpm}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Highlights tags if Film */}
                {activeMediaModal.film?.highlights && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {activeMediaModal.film.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-[#1D4E3E] text-[#DFC066] border border-[#C59B27]/30"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#1D4E3E] flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    const msg =
                      activeMediaModal.reel?.whatsappMessage ||
                      `Hi The Gift Gallery! I watched your commercial film "${activeMediaModal.film?.title}" and want to order this gift.`;
                    handleOrderWhatsApp(msg);
                  }}
                  className="w-full min-h-[46px] rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order This on WhatsApp</span>
                </button>

                {/* View Product in Store */}
                {(activeMediaModal.film?.productId || activeMediaModal.reel?.productId) && onSelectProductForOrder && (
                  <button
                    onClick={() => {
                      const pid =
                        activeMediaModal.film?.productId || activeMediaModal.reel?.productId;
                      if (pid) {
                        setActiveMediaModal(null);
                        onSelectProductForOrder(pid);
                      }
                    }}
                    className="w-full min-h-[42px] rounded-full bg-[#1D4E3E] hover:bg-[#256350] text-[#DFC066] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#C59B27]/40 transition-colors cursor-pointer"
                  >
                    <span>View Product Details &amp; Pricing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
