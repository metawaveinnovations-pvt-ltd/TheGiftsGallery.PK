import React, { useState } from 'react';
import { Product } from '../types';
import { BRAND_INFO } from '../data/products';
import { X, Check, MessageCircle, Gift, ShieldCheck, Sparkles } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectForOrderForm: (product: Product, tierSize?: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onSelectForOrderForm,
}) => {
  if (!product) return null;

  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const currentTier = product.tiers ? product.tiers[selectedTierIndex] : null;
  const currentPrice = currentTier ? currentTier.price : product.priceDisplay;

  // Build WhatsApp text for this specific product
  const getWhatsAppLink = () => {
    const tierText = currentTier ? ` (${currentTier.size} - ${currentTier.price})` : '';
    const message = `Hello The Gift Gallery! 🎁\nI am interested in ordering:\n*Product:* ${product.name}${tierText}\n*Category:* ${product.category}\n\nPlease share details and availability. Thank you!`;
    return `${BRAND_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#C59B27]/40 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-black hover:bg-white shadow-sm flex items-center justify-center transition-colors border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Product Imagery (5 cols) */}
          <div className="md:col-span-5 relative bg-[#F5F0E6] flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[460px] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              aspectRatio="aspect-square md:aspect-[4/5]"
              className="w-full h-full max-h-[460px]"
              priority={true}
              fallbackTitle={product.name}
              categoryName={product.category}
            />
            {product.isPopular && (
              <span className="absolute top-4 left-4 bg-[#14382C] text-[#DFC066] text-xs font-semibold px-3 py-1 rounded-full shadow-md border border-[#C59B27]/40 z-10">
                Signature Choice
              </span>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white z-10">
              <span className="text-[11px] uppercase tracking-wider text-[#DFC066] font-semibold">
                Authentic Handcrafting
              </span>
              <p className="text-xs text-white/90 font-light">
                Assembled fresh with personalized note card
              </p>
            </div>
          </div>

          {/* Right Column: Details & Customization (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#9E7B1A] font-medium flex items-center gap-1.5">
                  <img src="/tgg_logo.png" alt="TGG Logo" className="w-5 h-auto object-contain inline" referrerPolicy="no-referrer" />
                  <span>The Gift Gallery</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>Nationwide PK</span>
              </div>

              {/* Title & Tagline */}
              <h2 id="quick-view-title" className="text-2xl sm:text-3xl font-serif font-bold text-[#14382C] mb-1.5 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm italic text-[#C59B27] mb-4">
                “{product.tagline}”
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-light">
                {product.description}
              </p>

              {/* Size / Tier Selection if available */}
              {product.tiers && product.tiers.length > 0 && (
                <div className="mb-6 bg-white rounded-2xl p-4 border border-[#EADBCE]">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-slate-800">
                      Choose Presentation Size:
                    </span>
                    <span className="text-xs text-[#9E7B1A] font-medium">
                      {currentTier?.size} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {product.tiers.map((tier, idx) => (
                      <button
                        key={tier.size}
                        onClick={() => setSelectedTierIndex(idx)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          selectedTierIndex === idx
                            ? 'bg-[#14382C] text-white border-[#14382C] shadow-sm'
                            : 'bg-[#FBF9F5] text-slate-700 border-slate-200 hover:border-[#C59B27]'
                        }`}
                      >
                        <span className="font-bold">{tier.size.replace(' (Premium)', '')}</span>
                        <span className={`text-[10px] ${selectedTierIndex === idx ? 'text-[#DFC066]' : 'text-slate-500'}`}>
                          {tier.price.split('–')[0].replace('PKR ', '')}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Tier Budget Range:</span>
                    <span className="text-sm font-serif font-bold text-[#14382C] tabular-nums">
                      {currentPrice}
                    </span>
                  </div>
                </div>
              )}

              {/* What is Included Bullets */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Package Features & Inclusions:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-100">
                      <Check className="w-3.5 h-3.5 text-[#14382C] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Callout */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-6 bg-[#F5F0E6] p-2.5 rounded-xl border border-[#EADBCE]/70">
                <ShieldCheck className="w-4 h-4 text-[#14382C] shrink-0" />
                <span>Requires 1–2 days advance booking. Delivery nationwide across Pakistan.</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#EADBCE] flex flex-col sm:flex-row items-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/50 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#14382C]" />
                <span>Order on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  onSelectForOrderForm(product, currentTier?.size);
                  onClose();
                }}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-[#14382C] hover:bg-[#0D261E] border border-[#C59B27]/40 shadow-sm transition-all active:scale-[0.98]"
              >
                <Gift className="w-4 h-4 text-[#DFC066]" />
                <span>Customize in Form</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
