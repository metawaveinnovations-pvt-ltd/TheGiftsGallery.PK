import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Gift, MessageCircle, Sparkles, ShieldCheck, Truck, Heart, Instagram, Play } from 'lucide-react';
import { Logo } from './Logo';
import { OptimizedImage } from './OptimizedImage';

interface HeroProps {
  onExploreClick: () => void;
  onWatchFilmClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onWatchFilmClick }) => {
  const { siteSettings } = usePortal();

  const handleScrollToReels = () => {
    if (onWatchFilmClick) {
      onWatchFilmClick();
    } else {
      const el = document.getElementById('brand-reels');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#FBF9F5] via-[#F6F1E7] to-[#FBF9F5] py-8 min-[800px]:py-20 lg:py-24 border-b border-[#EADBCE]/60">
      {/* Subtle background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#14382C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small eyebrow: Clickable Brand & Instagram */}
            <div className="inline-flex flex-wrap items-center gap-2 mb-3 min-[800px]:mb-4 text-[11px] min-[800px]:text-xs font-semibold tracking-widest uppercase text-[#14382C] border-b border-[#C59B27]/60 pb-1">
              <a
                href="#home"
                className="inline-flex items-center gap-1.5 hover:text-[#C59B27] transition-colors"
                title="The Gift Gallery (TGG) — Home"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>{siteSettings.heroEyebrow}</span>
              </a>
              <span aria-hidden="true" className="text-[#C59B27]/60">·</span>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#C59B27] hover:text-[#14382C] transition-colors normal-case tracking-normal font-medium"
                title="Visit @thegiftsgallery.pk on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{siteSettings.instagramHandle}</span>
              </a>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#14382C] leading-[1.08] tracking-tight mb-3.5 min-[800px]:mb-6">
              {siteSettings.heroHeadlinePrefix}{' '}
              <span className="italic font-normal text-[#C59B27]">
                {siteSettings.heroHeadlineHighlight}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-lg min-[800px]:text-xl text-slate-600 font-normal leading-relaxed max-w-xl mb-5 min-[800px]:mb-8">
              {siteSettings.heroSubtitle}
            </p>

            {/* CTA Buttons: Compact row on <800px, generous pills on desktop */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 sm:gap-3.5 w-full sm:w-auto mb-6 min-[800px]:mb-10">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto min-h-[46px] sm:min-h-[48px] inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] shadow-md hover:shadow-lg transition-all duration-200 border border-[#C59B27]/50 active:scale-[0.98] cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#DFC066] shrink-0" />
                <span>Explore Gifts</span>
              </button>

              <button
                onClick={handleScrollToReels}
                className="w-full sm:w-auto min-h-[46px] sm:min-h-[48px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold tracking-wide text-[#14382C] bg-white hover:bg-[#F4EFE6] border border-[#C59B27]/50 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#C59B27] fill-current shrink-0" />
                <span>Watch Commercials</span>
              </button>

              <a
                href={siteSettings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 sm:col-span-1 w-full sm:w-auto min-h-[44px] sm:min-h-[48px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold tracking-wide text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/30 transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-[#14382C] shrink-0" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Trust Markers: Swipeable horizontal chip strip on <800px, 3-col grid on >=800px */}
            <div className="pt-4 min-[800px]:pt-6 border-t border-[#EADBCE] w-full flex overflow-x-auto no-scrollbar gap-2 min-[800px]:grid min-[800px]:grid-cols-3 min-[800px]:gap-4 text-slate-600">
              <div className="flex items-center gap-1.5 px-3 py-1.5 min-[800px]:p-0 rounded-full bg-white/80 min-[800px]:bg-transparent border border-[#EADBCE] min-[800px]:border-0 shrink-0">
                <Truck className="w-3.5 h-3.5 min-[800px]:w-4 min-[800px]:h-4 text-[#C59B27] shrink-0" />
                <span className="text-[11px] min-[800px]:text-xs font-medium whitespace-nowrap">{siteSettings.heroTrustBadge1}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 min-[800px]:p-0 rounded-full bg-white/80 min-[800px]:bg-transparent border border-[#EADBCE] min-[800px]:border-0 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 min-[800px]:w-4 min-[800px]:h-4 text-[#C59B27] shrink-0" />
                <span className="text-[11px] min-[800px]:text-xs font-medium whitespace-nowrap">{siteSettings.heroTrustBadge2}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 min-[800px]:p-0 rounded-full bg-white/80 min-[800px]:bg-transparent border border-[#EADBCE] min-[800px]:border-0 shrink-0">
                <Heart className="w-3.5 h-3.5 min-[800px]:w-4 min-[800px]:h-4 text-[#C59B27] shrink-0" />
                <span className="text-[11px] min-[800px]:text-xs font-medium whitespace-nowrap">{siteSettings.heroTrustBadge3}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Composition with TGG Branding (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Visual Frame */}
            <div className="relative w-full max-w-md">
              {/* Outer decorative gold-accent border */}
              <div className="absolute -inset-2.5 rounded-3xl border border-[#C59B27]/40 pointer-events-none transform rotate-1" />
              
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-[#EADBCE]">
                {/* Hero Editorial Photography (Fast WebP & high priority) */}
                <OptimizedImage
                  src={siteSettings.heroImageUrl}
                  alt="The Gift Gallery curated presentation"
                  aspectRatio="aspect-square sm:aspect-[4/3]"
                  className="w-full h-80 sm:h-96"
                  imgClassName="transform transition-transform duration-700 hover:scale-105"
                  priority={true}
                  fallbackTitle="Curated Bespoke Gifting"
                  categoryName="The Gift Gallery"
                />

                {/* Subtle scrim & brand tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                {/* Floating Official TGG Badge */}
                <div className="absolute top-4 right-4 bg-[#FBF9F5]/95 backdrop-blur-md rounded-2xl p-2 shadow-md border border-[#C59B27]/50 flex items-center justify-center">
                  <Logo variant="mark" size={64} />
                </div>

                {/* Floating Watch Video Reel Trigger Badge */}
                <button
                  onClick={handleScrollToReels}
                  className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full pl-2 pr-3.5 py-1.5 shadow-lg border border-[#C59B27]/50 flex items-center gap-2 transition-all cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#DFC066] text-[#0D261E] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3 h-3 fill-current translate-x-0.5" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide">
                    Watch Reel
                  </span>
                </button>

                {/* Bottom caption overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#DFC066] mb-1">
                    {siteSettings.heroCaptionTag}
                  </div>
                  <div className="font-serif text-lg font-medium leading-snug">
                    {siteSettings.heroCaptionTitle}
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-3.5 shadow-lg border border-[#EADBCE] hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-9 h-9 rounded-full bg-[#14382C] text-[#DFC066] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                  ★
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {siteSettings.heroReviewQuote}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {siteSettings.heroReviewAuthor}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
