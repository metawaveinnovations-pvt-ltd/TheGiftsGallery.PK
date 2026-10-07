import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { Product } from '../types';
import { Gift, Check, Eye, Search, Sparkles, X, Heart, ShoppingBag, LayoutGrid, Rows3 } from 'lucide-react';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { OptimizedImage } from './OptimizedImage';

interface FeaturedGiftsProps {
  onOrderProduct: (product: Product, selectedTier?: string) => void;
  onCheckoutProduct?: (product: Product, selectedTier?: string) => void;
  externalSearchQuery?: string;
  onExternalSearchChange?: (query: string) => void;
  externalCategory?: string;
  onExternalCategoryChange?: (category: string) => void;
}

export const FeaturedGifts: React.FC<FeaturedGiftsProps> = ({
  onOrderProduct,
  onCheckoutProduct,
  externalSearchQuery,
  onExternalSearchChange,
  externalCategory,
  onExternalCategoryChange,
}) => {
  const { products, wishlistIds, toggleWishlist } = usePortal();
  const [internalCategory, setInternalCategory] = useState<string>('All');
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');
  const [activeTiers, setActiveTiers] = useState<Record<string, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileCompactGrid, setMobileCompactGrid] = useState<boolean>(true);

  const selectedCategory = externalCategory !== undefined ? externalCategory : internalCategory;
  const setSelectedCategory = (cat: string) => {
    setInternalCategory(cat);
    onExternalCategoryChange?.(cat);
  };

  const searchQuery =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (q: string) => {
    setInternalSearchQuery(q);
    onExternalSearchChange?.(q);
  };

  const categories = [
    'All',
    'Fresh Flowers',
    'Customized Gift Baskets',
    'Special Gifts',
    'Accessories',
    'Customized Packaging & Boxes',
    'Anniversary Gifts',
    'Birthday Gifts',
    'Personalized Gifts',
    'Snacks Basket',
    'Makeup Basket',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, selectedCategory, searchQuery]);

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') return products.length;
    return products.filter(
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
    <section id="gifts" className="py-10 min-[800px]:py-24 bg-[#FBF9F5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header with Unboxed Editorial Kicker */}
        <div className="text-center max-w-3xl mx-auto mb-6 min-[800px]:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>SIGNATURE BOUTIQUE CREATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-2.5 min-[800px]:mb-4 text-balance">
            Curated With Love &amp; Artistry
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-light max-w-2xl mx-auto">
            From anniversary gifts and birthday surprises to gourmet snacks baskets, makeup baskets, watches, wallets, bracelets, and bespoke luxury packaging across Pakistan.
          </p>
        </div>

        {/* Live Search & Mobile App View Density Switcher */}
        <div className="max-w-2xl mx-auto mb-5 min-[800px]:mb-8 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts, baskets, watches, makeup..."
              className="w-full min-h-[44px] pl-11 pr-10 py-2.5 rounded-full bg-white border border-[#EADBCE] text-sm text-[#1C2826] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14382C] focus:border-transparent shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile App Density Toggle (< 800px): 2-Col Compact App Grid vs Detailed Feed */}
          <div className="flex min-[800px]:hidden items-center bg-[#F4EFE6] p-1 rounded-full border border-[#EADBCE] shrink-0">
            <button
              type="button"
              onClick={() => setMobileCompactGrid(true)}
              aria-label="2-Column App Grid View"
              title="2-Column App Grid"
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                mobileCompactGrid
                  ? 'bg-[#14382C] text-[#DFC066] shadow-xs'
                  : 'text-slate-600 hover:text-[#14382C]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileCompactGrid(false)}
              aria-label="Detailed Card Feed View"
              title="Detailed Feed"
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                !mobileCompactGrid
                  ? 'bg-[#14382C] text-[#DFC066] shadow-xs'
                  : 'text-slate-600 hover:text-[#14382C]'
              }`}
            >
              <Rows3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs (Touch-optimized horizontal scroll strip) */}
        <div className="flex items-center justify-start min-[800px]:justify-center overflow-x-auto pb-3 mb-6 min-[800px]:mb-10 gap-2 no-scrollbar -mx-3.5 px-3.5 min-[800px]:mx-0 min-[800px]:px-0 touch-pan-x">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[42px] px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-95 touch-manipulation ${
                  selectedCategory === cat
                    ? 'bg-[#14382C] text-white shadow-sm'
                    : 'bg-[#F4EFE6] text-slate-700 hover:bg-[#EADBCE]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    selectedCategory === cat ? 'text-[#DFC066]' : 'text-slate-500'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty Search Result Fallback */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 min-[800px]:py-16 bg-white rounded-3xl border border-dashed border-[#EADBCE] max-w-md mx-auto p-6 min-[800px]:p-8">
            <Gift className="w-10 h-10 text-[#C59B27] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-serif font-bold text-[#14382C] mb-1">No gifts found</h3>
            <p className="text-xs text-slate-500 mb-4">
              We couldn't find items matching "{searchQuery}". We customize anything on WhatsApp!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="min-h-[44px] px-5 py-2 rounded-full bg-[#14382C] text-white text-xs font-semibold hover:bg-[#0f2920] transition-colors cursor-pointer"
            >
              View All Collections
            </button>
          </div>
        )}

        {/* Product Cards Grid: Adaptive 2-Col Mobile App Grid (<800px when compact) + 3-Col Desktop Gallery */}
        <div
          className={`grid ${
            mobileCompactGrid ? 'grid-cols-2 gap-3 sm:gap-5' : 'grid-cols-1 gap-5'
          } min-[800px]:grid-cols-2 lg:grid-cols-3 min-[800px]:gap-8`}
        >
          {filteredProducts.map((product) => {
            const currentTierIndex = activeTiers[product.id] ?? 0;
            const currentTier = product.tiers ? product.tiers[currentTierIndex] : null;
            const displayPrice = currentTier ? currentTier.price : product.priceDisplay;
            const isWishlisted = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EADBCE] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5"
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
                    
                    {/* Subtle Single Text Tag */}
                    {product.isPopular && (
                      <span className="absolute top-2.5 left-2.5 bg-[#14382C]/90 backdrop-blur-sm text-[#DFC066] text-[10px] min-[800px]:text-[11px] font-semibold px-2 py-0.5 rounded-md tracking-wider uppercase z-10">
                        Popular
                      </span>
                    )}

                    {/* Floating Wishlist Button on Mobile App Card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      className={`min-[800px]:hidden absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm z-10 transition-transform active:scale-90 ${
                        isWishlisted
                          ? 'bg-rose-50/95 text-rose-600 border border-rose-200'
                          : 'bg-white/90 text-slate-600 border border-[#EADBCE]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Official TGG Logo Hallmark Badge (Desktop) */}
                    <div className="hidden min-[800px]:flex absolute top-3 right-3 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-[#C59B27]/50 shadow-sm items-center justify-center z-10">
                      <img
                        src="/tgg_logo.png"
                        alt="TGG Official Hallmark"
                        className="w-7 h-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Quick View Overlay on Hover */}
                    <div className="hidden min-[800px]:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#14382C] text-xs font-semibold shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Quick View &amp; Details</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className={`${mobileCompactGrid ? 'p-3 sm:p-5' : 'p-4 sm:p-6'} min-[800px]:p-6`}>
                    {/* Clean Unboxed Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] min-[800px]:text-xs text-slate-500 mb-1.5">
                      <span className="text-[#C59B27] font-semibold tracking-wide uppercase truncate max-w-[60%]">
                        {product.category}
                      </span>
                      <span className="font-mono font-bold text-[#14382C] tabular-nums">
                        {displayPrice.replace('PKR ', 'Rs. ')}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3
                      onClick={() => setQuickViewProduct(product)}
                      className={`${
                        mobileCompactGrid ? 'text-sm sm:text-lg line-clamp-1' : 'text-lg sm:text-xl'
                      } min-[800px]:text-xl font-serif font-bold text-[#14382C] mb-1 leading-snug cursor-pointer hover:text-[#C59B27] transition-colors`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={`text-[11px] min-[800px]:text-xs italic text-[#9E7B1A] mb-2 ${
                        mobileCompactGrid ? 'line-clamp-1' : ''
                      }`}
                    >
                      “{product.tagline}”
                    </p>

                    {/* Description (Hidden on ultra-compact 2-col mobile view to keep cards scannable, visible on Detailed & Desktop) */}
                    <p
                      className={`${
                        mobileCompactGrid ? 'hidden min-[800px]:block' : 'block'
                      } text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2`}
                    >
                      {product.description}
                    </p>

                    {/* Features bullets (Visible on Detailed & Desktop) */}
                    <div
                      className={`${
                        mobileCompactGrid ? 'hidden min-[800px]:block' : 'block'
                      } space-y-1.5 pt-2 border-t border-[#F4EFE6]`}
                    >
                      {product.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-[#C59B27] mr-2 flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Size / Tier Selection if available */}
                    {product.tiers && product.tiers.length > 0 && (
                      <div className="mt-2.5 min-[800px]:mt-4 pt-2.5 min-[800px]:pt-3 border-t border-[#F4EFE6]">
                        <div className="hidden min-[800px]:block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                          Available Sizes &amp; Price Range
                        </div>
                        <div className="grid grid-cols-3 gap-1 min-[800px]:gap-1.5">
                          {product.tiers.map((t, idx) => {
                            const isSelected = idx === currentTierIndex;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => handleTierSelect(product.id, idx, e)}
                                className={`text-left p-1 min-[800px]:p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-[#14382C] bg-[#14382C]/5 ring-1 ring-[#14382C]'
                                    : 'border-[#EADBCE] bg-[#FBF9F5] hover:bg-white'
                                }`}
                              >
                                <div className="text-[9px] min-[800px]:text-[10px] font-bold text-[#14382C] truncate">
                                  {t.size.replace(' (Premium)', '')}
                                </div>
                                <div className="text-[8px] min-[800px]:text-[9px] font-mono text-slate-500 tabular-nums truncate">
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
                <div
                  className={`${
                    mobileCompactGrid ? 'p-3 pt-0 sm:p-5 sm:pt-0' : 'p-4 pt-0 sm:p-6 sm:pt-0'
                  } min-[800px]:p-6 min-[800px]:pt-0 mt-1 flex items-center gap-1.5 min-[800px]:gap-2`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onCheckoutProduct
                        ? onCheckoutProduct(product, currentTier?.size)
                        : onOrderProduct(product, currentTier?.size)
                    }
                    className="flex-1 min-h-[40px] min-[800px]:min-h-[44px] py-2 px-2.5 min-[800px]:px-3 rounded-xl bg-[#14382C] text-white hover:bg-[#0f2920] font-semibold text-[11px] min-[800px]:text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#DFC066] shrink-0" />
                    <span className="truncate">
                      {mobileCompactGrid ? 'Order' : 'Order & Checkout'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOrderProduct(product, currentTier?.size)}
                    className={`${
                      mobileCompactGrid ? 'hidden sm:flex' : 'flex'
                    } min-[800px]:flex min-h-[40px] min-[800px]:min-h-[44px] px-3 py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 text-[#14382C] font-semibold text-xs transition-colors cursor-pointer items-center justify-center gap-1 active:scale-95 whitespace-nowrap`}
                    title="Customize in Order Form"
                  >
                    <Gift className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                    <span className="hidden sm:inline">Customize</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`hidden min-[800px]:flex min-h-[44px] min-w-[40px] p-2.5 rounded-xl border transition-colors cursor-pointer items-center justify-center active:scale-95 ${
                      isWishlisted
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-[#EADBCE] text-slate-500 hover:bg-[#F4EFE6]'
                    }`}
                    title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
                    aria-label="Save to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(product)}
                    className="min-h-[40px] min-w-[38px] min-[800px]:min-h-[44px] min-[800px]:min-w-[40px] p-2 rounded-xl border border-[#EADBCE] text-[#14382C] hover:bg-[#F4EFE6] transition-colors cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
                    title="Quick preview"
                    aria-label="Quick preview"
                  >
                    <Eye className="w-3.5 h-3.5 min-[800px]:w-4 min-[800px]:h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-10 min-[800px]:mt-14 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#14382C] to-[#1B4332] text-[#FBF9F5] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-md">
          <div className="flex items-center gap-3.5 sm:gap-4 text-left">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC066]" />
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-white">
                Looking for a Completely Custom Creation?
              </h4>
              <p className="text-xs text-slate-300 font-light mt-0.5">
                Tell us your budget, theme, recipient's likes, and favorite colors — we source, craft, package, and deliver nationwide.
              </p>
            </div>
          </div>
          <a
            href="#order-form"
            className="w-full md:w-auto min-h-[44px] flex items-center justify-center px-6 py-2.5 rounded-full bg-[#DFC066] hover:bg-[#C59B27] text-[#14382C] text-xs font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow"
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
          onCheckoutProduct={(prod, tier) => {
            if (onCheckoutProduct) {
              onCheckoutProduct(prod, tier);
            } else {
              onOrderProduct(prod, tier);
            }
            setQuickViewProduct(null);
          }}
        />
      )}
    </section>
  );
};
