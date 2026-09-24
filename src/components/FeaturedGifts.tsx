import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { Gift, Check, Eye, Search, Sparkles, X } from 'lucide-react';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { OptimizedImage } from './OptimizedImage';

interface FeaturedGiftsProps {
  onOrderProduct: (product: Product, selectedTier?: string) => void;
}

export const FeaturedGifts: React.FC<FeaturedGiftsProps> = ({ onOrderProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTiers, setActiveTiers] = useState<Record<string, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories = [
    'All',
    'Anniversary Gifts',
    'Birthday Gifts',
    'Snacks Basket',
    'Makeup Basket',
    'Watches & Accessories',
    'Wallets & Accessories',
    'Bracelets & Accessories',
    'Gifts Packaging',
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category === selectedCategory ||
        p.tags?.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query)) ||
        p.features.some((f) => f.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') return PRODUCTS.length;
    return PRODUCTS.filter(
      (p) =>
        p.category === categoryName ||
        p.tags?.some((t) => t.toLowerCase() === categoryName.toLowerCase())
    ).length;
  };

  const handleTierSelect = (productId: string, tierIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTiers((prev) => ({ ...prev, [productId]: tierIndex }));
  };

  return (
    <section id="gifts" className="py-16 md:py-24 bg-[#FBF9F5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Rank SEO Micro-copy */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#14382C]/5 border border-[#14382C]/10 text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>SIGNATURE BOUTIQUE CREATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-4 text-balance">
            Curated With Love &amp; Artistry
          </h2>
          <p className="text-base text-slate-600 font-light max-w-2xl mx-auto">
            From anniversary gifts and birthday surprises to gourmet snacks baskets, makeup baskets, watches, wallets, bracelets, and bespoke luxury packaging across Pakistan.
          </p>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="max-w-xl mx-auto mb-8 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts, baskets, watches, makeup, bracelets, packaging..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-[#EADBCE] text-sm text-[#1C2826] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14382C] focus:border-transparent shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (Responsive horizontal scroll with item counts) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#14382C] text-white shadow-md shadow-[#14382C]/10 scale-105'
                    : 'bg-[#F4EFE6] text-slate-700 hover:bg-[#EADBCE]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat
                      ? 'bg-white/20 text-[#DFC066]'
                      : 'bg-black/5 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty Search Result Fallback */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#EADBCE] max-w-md mx-auto p-8">
            <Gift className="w-12 h-12 text-[#C59B27] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-serif font-bold text-[#14382C] mb-1">No gifts found</h3>
            <p className="text-xs text-slate-500 mb-4">
              We couldn't find items matching "{searchQuery}". We customize anything on WhatsApp!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-full bg-[#14382C] text-white text-xs font-medium hover:bg-[#0f2920] transition-colors"
            >
              View All Collections
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentTierIndex = activeTiers[product.id] ?? 0;
            const currentTier = product.tiers ? product.tiers[currentTierIndex] : null;
            const displayPrice = currentTier ? currentTier.price : product.priceDisplay;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EADBCE] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Image container with quick view trigger */}
                  <div
                    onClick={() => setQuickViewProduct(product)}
                    className="relative aspect-[4/3] overflow-hidden bg-[#F4EFE6] cursor-pointer"
                  >
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      aspectRatio="aspect-[4/3]"
                      className="w-full h-full"
                      imgClassName="group-hover:scale-105 transition-transform duration-500"
                      fallbackTitle={product.name}
                      categoryName={product.category}
                    />
                    
                    {/* Badge */}
                    {product.isPopular && (
                      <span className="absolute top-3 left-3 bg-[#14382C]/90 backdrop-blur-sm text-[#DFC066] text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wider uppercase border border-[#C59B27]/30 shadow-sm z-10">
                        Popular Choice
                      </span>
                    )}

                    {/* Official TGG Logo Hallmark Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-[#C59B27]/50 shadow-md flex items-center justify-center z-10 transition-transform group-hover:scale-105">
                      <img
                        src="/tgg_logo.png"
                        alt="TGG Official Hallmark"
                        className="w-7 h-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Quick View Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#14382C] text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Quick View &amp; Details</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="text-[#C59B27] font-medium tracking-wide uppercase text-[11px]">
                        {product.category}
                      </span>
                      <span className="font-semibold text-[#14382C] bg-[#F4EFE6] px-2.5 py-1 rounded-md">
                        {displayPrice}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3
                      onClick={() => setQuickViewProduct(product)}
                      className="text-xl font-serif font-bold text-[#14382C] mb-1.5 leading-snug cursor-pointer hover:text-[#C59B27] transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs italic text-[#C59B27] mb-3">
                      “{product.tagline}”
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features bullets */}
                    <div className="space-y-1.5 pt-2 border-t border-[#F4EFE6]">
                      {product.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-[#C59B27] mr-2 flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Size / Tier Selection if available */}
                    {product.tiers && product.tiers.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#F4EFE6]">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                          Available Sizes &amp; Price Range
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {product.tiers.map((t, idx) => {
                            const isSelected = idx === currentTierIndex;
                            return (
                              <button
                                key={idx}
                                onClick={(e) => handleTierSelect(product.id, idx, e)}
                                className={`text-left p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-[#14382C] bg-[#14382C]/5 ring-1 ring-[#14382C]'
                                    : 'border-[#EADBCE] bg-[#FBF9F5] hover:bg-white'
                                }`}
                              >
                                <div className="text-[10px] font-bold text-[#14382C] truncate">
                                  {t.size.replace(' (Premium)', '')}
                                </div>
                                <div className="text-[9px] text-slate-500 truncate">
                                  {t.price.replace('PKR ', '')}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 mt-2 flex items-center gap-2">
                  <button
                    onClick={() => onOrderProduct(product, currentTier?.size)}
                    className="flex-1 py-2.5 rounded-xl bg-[#14382C] text-white hover:bg-[#0f2920] font-medium text-xs tracking-wide transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                  >
                    <Gift className="w-3.5 h-3.5 text-[#DFC066] group-hover/btn:rotate-12 transition-transform" />
                    <span>Order on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="p-2.5 rounded-xl border border-[#EADBCE] text-[#14382C] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                    title="Quick preview"
                    aria-label="Quick preview"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-[#14382C] to-[#1B4332] text-[#FBF9F5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-[#DFC066]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Looking for a Completely Custom Creation?</h4>
              <p className="text-xs text-slate-300 font-light mt-0.5">
                Tell us your budget, theme, recipient's likes, and favorite colors — we source, craft, package, and deliver nationwide.
              </p>
            </div>
          </div>
          <a
            href="#order-form"
            className="px-6 py-2.5 rounded-full bg-[#DFC066] hover:bg-[#C59B27] text-[#14382C] text-xs font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow"
          >
            Customize Unique Gift
          </a>
        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onSelectForOrderForm={(prod, tier) => {
            onOrderProduct(prod, tier);
            setQuickViewProduct(null);
          }}
        />
      )}
    </section>
  );
};
