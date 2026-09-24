import React from 'react';
import { BRAND_INFO } from '../data/products';
import { Gift, MessageCircle, Instagram, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onOrderClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOrderClick }) => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#14382C] text-[#FBF9F5]">
      {/* Decorative ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#DFC066] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>BESPOKE PAKISTAN GIFTING</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6 leading-tight">
          Make Someone's <span className="italic font-normal text-[#DFC066]">Moment Special.</span>
        </h2>

        <p className="text-base sm:text-xl text-emerald-100/80 font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Whether it’s a celebration, a surprise, or simply a thoughtful gesture — let us help you gift it beautifully.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wide text-[#14382C] bg-[#DFC066] hover:bg-[#F2D786] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Gift className="w-5 h-5 text-[#14382C]" />
            <span>Start Your Order</span>
          </button>

          <a
            href={BRAND_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wide text-white bg-[#0D261E] hover:bg-black/40 border border-[#C59B27]/60 transition-all duration-200 shadow-md"
          >
            <MessageCircle className="w-5 h-5 text-[#DFC066]" />
            <span>WhatsApp Us ({BRAND_INFO.whatsappNumber})</span>
          </a>
        </div>

        {/* Social Link */}
        <div className="text-xs text-emerald-200/70 flex items-center justify-center gap-2">
          <span>Explore our ongoing stories & deliveries:</span>
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#DFC066] hover:underline font-medium inline-flex items-center gap-1"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>{BRAND_INFO.instagramHandle}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
