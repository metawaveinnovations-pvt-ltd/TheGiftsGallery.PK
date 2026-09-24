import React from 'react';
import { Gift, Sparkles, HeartHandshake } from 'lucide-react';

export const BrandIntro: React.FC = () => {
  const cards = [
    {
      icon: Gift,
      title: 'Thoughtfully Curated',
      text: 'Gifts selected with care for meaningful moments. From premium perfumes and leather accessories to sweet gourmet hampers, each item is hand-vetted.',
      tag: 'Curation',
    },
    {
      icon: Sparkles,
      title: 'Beautifully Presented',
      text: 'Elegant presentation that makes the moment even more special. Signature forest green velvet boxes, crisp ribbons, and handwritten gold-foil cards.',
      tag: 'Aesthetics',
    },
    {
      icon: HeartHandshake,
      title: 'Made for Every Moment',
      text: 'From celebrations to simple gestures of love and appreciation. Birthdays, anniversaries, graduations, or just reminding someone they are cherished.',
      tag: 'Emotion',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-3">
            THE TGG PHILOSOPHY
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] mb-6 tracking-tight">
            Thoughtfully Chosen. Beautifully Gifted.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            “At The Gift Gallery, we believe a gift is more than an object — it is a feeling, a memory, and a way of saying ‘you matter.’”
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-xs">✦</span>
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
          </div>
        </div>

        {/* 3 Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="relative bg-white/80 rounded-2xl p-8 border border-[#EADBCE] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Number index indicator */}
                <div className="text-xs font-serif text-[#C59B27] font-semibold mb-4 tracking-widest">
                  0{index + 1} · {card.tag}
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] text-[#14382C] flex items-center justify-center mb-6 group-hover:bg-[#14382C] group-hover:text-[#DFC066] transition-colors duration-300 border border-[#C59B27]/30">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-serif font-bold text-[#14382C] mb-3">
                  {card.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
