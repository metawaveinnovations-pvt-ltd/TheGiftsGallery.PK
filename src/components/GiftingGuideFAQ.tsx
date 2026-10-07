import React, { useState, useMemo } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

export const GiftingGuideFAQ: React.FC = () => {
  const { knowledgeBase, siteSettings } = usePortal();
  const [openId, setOpenId] = useState<string | null>('gifts-shop-pakistan');
  const [activeTab, setActiveTab] = useState<string>('All');

  const faqItems: FAQItem[] = useMemo(() => {
    const fromDb = knowledgeBase.filter((k) => k.sectionType === 'faq');
    return fromDb.map((k) => ({
      id: k.id,
      category: k.categoryTag,
      question: k.titleOrQuestion,
      answer: k.contentOrAnswer,
      keywords: k.keywords || [],
    }));
  }, [knowledgeBase]);

  const tabs = [
    'All',
    'Fresh Flowers',
    'Customized Gift Baskets',
    'Anniversary & Birthday',
    'Makeup Basket & Accessories',
    'Watches & Wallets',
    'Packaging',
    'Commercials & Reels',
  ];

  const filteredFaqs = activeTab === 'All'
    ? faqItems
    : faqItems.filter((f) => f.category === activeTab);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq-guide" className="py-10 min-[800px]:py-24 bg-white border-t border-[#EADBCE] scroll-mt-20">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 min-[800px]:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>EXPERT GIFTING GUIDE &amp; FAQS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-2.5 min-[800px]:mb-4 text-balance">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-light max-w-2xl mx-auto">
            Find immediate answers on our custom gifts packaging, anniversary gifts, birthday surprises, snacks baskets, makeup hampers, watches, wallets, and nationwide delivery.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 mb-6 min-[800px]:mb-8 gap-2 no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-h-[42px] px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#14382C] text-white shadow-xs'
                  : 'bg-[#F4EFE6] text-slate-700 hover:bg-[#EADBCE]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-2.5 sm:space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#14382C]/30 bg-[#FBF9F5] shadow-xs'
                    : 'border-[#EADBCE] bg-white hover:border-[#14382C]/20'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-lg font-bold text-[#14382C] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#14382C] text-white rotate-180' : 'bg-[#F4EFE6] text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                    <div className="mt-2.5 pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                      {faq.keywords.map((kw, i) => (
                        <React.Fragment key={kw}>
                          {i > 0 && <span aria-hidden="true">·</span>}
                          <span>{kw}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="mt-8 min-[800px]:mt-10 p-5 sm:p-6 rounded-2xl bg-[#F4EFE6] border border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#14382C] text-[#DFC066] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-[#14382C] text-sm sm:text-base">
                Have a specific question not covered here?
              </div>
              <div className="text-xs text-slate-600">
                Our bespoke concierge team responds on WhatsApp within standard hours.
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/923390088458?text=Hello%20The%20Gift%20Gallery!%20I%20have%20a%20question%20about%20your%20gifts."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#14382C] text-white text-xs font-semibold hover:bg-[#0D261E] transition-colors whitespace-nowrap shadow-xs"
          >
            Ask on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
