import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, Package, Gift, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'gifts-shop-pakistan',
    category: 'Gifts Shop',
    question: 'Where can I find the best boutique gifts shop in Pakistan for special events?',
    answer: 'The Gift Gallery (@thegiftsgallery.pk) is your premier destination for curated gifting across Pakistan. We specialize in luxury gift boxes, anniversary gifts, birthday baskets, corporate events, and bespoke packaging delivered promptly to doorsteps in Karachi, Lahore, Islamabad, Rawalpindi, and nationwide.',
    keywords: ['gifts shop', 'events', 'boutiques', 'Karachi', 'Lahore', 'Islamabad'],
  },
  {
    id: 'anniversary-birthday-gifts',
    category: 'Anniversary & Birthday',
    question: 'What makes your Anniversary Gifts and Birthday Gifts unique?',
    answer: 'Every anniversary and birthday gift is customized to your recipient’s tastes. Our anniversary packages feature preserved eternity roses, custom gold-foil vow cards, and luxury perfumes. Birthday surprise hampers include festive balloon arrangements, imported chocolates, and personalized keepsakes crafted with 1-2 days advance notice.',
    keywords: ['anniversary gifts', 'birthday gifts', 'events'],
  },
  {
    id: 'snacks-basket',
    category: 'Baskets',
    question: 'What is included in the signature Snacks Basket?',
    answer: 'Our artisan wicker Snacks Basket is hand-dressed with rich forest green ribbon and signature TGG gold medallion. It comes loaded with premium imported chocolates (Ferrero Rocher, Cadbury Dairy Milk, KitKat, Snickers), Pringles, gourmet nuts, and customized savory treats tailored to your budget (PKR 1,500 – 5,000).',
    keywords: ['snacks basket', 'baskets', 'birthday gifts'],
  },
  {
    id: 'makeup-basket-accessories',
    category: 'Makeup Basket & Accessories',
    question: 'Can I order a custom Makeup Basket with bracelets and jewelry accessories?',
    answer: 'Yes! Our Velvet Makeup Basket brings together curated beauty essentials, makeup brushes, designer charm bracelets, shimmering necklaces, and silk hair accessories nestled inside our signature emerald velvet presentation box.',
    keywords: ['makeup basket', 'accessories', 'bracelets', 'boutiques', 'baskets'],
  },
  {
    id: 'watches-wallets',
    category: 'Watches & Wallets',
    question: 'Do you offer executive gift sets for him with watches, wallets, and perfumes?',
    answer: 'Yes. Our gentleman’s sets feature premium chronograph watches, hand-stitched genuine leather wallets, solid polished metal chains, and designer fragrances packaged in sleek matte black and emerald keepsake boxes.',
    keywords: ['watches', 'wallets', 'accessories', 'special gifts for him'],
  },
  {
    id: 'luxury-gifts-packaging',
    category: 'Packaging',
    question: 'What custom gifts packaging and magnetic box options do you provide?',
    answer: 'We provide bespoke gifts packaging including heavy-duty magnetic closure boxes, gold-leaf hot stamped TGG monograms, double-faced satin and grosgrain ribbons, embossed paper tissue, and boutique shopping bags in emerald, champagne, and blush tones.',
    keywords: ['gifts packaging', 'boutiques', 'magnetic boxes'],
  },
  {
    id: 'delivery-midnight-events',
    category: 'Delivery & Ordering',
    question: 'How do I place an order, and do you support midnight surprise deliveries?',
    answer: 'Ordering is seamless! Choose your gift or budget tier, share your recipient’s details on our form, and connect directly with our design team via WhatsApp (+92 339 0088458). We require 1–2 days prior notice. Special 12:00 AM midnight surprise deliveries for birthdays and anniversaries are available upon request.',
    keywords: ['midnight delivery', 'events', 'ordering'],
  },
];

export const GiftingGuideFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('gifts-shop-pakistan');
  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = ['All', 'Anniversary & Birthday', 'Baskets', 'Makeup Basket & Accessories', 'Watches & Wallets', 'Packaging'];

  const filteredFaqs = activeTab === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter((f) => f.category === activeTab);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq-guide" className="py-16 md:py-24 bg-white border-t border-[#EADBCE] scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#14382C]/5 border border-[#14382C]/10 text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>EXPERT GIFTING GUIDE &amp; FAQS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light max-w-2xl mx-auto">
            Find immediate answers on our custom gifts packaging, anniversary gifts, birthday surprises, snacks baskets, makeup hampers, watches, wallets, and nationwide delivery.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 mb-8 gap-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#14382C] text-white shadow-sm'
                  : 'bg-[#F4EFE6] text-slate-700 hover:bg-[#EADBCE]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#14382C]/30 bg-[#FBF9F5] shadow-sm'
                    : 'border-[#EADBCE] bg-white hover:border-[#14382C]/20'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#14382C]">
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
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
                      {faq.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#14382C]/5 text-[10px] font-medium text-[#14382C]"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-[#F4EFE6] border border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
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
            className="px-5 py-2.5 rounded-full bg-[#14382C] text-white text-xs font-semibold hover:bg-[#0D261E] transition-colors whitespace-nowrap shadow-sm"
          >
            Ask on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
