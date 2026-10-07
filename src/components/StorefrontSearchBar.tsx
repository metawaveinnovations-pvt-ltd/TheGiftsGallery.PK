import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Product, Category, Occasion } from '../types';
import { OptimizedImage } from './OptimizedImage';
import {
  Search,
  X,
  Gift,
  Layers,
  CalendarHeart,
  Sparkles,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

interface StorefrontSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSelectProductForOrder: (product: Product) => void;
  onSelectProductForCheckout: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
  onSelectOccasion: (occasionName: string) => void;
}

type SearchScope = 'all' | 'products' | 'categories' | 'occasions';

const QUICK_SEARCH_TERMS = [
  'Fresh Flowers',
  'Bouquets',
  'Anniversary',
  'Gift Baskets',
  'Lindt Lindor',
  'Watches',
  'Birthday',
  'Wallets',
  'Bracelets',
  'Packaging',
];

export const StorefrontSearchBar: React.FC<StorefrontSearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSelectProductForOrder,
  onSelectProductForCheckout,
  onSelectCategory,
  onSelectOccasion,
}) => {
  const { products, categories, occasions } = usePortal();
  const [scope, setScope] = useState<SearchScope>('all');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      } else if (e.key === 'Escape') {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchedProducts = useMemo<Product[]>(() => {
    if (!normalizedQuery) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.description.toLowerCase().includes(normalizedQuery) ||
        p.tagline.toLowerCase().includes(normalizedQuery) ||
        p.category.toLowerCase().includes(normalizedQuery) ||
        p.tags?.some((t) => t.toLowerCase().includes(normalizedQuery)) ||
        p.features.some((f) => f.toLowerCase().includes(normalizedQuery))
    );
  }, [products, normalizedQuery]);

  const matchedCategories = useMemo<Category[]>(() => {
    if (!normalizedQuery) return [];
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(normalizedQuery) ||
        c.subtitle.toLowerCase().includes(normalizedQuery) ||
        c.description.toLowerCase().includes(normalizedQuery)
    );
  }, [categories, normalizedQuery]);

  const matchedOccasions = useMemo<Occasion[]>(() => {
    if (!normalizedQuery) return [];
    return occasions.filter(
      (o) =>
        o.name.toLowerCase().includes(normalizedQuery) ||
        o.tagline.toLowerCase().includes(normalizedQuery)
    );
  }, [occasions, normalizedQuery]);

  const totalMatches =
    (scope === 'all' || scope === 'products' ? matchedProducts.length : 0) +
    (scope === 'all' || scope === 'categories' ? matchedCategories.length : 0) +
    (scope === 'all' || scope === 'occasions' ? matchedOccasions.length : 0);

  const showResultsPanel = normalizedQuery.length > 0 && (isFocused || totalMatches > 0);

  return (
    <section
      id="storefront-search"
      aria-label="Storefront Search"
      className="relative z-30 bg-[#FBF9F5] border-b border-[#EADBCE]/80 py-5 sm:py-7 scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#EADBCE] shadow-[0_10px_30px_-15px_rgba(20,56,44,0.1)] transition-all duration-200 focus-within:border-[#C59B27]">
          {/* Search Input & Scope Selector Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#C59B27] pointer-events-none" />
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => {
                  onSearchQueryChange(e.target.value);
                  setIsFocused(true);
                }}
                placeholder="Search products, gift categories, or occasions by name or description..."
                aria-label="Search products, occasions, or categories by name or description"
                className="w-full min-h-[42px] pl-10 pr-20 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs sm:text-sm text-[#1C2826] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#14382C] transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    onSearchQueryChange('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2.5 px-2 py-1 rounded-md text-[11px] font-medium text-slate-500 hover:text-[#14382C] hover:bg-[#F4EFE6] flex items-center gap-1 transition-colors cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 text-[10px] font-mono text-slate-400 pointer-events-none">
                  ⌘K
                </span>
              )}
            </div>

            {/* Scope Filter Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-[#F4EFE6] rounded-xl border border-[#EADBCE]/80 overflow-x-auto no-scrollbar shrink-0">
              {(
                [
                  { id: 'all', label: 'All', count: matchedProducts.length + matchedCategories.length + matchedOccasions.length },
                  { id: 'products', label: 'Products', count: matchedProducts.length },
                  { id: 'categories', label: 'Categories', count: matchedCategories.length },
                  { id: 'occasions', label: 'Occasions', count: matchedOccasions.length },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScope(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    scope === tab.id
                      ? 'bg-[#14382C] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-[#14382C] hover:bg-white/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  {normalizedQuery && (
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        scope === tab.id ? 'text-[#DFC066]' : 'text-slate-400'
                      }`}
                    >
                      ({tab.count})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Suggestion Terms Strip */}
          <div className="mt-2.5 pt-2 border-t border-[#EADBCE]/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-slate-400 font-medium shrink-0 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C59B27]" />
              <span>Popular:</span>
            </span>
            {QUICK_SEARCH_TERMS.map((term) => {
              const isActive = searchQuery.toLowerCase() === term.toLowerCase();
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    onSearchQueryChange(isActive ? '' : term);
                    setIsFocused(true);
                  }}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#14382C] text-[#DFC066]'
                      : 'text-slate-600 hover:text-[#14382C] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {term}
                </button>
              );
            })}
          </div>

          {/* Live Multi-Entity Search Results Panel */}
          {showResultsPanel && (
            <div className="mt-3 pt-3 border-t border-[#EADBCE] space-y-4 max-h-[65vh] overflow-y-auto pr-1 animate-in fade-in duration-150">
              {totalMatches === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-serif font-bold text-[#14382C]">
                    No matching products, categories, or occasions for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for &ldquo;Anniversary&rdquo;, &ldquo;Basket&rdquo;, &ldquo;Watch&rdquo;, &ldquo;Birthday&rdquo;, or &ldquo;Makeup&rdquo;.
                  </p>
                </div>
              ) : (
                <>
                  {/* 1. Matching Products */}
                  {(scope === 'all' || scope === 'products') && matchedProducts.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B27] flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5" />
                          <span>Matching Products ({matchedProducts.length})</span>
                        </span>
                        <a
                          href="#gifts"
                          onClick={() => setIsFocused(false)}
                          className="text-[11px] font-semibold text-[#14382C] hover:underline"
                        >
                          View in Catalog ↓
                        </a>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {matchedProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-2.5 rounded-xl bg-[#FBF9F5] hover:bg-[#F4EFE6]/90 border border-[#EADBCE] flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#EADBCE]">
                                <OptimizedImage
                                  src={product.image}
                                  alt={product.name}
                                  aspectRatio="aspect-square"
                                  className="w-full h-full"
                                  fallbackTitle={product.name}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9E7B1A] truncate">
                                  {product.category}
                                </div>
                                <h4 className="text-xs sm:text-sm font-serif font-bold text-[#14382C] truncate">
                                  {product.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {product.description}
                                </p>
                                <div className="text-xs font-mono font-bold text-[#14382C] mt-0.5 tabular-nums">
                                  {product.priceDisplay}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsFocused(false);
                                  onSelectProductForCheckout(product);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#14382C] hover:bg-[#0D261E] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <ShoppingBag className="w-3 h-3 text-[#DFC066]" />
                                <span>Buy</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsFocused(false);
                                  onSelectProductForOrder(product);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EADBCE] text-[#14382C] border border-[#EADBCE] text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Customize
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Matching Categories */}
                  {(scope === 'all' || scope === 'categories') && matchedCategories.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B27] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Matching Categories ({matchedCategories.length})</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {matchedCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setIsFocused(false);
                              onSelectCategory(cat.name);
                            }}
                            className="text-left p-3 rounded-xl bg-[#FBF9F5] hover:bg-[#F4EFE6] border border-[#EADBCE] hover:border-[#C59B27] transition-all group cursor-pointer flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-serif font-bold text-[#14382C] group-hover:text-[#C59B27] transition-colors">
                                {cat.name}
                              </div>
                              <div className="text-[11px] font-medium text-[#9E7B1A] truncate">
                                {cat.subtitle}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                {cat.description}
                              </p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C59B27] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Matching Occasions */}
                  {(scope === 'all' || scope === 'occasions') && matchedOccasions.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B27] flex items-center gap-1.5">
                          <CalendarHeart className="w-3.5 h-3.5" />
                          <span>Matching Occasions ({matchedOccasions.length})</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {matchedOccasions.map((occ) => (
                          <button
                            key={occ.id}
                            type="button"
                            onClick={() => {
                              setIsFocused(false);
                              onSelectOccasion(occ.name);
                            }}
                            className="text-left p-3 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white border border-[#C59B27]/40 transition-all group cursor-pointer flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-serif font-bold text-[#DFC066]">
                                {occ.name}
                              </div>
                              <p className="text-[11px] text-emerald-100/80 line-clamp-2 mt-0.5">
                                {occ.tagline}
                              </p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#DFC066] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
