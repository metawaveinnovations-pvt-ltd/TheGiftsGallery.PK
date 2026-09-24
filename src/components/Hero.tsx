import React from 'react';
import { BRAND_INFO } from '../data/products';
import { Gift, MessageCircle, Sparkles, ShieldCheck, Truck, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { OptimizedImage } from './OptimizedImage';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#FBF9F5] via-[#F6F1E7] to-[#FBF9F5] py-12 md:py-20 lg:py-24 border-b border-[#EADBCE]/60">
      {/* Subtle background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#14382C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-widest uppercase text-[#14382C] border-b border-[#C59B27]/60 pb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>THE GIFT GALLERY • TGG</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#14382C] leading-[1.1] tracking-tight mb-6">
              Gifts for <span className="italic font-normal text-[#C59B27]">Every Moment.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-xl mb-8">
              Thoughtfully curated gifts, beautifully presented and made to turn ordinary moments into memorable ones.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] shadow-md hover:shadow-lg transition-all duration-200 border border-[#C59B27]/50 active:scale-[0.98] cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#DFC066]" />
                <span>Explore Gifts</span>
              </button>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/50 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-[#14382C]" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-6 border-t border-[#EADBCE] w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-xs font-medium">Nationwide PK Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-xs font-medium">Handcrafted Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-xs font-medium">Personalized Touch</span>
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
                  src="/assets/images/tgg_hero_curated_gifting_1790253103850.jpg"
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

                {/* Bottom caption overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#DFC066] mb-1">
                    Signature Hampers & Bespoke Boxes
                  </div>
                  <div className="font-serif text-lg font-medium leading-snug">
                    Curated with devotion, delivered with grace.
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-3.5 shadow-lg border border-[#EADBCE] hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-9 h-9 rounded-full bg-[#14382C] text-[#DFC066] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                  ★
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">“The best surprise service in Pakistan!”</p>
                  <p className="text-[10px] text-slate-500">Verified Client · Lahore & Karachi</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
