import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Logo } from './Logo';
import {
  Shield,
  Clock,
  Moon,
  Truck,
  FileText,
  CreditCard,
  Sparkles,
  Tag,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from 'lucide-react';

export const Policies: React.FC = () => {
  const { policies } = usePortal();
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getPolicyIcon = (id: number) => {
    switch (id) {
      case 1:
        return Clock;
      case 2:
        return Clock;
      case 3:
        return Moon;
      case 4:
        return Truck;
      case 5:
        return FileText;
      case 6:
        return CreditCard;
      case 7:
        return Sparkles;
      case 8:
        return Tag;
      case 9:
        return MessageSquare;
      default:
        return Shield;
    }
  };

  return (
    <section id="policies" className="py-10 min-[800px]:py-24 bg-[#FBF9F5] border-t border-[#EADBCE] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 min-[800px]:mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-1.5 min-[800px]:mb-2">
            TRANSPARENT &amp; HONEST
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-2 min-[800px]:mb-3 text-balance">
            Customer &amp; Order Policies
          </h2>
          <p className="text-xs sm:text-base font-serif italic text-[#9E7B1A] mb-2 min-[800px]:mb-3">
            Our Uncompromising Commitment To You
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl mx-auto">
            To ensure a seamless, dependable and delightful gifting journey across Pakistan, please review our core operational guidelines.
          </p>
          <div className="mt-3 min-[800px]:mt-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-xs">✦</span>
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
          </div>
        </div>

        {/* Authentic Gold Wax-Seal Styled Cards: Horizontal Snap Carousel on < 800px, 3x3 Grid on >= 800px */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 -mx-3.5 px-3.5 no-scrollbar min-[800px]:grid min-[800px]:grid-cols-2 lg:grid-cols-3 min-[800px]:gap-6 min-[800px]:mx-0 min-[800px]:px-0 mb-8 min-[800px]:mb-12">
          {policies.map((item) => {
            const Icon = getPolicyIcon(item.id);
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="snap-center shrink-0 w-[82vw] max-w-[310px] min-[800px]:w-auto min-[800px]:max-w-none bg-white rounded-2xl p-5 min-[800px]:p-6 border border-[#EADBCE] shadow-xs hover:border-[#C59B27]/60 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Gold Wax Seal Motif */}
                  <div className="flex items-center justify-between mb-3.5 min-[800px]:mb-4">
                    <div className="flex items-center gap-2.5 min-[800px]:gap-3">
                      {/* Wax seal styled numbered badge */}
                      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#DFC066] via-[#C59B27] to-[#9E7B1A] text-white flex items-center justify-center shadow-xs font-serif font-bold text-xs border border-[#F5F0E6] tabular-nums shrink-0">
                        {item.id}
                      </div>
                      <div>
                        <h3 className="text-sm min-[800px]:text-base font-serif font-bold text-[#14382C] leading-snug">
                          {item.title}
                        </h3>
                        <span className="text-[10px] uppercase font-semibold text-[#9E7B1A] tracking-wider">
                          {item.badgeLabel}
                        </span>
                      </div>
                    </div>
                    <Icon className="w-4 h-4 text-[#C59B27] shrink-0" />
                  </div>

                  {/* Core Short Policy Text */}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
                    “{item.shortText}”
                  </p>

                  {/* Expandable full explanation */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed bg-[#FBF9F5] p-3 rounded-xl border border-[#EADBCE]/50 animate-in fade-in duration-200">
                      {item.fullDetails}
                    </div>
                  )}
                </div>

                {/* Card Footer toggle */}
                <div className="mt-3 min-[800px]:mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 tabular-nums">Clause 0{item.id}</span>
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="min-h-[36px] px-2 inline-flex items-center gap-1 font-semibold text-[#14382C] hover:text-[#C59B27] transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Less' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Policies Button & Modal Trigger */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="min-h-[44px] inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-[#C59B27]" />
            <span>Read Complete Official Customer Handbook</span>
          </button>
        </div>

      </div>

      {/* Full Policies Modal (Slide-Up Bottom Sheet on < 800px) */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[#FBF9F5] rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[88vh] sm:max-h-[90vh] overflow-y-auto border-t sm:border border-[#C59B27]/40 shadow-2xl relative p-5 sm:p-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Grab Handle */}
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <Logo variant="mark" size={80} className="mb-2" />
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#14382C]">
                Customer & Order Policies
              </h3>
              <p className="text-xs sm:text-sm font-serif italic text-[#9E7B1A] mt-1">
                Our Uncompromising Commitment To You
              </p>
              <p className="text-xs text-slate-500 mt-2">
                The Gift Gallery (TGG) · Official Customer Experience Guidelines
              </p>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 text-slate-700 divide-y divide-[#EADBCE]">
              {policies.map((p) => (
                <div key={p.id} className="pt-5 first:pt-0">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-serif font-bold text-sm text-[#C59B27]">
                      {p.id}.
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#14382C]">
                      {p.title}
                    </h4>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      ({p.badgeLabel})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 mb-1 leading-relaxed">
                    {p.shortText}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {p.fullDetails}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-6 border-t border-[#EADBCE] text-center">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#14382C] hover:bg-[#0D261E] transition-colors"
              >
                Understood & Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
