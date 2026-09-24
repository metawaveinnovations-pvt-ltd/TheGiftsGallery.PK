import React, { useState, useEffect } from 'react';
import { OrderFormData, Product } from '../types';
import { BRAND_INFO } from '../data/products';
import { Gift, MessageCircle, CheckCircle2, RotateCcw, Copy, Check, AlertCircle, Calendar, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface OrderFormProps {
  initialProduct?: { product: Product; selectedTier?: string } | null;
  onClearInitialProduct?: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialProduct, onClearInitialProduct }) => {
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
    city: '',
    deliveryAddress: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync when initialProduct prop changes from clicking "Order This Gift"
  useEffect(() => {
    if (initialProduct) {
      const { product, selectedTier } = initialProduct;
      let targetGiftType = 'Gift Hamper';
      if (product.category.includes('Him')) targetGiftType = 'Romantic Gift';
      if (product.category.includes('Personalized')) targetGiftType = 'Personalized Gift';
      if (product.category.includes('Basket')) targetGiftType = 'Gift Hamper';

      setFormData((prev) => ({
        ...prev,
        giftType: targetGiftType,
        specialRequests: `Interested in: ${product.name}${selectedTier ? ` (${selectedTier} Tier)` : ''}. ` + (prev.specialRequests || ''),
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
    'Romantic Gift',
    'Graduation Gift',
    'Wedding Gift',
    'Corporate Gift',
    'Personalized Gift',
    'Surprise Gift',
    'Gift Hamper',
    'Other',
  ];

  const giftForOptions = [
    'Her',
    'Him',
    'Child',
    'Friend',
    'Family',
    'Partner',
    'Colleague',
    'Other',
  ];

  const budgetOptions = [
    'Under PKR 2,000',
    'PKR 2,000 – 5,000',
    'PKR 5,000 – 10,000',
    'PKR 10,000+',
    'Not Sure — Recommend Something',
  ];

  const deliveryTimes = [
    '1 PM – 4 PM',
    '4 PM – 7 PM',
    '7 PM – 10 PM',
    'Special / Midnight Delivery',
  ];

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
    return `Hello The Gift Gallery! 🎁
I'd like to place a gift order.

*Name:* ${formData.fullName}
*WhatsApp:* ${formData.whatsappNumber}
${formData.instagramHandle ? `*Instagram:* ${formData.instagramHandle}\n` : ''}*Gift Type:* ${formData.giftType}
*Gift For:* ${formData.giftFor}
*Budget Range:* ${formData.budgetRange}
*Preferred Delivery Date:* ${formData.deliveryDate}
*Preferred Delivery Time:* ${formData.deliveryTime}
*Delivery City:* ${formData.city}
*Address:* ${formData.deliveryAddress}
${formData.recipientName ? `*Recipient's Name:* ${formData.recipientName}\n` : ''}${formData.personalMessage ? `*Personal Card Message:*\n"${formData.personalMessage}"\n` : ''}${formData.specialRequests ? `*Special Requests / Notes:*\n${formData.specialRequests}\n` : ''}
Thank you!`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      // Scroll to view success container smoothly
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
    window.open(`https://wa.me/923390088458?text=${text}`, '_blank');
  };

  return (
    <section id="order-form" className="py-16 md:py-24 bg-gradient-to-b from-[#FBF9F5] via-[#F4EFE6] to-[#FBF9F5] border-t border-[#EADBCE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
            BESPOKE ORDER CONCIERGE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-3">
            Let's Create Your Perfect Gift. 🎁
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light max-w-xl mx-auto">
            Tell us a little about your order and we'll help bring your gifting idea to life.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#9E7B1A] font-medium">
            <Calendar className="w-4 h-4 text-[#C59B27]" />
            <span>Reminder: Please place orders 1–2 days in advance</span>
          </div>
        </div>

        {/* Selected Product Banner if pre-filled */}
        {initialProduct && !isSubmitted && (
          <div className="mb-8 p-4 rounded-xl bg-[#14382C] text-[#FBF9F5] flex items-center justify-between gap-4 border border-[#C59B27]/40 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#DFC066] shrink-0" />
              <div>
                <p className="text-xs font-medium text-emerald-200">Selected Item to Order:</p>
                <p className="text-sm font-serif font-bold text-white">
                  {initialProduct.product.name}
                  {initialProduct.selectedTier && ` — ${initialProduct.selectedTier} Tier`}
                </p>
              </div>
            </div>
            {onClearInitialProduct && (
              <button
                type="button"
                onClick={onClearInitialProduct}
                className="text-xs text-[#DFC066] hover:underline"
              >
                Change Item
              </button>
            )}
          </div>
        )}

        {/* Main Content: Form or Smart WhatsApp Success Screen */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADBCE] shadow-lg">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              
              {/* SECTION A: Customer Information */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                    1
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#14382C]">
                    Customer Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ayesha Khan"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#14382C] ${
                        errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-[#FBF9F5]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 03390088458"
                      value={formData.whatsappNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, whatsappNumber: e.target.value });
                        if (errors.whatsappNumber) setErrors({ ...errors, whatsappNumber: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#14382C] ${
                        errors.whatsappNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-[#FBF9F5]'
                      }`}
                    />
                    {errors.whatsappNumber && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.whatsappNumber}
                      </p>
                    )}
                  </div>

                  {/* Instagram Username */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Instagram Username <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @ayesha_k"
                      value={formData.instagramHandle}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Gift Details */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                    2
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#14382C]">
                    Gift Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* What are you looking for? */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      What are you looking for? <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.giftType}
                      onChange={(e) => setFormData({ ...formData, giftType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C]"
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
                      Gift For <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.giftFor}
                      onChange={(e) => setFormData({ ...formData, giftFor: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C]"
                    >
                      {giftForOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Budget Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C]"
                    >
                      {budgetOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Delivery Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Delivery Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => {
                        setFormData({ ...formData, deliveryDate: e.target.value });
                        if (errors.deliveryDate) setErrors({ ...errors, deliveryDate: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#14382C] ${
                        errors.deliveryDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-[#FBF9F5]'
                      }`}
                    />
                    {errors.deliveryDate && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.deliveryDate}
                      </p>
                    )}
                  </div>

                  {/* Preferred Delivery Time */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Delivery Time
                    </label>
                    <select
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C]"
                    >
                      {deliveryTimes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Note: Special/midnight deliveries involve additional charges as per policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION C: Personalization */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                    3
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#14382C]">
                    Personalization & Custom Touch
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Recipient's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Recipient's Name <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fatima Ali"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C]"
                    />
                  </div>

                  {/* Personal Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Personal Greeting Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write the message you'd like us to include with your gift..."
                      value={formData.personalMessage}
                      onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C] resize-none"
                    />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Special Requests & Preferences
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Colors, theme, preferences, customization or anything else..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#14382C] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: Delivery Address */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#14382C] text-[#DFC066] text-xs font-bold flex items-center justify-center font-serif">
                    4
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#14382C]">
                    Delivery Destination
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Delivery City */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Delivery City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Karachi, Islamabad, etc."
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#14382C] ${
                        errors.city ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-[#FBF9F5]'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Delivery Area / Complete Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="House / Apartment #, Street, Sector / Area..."
                      value={formData.deliveryAddress}
                      onChange={(e) => {
                        setFormData({ ...formData, deliveryAddress: e.target.value });
                        if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#14382C] resize-none ${
                        errors.deliveryAddress ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-[#FBF9F5]'
                      }`}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.deliveryAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] shadow-lg hover:shadow-xl transition-all duration-200 border border-[#C59B27]/50 active:scale-[0.98] cursor-pointer"
                >
                  <Gift className="w-5 h-5 text-[#DFC066]" />
                  <span>Send My Gift Request</span>
                </button>

                <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto">
                  We'll review your request and contact you on WhatsApp to confirm availability, pricing and delivery details.
                </p>
              </div>

            </form>
          ) : (
            /* SECTION 14: SMART WHATSAPP ORDER FLOW (SUCCESS STATE) */
            <div className="text-center py-6 sm:py-8 animate-in fade-in zoom-in-95 duration-300">
              
              <div className="w-16 h-16 rounded-full bg-[#14382C] text-[#DFC066] flex items-center justify-center mx-auto mb-4 border border-[#C59B27]/50 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="inline-block text-xs font-semibold tracking-widest uppercase text-[#C59B27] mb-2">
                ORDER CONCIERGE READY
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#14382C] mb-2">
                🎁 Your Gift Request Is Ready!
              </h3>

              <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6">
                Thank you for choosing The Gift Gallery. Your request has been prepared for WhatsApp. Click below to connect directly with our gifting concierge.
              </p>

              {/* Message Preview Card */}
              <div className="max-w-xl mx-auto bg-[#FBF9F5] rounded-2xl p-5 border border-[#EADBCE] text-left mb-8 relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EADBCE]/80">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C59B27]" />
                    <span className="text-xs font-bold text-[#14382C]">Formatted WhatsApp Order Note</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex items-center gap-1.5 text-xs text-[#14382C] hover:text-[#C59B27] font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100 max-h-56 overflow-y-auto">
                  {generateWhatsAppMessage()}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] shadow-lg hover:shadow-xl transition-all duration-200 border border-[#C59B27]/50 active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 text-[#DFC066]" />
                  <span>Continue on WhatsApp ({BRAND_INFO.whatsappNumber})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xs font-semibold text-slate-700 bg-[#F4EFE6] hover:bg-[#EADBCE] border border-slate-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start Again / Edit</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-4">
                Our concierge team usually responds within 3–4 hours. Thank you for letting us share your special moment!
              </p>

            </div>
          )}
        </div>

      </div>
    </section>
  );
};
