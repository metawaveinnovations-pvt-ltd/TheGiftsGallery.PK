import React from 'react';
import { OCCASIONS } from '../data/products';
import { Cake, Heart, Sparkles, Gem, GraduationCap, Smile, ArrowUpRight } from 'lucide-react';

interface OccasionsProps {
  onSelectOccasion: (occasionName: string) => void;
}

export const Occasions: React.FC<OccasionsProps> = ({ onSelectOccasion }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cake':
        return Cake;
      case 'Heart':
        return Heart;
      case 'Sparkles':
        return Sparkles;
      case 'Gem':
        return Gem;
      case 'GraduationCap':
        return GraduationCap;
      case 'Smile':
        return Smile;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="occasions" className="py-16 md:py-24 bg-[#14382C] text-[#FBF9F5] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0D261E] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#DFC066] block mb-2">
            CELEBRATE LIFE’S CHAPTERS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Gifts for Every Occasion
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/80 font-light leading-relaxed">
            Whether it is an anticipated anniversary or a spontaneous surprise, we bring heartfelt emotion into tangible form.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-[#C59B27]/50" />
            <span className="text-[#DFC066] text-xs">✦</span>
            <span className="h-[1px] w-10 bg-[#C59B27]/50" />
          </div>
        </div>

        {/* Occasions Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occasion) => {
            const Icon = getIcon(occasion.iconName);
            return (
              <div
                key={occasion.id}
                onClick={() => onSelectOccasion(occasion.name)}
                className="group cursor-pointer bg-[#0D261E]/80 backdrop-blur-sm rounded-2xl p-7 border border-[#C59B27]/30 hover:border-[#DFC066] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#14382C] text-[#DFC066] border border-[#C59B27]/40 flex items-center justify-center group-hover:bg-[#C59B27] group-hover:text-[#14382C] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#C59B27]/30 flex items-center justify-center text-[#DFC066] group-hover:border-[#DFC066] transition-colors">
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#DFC066] transition-colors mb-2">
                    {occasion.name}
                  </h3>
                  <p className="text-sm text-emerald-100/70 leading-relaxed">
                    {occasion.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-900/60 text-xs text-[#DFC066] font-medium flex items-center gap-1.5">
                  <span>Custom hamper & box ideas</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
