import React, { useState, useEffect } from 'react';
import { OrderFormData, Product } from '../types';
import { BRAND_INFO, PRODUCTS } from '../data/products';
import {
  Gift,
  MessageCircle,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Send,
  Heart,
} from 'lucide-react';
import { Logo } from './Logo';
import { OptimizedImage } from './OptimizedImage';

interface OrderFormProps {
  initialProduct?: { product: Product; selectedTier?: string } | null;
  initialOccasion?: string | null;
  onClearInitialProduct?: () => void;
}

const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Multan',
  'Faisalabad',
  'Sialkot',
  'Quetta',
  'Gujranwala',
];

export const OrderForm: React.FC<OrderFormProps> = ({
  initialProduct,
  initialOccasion,
  onClearInitialProduct,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    whatsappNumber: '',
    instagramHandle: '',
    giftType: 'Birthday Gift',
    giftFor: 'Her',
    budgetRange: 'PKR 5,000 – 10,000',
    deliveryDate: '',
    deliveryTime: '4 PM – 7 PM',
    recipientName: '',
    personalMessage: '',
    specialRequests: '',
    city: 'Lahore',
    deliveryAddress: '',
  });

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync when initialOccasion prop changes
  useEffect(() => {
    if (initialOccasion) {
      let mappedType = `${initialOccasion} Gift`;
      if (initialOccasion.toLowerCase().includes('just because')) {
        mappedType = 'Surprise Gift';
      }
      setFormData((prev) => ({
        ...prev,
        giftType: mappedType,
      }));
    }
  }, [initialOccasion]);

  // Sync when initialProduct prop changes from clicking "Order This Gift"
  useEffect(() => {
    if (initialProduct) {
      const { product, selectedTier: tier } = initialProduct;
      setSelectedProductId(product.id);
      setSelectedTier(tier || '');

      let targetGiftType = 'Gift Hamper';
      if (product.category.includes('Him')) targetGiftType = 'Special Gifts for Him';
      if (product.category.includes('Personalized')) targetGiftType = 'Personalized Gift';
      if (product.category.includes('Basket')) targetGiftType = 'Gift Hamper';

      // Set budget range based on product price
      let budget = product.priceDisplay;
      if (tier && product.tiers) {
        const found = product.tiers.find((t) => t.size === tier);
        if (found) budget = found.price;
      }

      setFormData((prev) => ({
        ...prev,
        giftType: targetGiftType,
        budgetRange: budget,
        specialRequests: `Interested in: ${product.name}${tier ? ` (${tier} Tier)` : ''}. ` + (prev.specialRequests || ''),
      }));

      // Scroll to order form smoothly
      const element = document.getElementById('order-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialProduct]);

  const giftTypes = [
    'Birthday Gift',
    'Anniversary Gift',
    'Special Gifts for Him',
    'Romantic Gift',
    'Customized Gift Basket',
    'Graduation Gift',
    'Wedding Gift',
    'Corporate Gift',
    'Personalized Gift',
    'Surprise Gift',
    'Other Bespoke Idea',
  ];

  const giftForOptions = [
    'Her',
    'Him',
    'Spouse / Partner',
    'Mother / Father',
    'Friend / Bestie',
    'Sibling',
    'Colleague / Boss',
    'Child',
    'Other',
  ];

  const budgetOptions = [
    'Under PKR 2,000',
    'PKR 2,000 – 5,000',
    'PKR 5,000 – 10,000',
    'PKR 10,000 – 18,000',
    'PKR 18,000 – 28,000+',
    'Not Sure — Recommend Something',
  ];

  const deliveryTimes = [
    '1 PM – 4 PM (Standard Afternoon)',
    '4 PM – 7 PM (Standard Evening)',
    '7 PM – 10 PM (Standard Night)',
    '12 AM Midnight Surprise (Special Surcharge)',
  ];

  const handleCitySelect = (cityName: string) => {
    setIsOtherCity(false);
    setFormData((prev) => ({ ...prev, city: cityName }));
  };

  const handleOtherCityClick = () => {
    setIsOtherCity(true);
    setFormData((prev) => ({ ...prev, city: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp Number is required.';
    } else if (formData.whatsappNumber.replace(/\D/g, '').length < 10) {
      newErrors.whatsappNumber = 'Please enter a valid phone number (min 10 digits).';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Preferred delivery date is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Delivery city is required.';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery area / address is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateWhatsAppMessage = () => {
    const selectedProd = PRODUCTS.find((p) => p.id === selectedProductId);
    const prodDetails = selectedProd
      ? `*Selected Product:* ${selectedProd.name}${selectedTier ? ` (${selectedTier})` : ''}\n`
      : '';

    return `Hello The Gift Gallery! 🎁
I would like to place a custom gift order.

*Name:* ${formData.fullName}
*WhatsApp:* ${formData.whatsappNumber}
${formData.instagramHandle ? `*Instagram:* ${formData.instagramHandle}\n` : ''}${prodDetails}*Occasion / Gift Type:* ${formData.giftType}
*Gift For:* ${formData.giftFor}
*Budget Range:* ${formData.budgetRange}
*Preferred Delivery Date:* ${formData.deliveryDate}
*Preferred Delivery Slot:* ${formData.deliveryTime}
*Delivery City:* ${formData.city}
*Delivery Address / Area:* ${formData.deliveryAddress}
${formData.recipientName ? `*Recipient's Name:* ${formData.recipientName}\n` : ''}${formData.personalMessage ? `*Personal Card Message:*\n"${formData.personalMessage}"\n` : ''}${formData.specialRequests ? `*Special Requests / Theme / Notes:*\n${formData.specialRequests}\n` : ''}
Please confirm availability and booking details. Thank you!`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      const element = document.getElementById('order-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    window.open(`${BRAND_INFO.whatsappUrl}?text=${text}`, '_blank');
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      whatsappNumber: '',
      instagramHandle: '',
      giftType: 'Birthday Gift',
      giftFor: 'Her',
      budgetRange: 'PKR 5,000 – 10,000',
      deliveryDate: '',
      deliveryTime: '4 PM – 7 PM',
      recipientName: '',
      personalMessage: '',
      specialRequests: '',
      city: 'Lahore',
      deliveryAddress: '',
    });
    setSelectedProductId('');
    setSelectedTier('');
    setIsOtherCity(false);
    setErrors({});
    setIsSubmitted(false);
    if (onClearInitialProduct) onClearInitialProduct();
  };

  return (
    <section id="order-form" className="py-16 md:py-24 bg-[#F5F0E6]/60 border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-2">
            DIRECT CONCIERGE BOOKING
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-4 text-balance">
            Place Your Gift Order
          </h2>
          <p className="text-base text-slate-600 font-light max-w-xl mx-auto">
            Fill out your details below to generate a formatted order request sent directly to our artisan concierge on WhatsApp.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-xs">✦</span>
            <span className="h-[1px] w-12 bg-[#C59B27]/40" />
          </div>
        </div>

        {/* Selected Product Banner if applicable */}
        {selectedProductId && (() => {
          const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId);
          return (
            <div className="max-w-4xl mx-auto mb-8 bg-[#14382C] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C59B27]/40 shadow-md animate-in fade-in">
              <div className="flex items-center gap-3 text-center sm:text-left">
                {selectedProduct?.image ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#C59B27]/40 shrink-0">
                    <OptimizedImage
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      aspectRatio="aspect-square"
                      className="w-full h-full"
                      priority={true}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-[#DFC066] flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#DFC066] font-semibold block">
                    Selected Item For Order
                  </span>
                  <span className="font-serif text-lg font-bold">
                    {selectedProduct?.name}
                    {selectedTier && ` · ${selectedTier} Tier`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedProductId('');
                  setSelectedTier('');
                  if (onClearInitialProduct) onClearInitialProduct();
                }}
                className="text-xs font-medium text-emerald-200 hover:text-white underline cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          );
        })()}

        {/* Main Content: Form OR Success State */}
        {isSubmitted ? (
          /* Success / Review State */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#C59B27]/40 shadow-xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#14382C] text-[#DFC066] flex items-center justify-center mx-auto mb-6 shadow-md border border-[#C59B27]/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <Logo variant="mark" size={80} className="mb-4" />

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#14382C] mb-2">
              Your Order Request Is Ready!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 font-light">
              We have generated your customized order summary. Click below to launch WhatsApp and finalize your booking with our team.
            </p>

            {/* Structured Summary Preview Box */}
            <div className="bg-[#FBF9F5] rounded-2xl p-5 border border-[#EADBCE] text-left text-xs sm:text-sm text-slate-700 font-mono mb-6 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
              {generateWhatsAppMessage()}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#14382C] hover:bg-[#0D261E] shadow-md hover:shadow-lg transition-all duration-200 border border-[#C59B27]/40 active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#DFC066]" />
                <span>Send via WhatsApp Now</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#14382C]" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Order Text'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#14382C] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify or Place Another Order</span>
            </button>
          </div>
        ) : (
          /* Interactive Order Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            
            {/* Form Column (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#EADBCE] shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Contact Information */}
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#14382C] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                      1
                    </span>
                    <span>Your Contact Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ayesha Khan"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                          errors.fullName
                            ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                            : 'border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        WhatsApp Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0300 1234567"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                          errors.whatsappNumber
                            ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                            : 'border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5]'
                        }`}
                      />
                      {errors.whatsappNumber && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.whatsappNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* Instagram Handle (Optional) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Instagram Handle <span className="text-slate-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. @ayesha_k"
                        value={formData.instagramHandle}
                        onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Gift Requirements */}
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#14382C] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                      2
                    </span>
                    <span>Gift Preferences & Occasion</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Occasion / Gift Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Occasion / Gift Type
                      </label>
                      <select
                        value={formData.giftType}
                        onChange={(e) => setFormData({ ...formData, giftType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      >
                        {giftTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Gift For */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Who is this gift for?
                      </label>
                      <select
                        value={formData.giftFor}
                        onChange={(e) => setFormData({ ...formData, giftFor: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      >
                        {giftForOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Budget Range */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Estimated Budget Range (PKR)
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      >
                        {budgetOptions.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Delivery Details */}
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#14382C] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                      3
                    </span>
                    <span>Nationwide Delivery Information</span>
                  </h3>

                  {/* Fast Pakistani City Selector */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Select Delivery City <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PAKISTANI_CITIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleCitySelect(c)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            formData.city === c && !isOtherCity
                              ? 'bg-[#14382C] text-white shadow-sm'
                              : 'bg-[#FBF9F5] text-slate-700 border border-slate-200 hover:border-[#C59B27]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleOtherCityClick}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isOtherCity
                            ? 'bg-[#14382C] text-white shadow-sm'
                            : 'bg-[#FBF9F5] text-slate-700 border border-slate-200 hover:border-[#C59B27]'
                        }`}
                      >
                        Other City...
                      </button>
                    </div>

                    {isOtherCity && (
                      <input
                        type="text"
                        placeholder="Enter your city name in Pakistan..."
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full mt-2 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      />
                    )}

                    {errors.city && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Delivery Date */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Preferred Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                          errors.deliveryDate
                            ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                            : 'border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5]'
                        }`}
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Requires 1–2 days prior notice.
                      </span>
                    </div>

                    {/* Delivery Timing */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Delivery Timing Slot
                      </label>
                      <select
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      >
                        {deliveryTimes.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delivery Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Delivery Address / Area in {formData.city || 'City'} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="House / Apartment #, Street, Phase / Block, Landmark..."
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                          errors.deliveryAddress
                            ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                            : 'border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5]'
                        }`}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.deliveryAddress}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Personalization & Message */}
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#14382C] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                      4
                    </span>
                    <span>Personal Touch & Sentiment</span>
                  </h3>

                  <div className="space-y-4">
                    {/* Recipient's Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Recipient’s Name <span className="text-slate-500 font-normal">(For customized card/tag)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zainab"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      />
                    </div>

                    {/* Card Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Card Message <span className="text-slate-500 font-normal">(Handwritten inside sentiment card)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Write your heartfelt wish or sentiment here..."
                        value={formData.personalMessage}
                        onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      />
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Special Requests, Color Themes or Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Preferred ribbon colors (emerald green / gold / blush), chocolate preferences, custom items..."
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#C59B27] bg-[#FBF9F5] text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-full text-sm font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] shadow-md hover:shadow-lg transition-all duration-200 border border-[#C59B27]/40 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#DFC066]" />
                    <span>Review & Send Order to WhatsApp Concierge</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2.5">
                    No immediate online payment taken. We connect directly on WhatsApp to confirm details.
                  </p>
                </div>

              </form>
            </div>

            {/* Sidebar Column: Live Order Estimator & Trust Reassurance (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary & Estimator Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#C59B27]/40 shadow-sm sticky top-24">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Live Booking Summary</span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 pb-4 border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-500">Occasion:</span>
                    <span className="font-semibold text-[#14382C] text-right">{formData.giftType}</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-500">Recipient:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {formData.recipientName || formData.giftFor}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-500">City / Coverage:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {formData.city ? `${formData.city} (PK)` : 'Nationwide Pakistan'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-500">Delivery Date:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {formData.deliveryDate || 'Select Date (1–2 days notice)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-500">Timing Slot:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {formData.deliveryTime.split('(')[0]}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-900">Estimated Budget:</span>
                    <span className="font-serif font-bold text-base text-[#14382C] tabular-nums text-right">
                      {formData.budgetRange}
                    </span>
                  </div>
                </div>

                {/* TGG Reassurance Checklist */}
                <div className="mt-4 space-y-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#14382C] shrink-0" />
                    <span>Hand-assembled with genuine boutique care</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#14382C] shrink-0" />
                    <span>Free handwritten sentiment card included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#14382C] shrink-0" />
                    <span>100% advance payment after design review</span>
                  </div>
                </div>

                {/* Direct WhatsApp Concierge Fast Connect */}
                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500 mb-2">
                    Prefer direct voice note or text on WhatsApp?
                  </p>
                  <a
                    href={BRAND_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] border border-[#C59B27]/40 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#14382C]" />
                    <span>Chat on WhatsApp ({BRAND_INFO.whatsappNumber})</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
