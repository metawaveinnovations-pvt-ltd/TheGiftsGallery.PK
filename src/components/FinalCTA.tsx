import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Gift, MessageCircle, Instagram, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onOrderClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOrderClick }) => {
  const { siteSettings } = usePortal();

  return (
    <section className="relative overflow-hidden py-12 min-[800px]:py-28 bg-[#14382C] text-[#FBF9F5]">
      {/* Decorative ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#DFC066] mb-3 min-[800px]:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>BESPOKE PAKISTAN GIFTING</span>
        </div>

        <h2 className="text-2xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight mb-3.5 min-[800px]:mb-6 leading-tight text-balance">
          Make Someone's <span className="italic font-normal text-[#DFC066]">Moment Special.</span>
        </h2>

        <p className="text-xs sm:text-xl text-emerald-100/80 font-light leading-relaxed max-w-2xl mx-auto mb-6 min-[800px]:mb-10">
          Whether it’s a celebration, a surprise, or simply a thoughtful gesture — let us help you gift it beautifully.
        </p>

        {/* Action Buttons: 2-Col Thumb Row on < 800px, Centered Pills on Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-6 min-[800px]:mb-8">
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto min-h-[46px] sm:min-h-[52px] inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold tracking-wide text-[#14382C] bg-[#DFC066] hover:bg-[#F2D786] shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#14382C] shrink-0" />
            <span>Start Order</span>
          </button>

          <a
            href={siteSettings.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[46px] sm:min-h-[52px] inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white bg-[#0D261E] hover:bg-black/40 border border-[#C59B27]/60 transition-all duration-200 shadow-md active:scale-[0.98] whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#DFC066] shrink-0" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Social Link */}
        <div className="text-xs text-emerald-200/70 flex flex-wrap items-center justify-center gap-2">
          <span>Explore our ongoing stories &amp; deliveries:</span>
          <a
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#DFC066] hover:underline font-medium inline-flex items-center gap-1"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>{siteSettings.instagramHandle}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
