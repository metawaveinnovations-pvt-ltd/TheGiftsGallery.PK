import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { Gift, Check } from 'lucide-react';

interface FeaturedGiftsProps {
  onOrderProduct: (product: Product, selectedTier?: string) => void;
}

export const FeaturedGifts: React.FC<FeaturedGiftsProps> = ({ onOrderProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTiers, setActiveTiers] = useState<Record<string, number>>({});

  const categories = [
    'All',
    'Special Gifts for Him',
    'Customized Gift Baskets',
    'Accessories & Beauty',
    'Personalized Gifts',
    'Bespoke Packaging',
  ];

  const filteredProducts = selectedCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleTierSelect = (productId: string, tierIndex: number) => {
    setActiveTiers((prev) => ({ ...prev, [productId]: tierIndex }));
  };

  return (
    <section id="gifts" className="py-16 md:py-24 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-2">
            SIGNATURE CREATIONS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-4">
            Curated With Love
          </h2>
          <p className="text-base text-slate-600 font-light">
            Every hamper and presentation box is assembled by hand with artisan care, luxury wrapping, and customized sentiment cards.
          </p>
        </div>

        {/* Filter Bar (Segmented Controls) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#14382C] text-white shadow-sm'
                  : 'bg-[#F4EFE6] text-slate-700 hover:bg-[#EADBCE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentTierIndex = activeTiers[product.id] ?? 0;
            const currentTier = product.tiers ? product.tiers[currentTierIndex] : null;
            const displayPrice = currentTier ? currentTier.price : product.priceDisplay;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EADBCE] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EFE6]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {product.isPopular && (
                      <span className="absolute top-3 left-3 bg-[#14382C]/90 backdrop-blur-sm text-[#DFC066] text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wider uppercase border border-[#C59B27]/30">
                        Popular Choice
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Quiet Metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#9E7B1A] font-medium">Authentic TGG</span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xl font-serif font-bold text-[#14382C] mb-1 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs italic text-[#C59B27] mb-3">
                      “{product.tagline}”
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Size / Tier Selection if available */}
                    {product.tiers && product.tiers.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-medium text-slate-500 mb-2">
                          Select Presentation Size:
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {product.tiers.map((tier, idx) => (
                            <button
                              key={tier.size}
                              onClick={() => handleTierSelect(product.id, idx)}
                              className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border transition-all text-center ${
                                currentTierIndex === idx
                                  ? 'bg-[#14382C] text-white border-[#14382C]'
                                  : 'bg-[#FBF9F5] text-slate-700 border-slate-200 hover:border-[#C59B27]'
                              }`}
                            >
                              {tier.size.replace(' (Premium)', '')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key features bullets */}
                    <div className="space-y-1 mb-4 pt-2 border-t border-slate-100">
                      {product.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-[11px] text-slate-600">
                          <Check className="w-3 h-3 text-[#14382C] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Order Action */}
                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-slate-500">
                        {currentTier ? `${currentTier.size} Tier` : 'Estimated Price'}
                      </span>
                      <span className="text-base font-serif font-bold text-[#14382C] tabular-nums">
                        {displayPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => onOrderProduct(product, currentTier?.size)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#14382C] hover:bg-[#0D261E] border border-[#C59B27]/40 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
                    >
                      <Gift className="w-3.5 h-3.5 text-[#DFC066]" />
                      <span>Order This Gift</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Custom inquiry note */}
        <div className="mt-12 bg-[#F4EFE6] rounded-2xl p-6 border border-[#EADBCE] text-center max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-700">
            Have a custom combination or special brand request in mind? We curate bespoke hampers tailored to your specific taste, budget and occasion.
          </p>
          <a
            href="#order-form"
            className="inline-block mt-3 text-xs font-bold text-[#14382C] underline decoration-[#C59B27] underline-offset-4 hover:text-[#0D261E]"
          >
            Custom Order Request Form ↓
          </a>
        </div>

      </div>
    </section>
  );
};
