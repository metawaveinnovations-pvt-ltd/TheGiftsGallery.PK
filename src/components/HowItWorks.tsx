import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/products';
import { Sparkles, MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
            SIMPLE & SEAMLESS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-base text-slate-600 font-light">
            We make ordering personalized luxury gifts effortless from idea to doorstep delivery.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((item, index) => (
            <div
              key={item.step}
              className="relative bg-white rounded-2xl p-7 border border-[#EADBCE] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Connector line for desktop */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-[#C59B27]/40 z-20" />
              )}

              <div>
                {/* Step badge */}
                <div className="w-12 h-12 rounded-xl bg-[#14382C] text-[#DFC066] font-serif font-bold text-lg flex items-center justify-center mb-6 shadow-sm">
                  {item.step}
                </div>

                <h3 className="text-xl font-serif font-bold text-[#14382C] mb-2.5">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-[#9E7B1A]">
                <Sparkles className="w-3 h-3 text-[#C59B27]" />
                <span>Phase {item.step} of 04</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#F4EFE6] via-[#FDFBF7] to-[#F4EFE6] border border-[#C59B27]/40 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-sm">
          <div className="text-center sm:text-left">
            <h4 className="font-serif font-bold text-lg text-[#14382C]">
              Have an urgent question or custom request?
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Reach our gifting concierge directly on WhatsApp for immediate guidance.
            </p>
          </div>
          <a
            href={BRAND_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#14382C] hover:bg-[#0D261E] shadow-sm hover:shadow transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#DFC066]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
