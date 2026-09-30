import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/products';
import { Sparkles, MessageCircle } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export const HowItWorks: React.FC = () => {
  const { siteSettings } = usePortal();

  return (
    <section id="how-it-works" className="py-10 min-[800px]:py-24 bg-[#FBF9F5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 min-[800px]:mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-1.5 min-[800px]:mb-2">
            SIMPLE &amp; SEAMLESS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-2.5 min-[800px]:mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-light">
            We make ordering personalized luxury gifts effortless from idea to doorstep delivery.
          </p>
        </div>

        {/* Steps Grid: 2x2 Compact App Grid on < 800px, 4-col on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((item, index) => (
            <div
              key={item.step}
              className="relative bg-white rounded-2xl p-4 sm:p-7 border border-[#EADBCE] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Connector line for desktop */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-[#C59B27]/40 z-20" />
              )}

              <div>
                {/* Step badge */}
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#14382C] text-[#DFC066] font-serif font-bold text-sm sm:text-lg flex items-center justify-center mb-3 sm:mb-6 shadow-xs tabular-nums">
                  {item.step}
                </div>

                <h3 className="text-sm sm:text-xl font-serif font-bold text-[#14382C] mb-1.5 sm:mb-2.5 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#9E7B1A] tabular-nums">
                <Sparkles className="w-3 h-3 text-[#C59B27] shrink-0" />
                <span>Phase {item.step} of 04</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance banner */}
        <div className="mt-8 min-[800px]:mt-14 p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-[#F4EFE6] via-[#FDFBF7] to-[#F4EFE6] border border-[#C59B27]/40 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-4xl mx-auto shadow-xs">
          <div className="text-center sm:text-left">
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#14382C]">
              Have an urgent question or custom request?
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Reach our gifting concierge directly on WhatsApp for immediate guidance.
            </p>
          </div>
          <a
            href={siteSettings.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#14382C] hover:bg-[#0D261E] shadow-xs transition-all shrink-0 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-[#DFC066]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
