import React, { useState } from 'react';
import { POLICIES } from '../data/products';
import { Logo } from './Logo';
import { Shield, Clock, Moon, Truck, FileText, CreditCard, Sparkles, Tag, MessageSquare, X, ChevronRight } from 'lucide-react';

export const Policies: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

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
    <section id="policies" className="py-16 md:py-24 bg-[#FBF9F5] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
            TRANSPARENT & HONEST
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-3">
            Customer & Order Policies
          </h2>
          <p className="text-sm font-serif italic text-[#9E7B1A] mb-3">
            Our Uncompromising Commitment To You
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl mx-auto">
            To ensure a smooth, dependable and delightful gifting experience, please review our core operational guidelines.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-xs">✦</span>
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
          </div>
        </div>

        {/* Compact Grid of the 9 Policies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {POLICIES.map((item) => {
            const Icon = getPolicyIcon(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 border border-[#EADBCE] shadow-sm hover:border-[#C59B27]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                        {item.id}
                      </span>
                      <h3 className="text-base font-serif font-bold text-[#14382C]">
                        {item.title}
                      </h3>
                    </div>
                    <Icon className="w-4 h-4 text-[#C59B27]" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.shortText}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-[#9E7B1A]">{item.badgeLabel}</span>
                  <span className="text-slate-500">Guideline #{item.id}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Policies Button & Modal Trigger */}
        <div className="text-center">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 shadow-sm transition-all duration-200"
          >
            <span>View Full Policies & Gifting Terms</span>
            <ChevronRight className="w-4 h-4 text-[#C59B27]" />
          </button>
        </div>

      </div>

      {/* Full Policies Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FBF9F5] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#C59B27]/40 shadow-2xl relative p-6 sm:p-10">
            
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <Logo variant="emblem" className="mb-2" />
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#14382C]">
                Customer & Order Policies
              </h3>
              <p className="text-xs sm:text-sm font-serif italic text-[#9E7B1A] mt-1">
                Our Uncompromising Commitment To You
              </p>
              <p className="text-xs text-slate-500 mt-2">
                The Gift Gallery · Official Customer Experience Guidelines
              </p>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 text-slate-700 divide-y divide-[#EADBCE]">
              {POLICIES.map((p) => (
                <div key={p.id} className="pt-5 first:pt-0">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-serif font-bold text-sm text-[#C59B27]">
                      {p.id}.
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#14382C]">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mb-1">
                    {p.shortText}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.fullDetails}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer Note */}
            <div className="mt-8 pt-6 border-t border-[#EADBCE] text-center">
              <p className="text-xs font-serif italic text-[#14382C] font-semibold">
                “THANK YOU FOR ALLOWING US TO SHARE YOUR MOMENT.”
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                The Gift Gallery · GIFTS • SURPRISES • MEMORIES
              </p>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-5 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#14382C] hover:bg-[#0D261E]"
              >
                I Understand & Agree
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
