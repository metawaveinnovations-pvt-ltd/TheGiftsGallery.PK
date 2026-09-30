import React from 'react';
import { INSTAGRAM_POSTS } from '../data/products';
import { usePortal } from '../context/PortalContext';
import { Instagram, Heart, ExternalLink } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

export const InstagramSection: React.FC = () => {
  const { siteSettings } = usePortal();

  return (
    <section className="py-10 min-[800px]:py-24 bg-[#FBF9F5] border-t border-[#EADBCE]">
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
            Discover our latest gifts, surprises, ideas and creations on Instagram.
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

        {/* Visual Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-7 min-[800px]:mb-10">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#EADBCE] shadow-xs block active:scale-[0.98] transition-transform"
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

              {/* Mobile Always-Visible Subtle Scrim + Desktop Full Hover Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent min-[800px]:bg-[#14382C]/75 opacity-100 min-[800px]:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 text-white z-20">
                <p className="text-[10px] sm:text-[11px] line-clamp-1 sm:line-clamp-2 mb-1 sm:mb-2 font-medium leading-tight">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#DFC066] tabular-nums">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> {post.likes}
                  </span>
                  <span className="underline text-[10px]">View</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 shadow-xs transition-all duration-200"
          >
            <Instagram className="w-4 h-4 text-[#C59B27]" />
            <span>Visit Instagram Profile</span>
          </a>
        </div>

      </div>
    </section>
  );
};
