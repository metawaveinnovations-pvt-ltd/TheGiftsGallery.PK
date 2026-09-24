import React from 'react';
import { INSTAGRAM_POSTS, BRAND_INFO } from '../data/products';
import { Instagram, Heart, ExternalLink } from 'lucide-react';

export const InstagramSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FBF9F5] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-2">
            <Instagram className="w-3.5 h-3.5" />
            <span>COMMUNITY & INSPIRATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-3">
            Follow The Moments
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light mb-4">
            Discover our latest gifts, surprises, ideas and creations on Instagram.
          </p>
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-base font-serif font-bold text-[#14382C] hover:text-[#C59B27] transition-colors"
          >
            <span>{BRAND_INFO.instagramHandle}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C59B27]" />
          </a>
        </div>

        {/* Visual Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-[#EADBCE] shadow-sm block"
            >
              <img
                src={post.image}
                alt="The Gift Gallery moment"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Corner TGG Hallmark Badge */}
              <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1 rounded-md border border-[#C59B27]/40 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                <img src="/tgg_logo.png" alt="TGG Official" className="w-5 h-auto object-contain" referrerPolicy="no-referrer" />
              </div>

              {/* Hover Scrim */}
              <div className="absolute inset-0 bg-[#14382C]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <p className="text-[11px] line-clamp-2 mb-2 font-medium leading-tight">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#DFC066]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-current" /> {post.likes}
                  </span>
                  <span className="underline text-[10px]">View Post</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 shadow-sm hover:shadow transition-all duration-200"
          >
            <Instagram className="w-4 h-4 text-[#C59B27]" />
            <span>Visit Instagram Profile</span>
          </a>
        </div>

      </div>
    </section>
  );
};
