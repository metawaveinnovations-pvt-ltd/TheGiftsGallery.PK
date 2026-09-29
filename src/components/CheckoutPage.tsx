import React, { useState, useEffect, useMemo } from 'react';
import { usePortal, parseAmountFromBudget } from '../context/PortalContext';
import { PaymentMethodType, PortalOrder } from '../types';
import { Logo } from './Logo';
import { OptimizedImage } from './OptimizedImage';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Landmark,
  CheckCircle2,
  ShieldCheck,
  Gift,
  MapPin,
  User,
  Calendar,
  Copy,
  Check,
  MessageCircle,
  Lock,
  Sparkles,
  Plus,
  Minus,
  AlertCircle,
} from 'lucide-react';

interface CheckoutPageProps {
  onBackToStore: () => void;
  onOpenUserPortal: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToStore,
  onOpenUserPortal,
}) => {
  const {
    products,
    userProfile,
    savedRecipients,
    siteSettings,
    formOptions,
    checkoutDraft,
    isUserAuthenticated,
    openAuthModal,
    submitCheckoutOrder,
  } = usePortal();

  // 1. Order Details State
  const [selectedProductId, setSelectedProductId] = useState<string>(
    checkoutDraft?.product?.id || products[0]?.id || ''
  );
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const [selectedTier, setSelectedTier] = useState<string>(
    checkoutDraft?.selectedTier ||
      selectedProduct?.tiers?.[1]?.size ||
      selectedProduct?.tiers?.[0]?.size ||
      'Medium'
  );
  const [quantity, setQuantity] = useState<number>(checkoutDraft?.quantity || 1);
  const [giftType, setGiftType] = useState<string>(
    checkoutDraft?.giftType || formOptions.giftTypes[0] || 'Birthday Gift'
  );
  const [giftFor, setGiftFor] = useState<string>(
    checkoutDraft?.giftFor || formOptions.giftForOptions[0] || 'Her'
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['addon-gold-card']);
  const [personalMessage, setPersonalMessage] = useState<string>(
    checkoutDraft?.personalMessage || ''
  );
  const [specialRequests, setSpecialRequests] = useState<string>(
    checkoutDraft?.specialRequests || ''
  );

  // Default tomorrow's date
  const defaultTomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  const [deliveryDate, setDeliveryDate] = useState<string>(
    checkoutDraft?.deliveryDate || defaultTomorrow
  );
  const [deliveryTime, setDeliveryTime] = useState<string>(
    checkoutDraft?.deliveryTime || formOptions.deliverySlots[1] || '4 PM – 7 PM (Evening)'
  );

  // 2. Contact & Address Details State
  const [fullName, setFullName] = useState<string>(
    checkoutDraft?.fullName || userProfile.fullName || ''
  );
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    checkoutDraft?.whatsappNumber || userProfile.whatsappNumber || ''
  );
  const [email, setEmail] = useState<string>(
    checkoutDraft?.email || userProfile.email || ''
  );
  const [instagramHandle, setInstagramHandle] = useState<string>(
    checkoutDraft?.instagramHandle || userProfile.instagramHandle || ''
  );

  const [recipientName, setRecipientName] = useState<string>(
    checkoutDraft?.recipientName || ''
  );
  const [recipientPhone, setRecipientPhone] = useState<string>(
    checkoutDraft?.recipientPhone || ''
  );
  const [city, setCity] = useState<string>(
    checkoutDraft?.city || userProfile.city || formOptions.cities[1] || 'Lahore'
  );
  const [postalCode, setPostalCode] = useState<string>(
    checkoutDraft?.postalCode || '54000'
  );
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    checkoutDraft?.deliveryAddress || userProfile.defaultAddress || ''
  );

  // 3. Payment Details State
  const [paymentMethodType, setPaymentMethodType] =
    useState<PaymentMethodType>('Card');
  const [cardHolderName, setCardHolderName] = useState<string>(
    userProfile.fullName || 'AYESHA KHAN'
  );
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 4821');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('842');
  const [transferMethod, setTransferMethod] = useState<'Raast / Bank' | 'EasyPaisa / JazzCash'>('Raast / Bank');
  const [transferReference, setTransferReference] = useState<string>('');
  const [codNote, setCodNote] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState<boolean>(false);

  const [formError, setFormError] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<PortalOrder | null>(null);

  useEffect(() => {
    if (isUserAuthenticated && userProfile) {
      if (!fullName) setFullName(userProfile.fullName);
      if (!whatsappNumber) setWhatsappNumber(userProfile.whatsappNumber);
      if (!email) setEmail(userProfile.email);
      if (!deliveryAddress) setDeliveryAddress(userProfile.defaultAddress);
    }
  }, [isUserAuthenticated, userProfile]);

  // Price Calculation
  const unitPricePKR = useMemo(() => {
    if (!selectedProduct) return 5000;
    if (selectedProduct.tiers && selectedProduct.tiers.length > 0) {
      const tierObj =
        selectedProduct.tiers.find((t) => t.size === selectedTier) ||
        selectedProduct.tiers[0];
      return parseAmountFromBudget(tierObj.price);
    }
    return parseAmountFromBudget(selectedProduct.priceDisplay);
  }, [selectedProduct, selectedTier]);

  const addonsTotalPKR = useMemo(() => {
    return formOptions.packagingAddons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((acc, a) => acc + a.pricePKR, 0);
  }, [formOptions.packagingAddons, selectedAddons]);

  const subtotalPKR = unitPricePKR * quantity + addonsTotalPKR;

  const isMidnightSlot = deliveryTime.toLowerCase().includes('midnight');
  const deliveryFeePKR = useMemo(() => {
    if (isMidnightSlot) return siteSettings.midnightDeliveryFeePKR;
    if (subtotalPKR >= siteSettings.freeDeliveryThresholdPKR) return 0;
    return siteSettings.standardDeliveryFeePKR;
  }, [isMidnightSlot, subtotalPKR, siteSettings]);

  const totalPayablePKR = subtotalPKR + deliveryFeePKR;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectSavedRecipient = (recId: string) => {
    const rec = savedRecipients.find((r) => r.id === recId);
    if (!rec) return;
    setRecipientName(rec.name);
    setCity(rec.city);
    setDeliveryAddress(rec.address);
    if (rec.occasion) {
      const matched = formOptions.giftTypes.find((g) =>
        g.toLowerCase().includes(rec.occasion.toLowerCase())
      );
      if (matched) setGiftType(matched);
    }
    if (rec.date) setDeliveryDate(rec.date);
    if (rec.notes) setSpecialRequests(rec.notes);
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const finalizeOrderExecution = () => {
    const addonNames = formOptions.packagingAddons
      .filter((a) => selectedAddons.includes(a.id))
      .map((a) => a.name)
      .join(', ');

    const combinedRequests = [
      addonNames ? `Add-ons: ${addonNames}` : '',
      specialRequests.trim(),
      paymentMethodType === 'COD' && codNote.trim() ? `COD Note: ${codNote.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const cleanDigits = cardNumber.replace(/\D/g, '');
    const last4 = cleanDigits.slice(-4) || '4821';

    let paymentStatus: PortalOrder['paymentStatus'] = 'Paid via Card';
    let paymentMethodLabel = `Debit / Credit Card (•••• ${last4})`;
    let paymentRef = `CARD-${Date.now().toString().slice(-6)}`;

    if (paymentMethodType === 'COD') {
      paymentStatus = 'COD - Pay on Delivery';
      paymentMethodLabel = 'Cash on Delivery (COD)';
      paymentRef = 'COD-DOORSTEP';
    } else if (paymentMethodType === 'Transfer') {
      paymentStatus = transferReference.trim()
        ? 'Transfer Verified'
        : 'Awaiting Transfer';
      paymentMethodLabel = `${transferMethod}${
        transferReference.trim() ? ` (Ref: ${transferReference.trim()})` : ''
      }`;
      paymentRef = transferReference.trim() || 'PENDING-TID';
    }

    const created = submitCheckoutOrder({
      fullName: fullName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      email: email.trim(),
      instagramHandle: instagramHandle.trim(),
      giftType,
      giftFor,
      selectedProductId: selectedProduct?.id,
      selectedProductName: selectedProduct?.name,
      selectedProductTier: selectedTier,
      quantity,
      budgetRange: `PKR ${totalPayablePKR.toLocaleString()}`,
      subtotalPKR,
      deliveryFeePKR,
      amountPKR: totalPayablePKR,
      deliveryDate,
      deliveryTime,
      recipientName: recipientName.trim() || giftFor,
      recipientPhone: recipientPhone.trim(),
      personalMessage: personalMessage.trim(),
      specialRequests: combinedRequests,
      city,
      postalCode: postalCode.trim(),
      deliveryAddress: deliveryAddress.trim(),
      paymentMethodType,
      paymentStatus,
      paymentMethod: paymentMethodLabel,
      paymentReference: paymentRef,
      cardLast4: paymentMethodType === 'Card' ? last4 : undefined,
      courierTracking: '',
      conciergeNote:
        paymentMethodType === 'Card'
          ? 'Card payment authorized. Order assigned to artisan wrapping station.'
          : paymentMethodType === 'COD'
          ? 'Cash on Delivery order logged. Concierge will verify dispatch window on WhatsApp.'
          : 'Bank Transfer / Raast order logged. Preparing bespoke gift box.',
    });

    setCompletedOrder(created);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !whatsappNumber.trim()) {
      setFormError('Please provide your Full Name and WhatsApp Contact Number.');
      return;
    }
    if (!recipientName.trim() || !deliveryAddress.trim()) {
      setFormError('Please provide the Recipient Name and complete Delivery Address.');
      return;
    }
    if (!deliveryDate) {
      setFormError('Please select a preferred Delivery Date.');
      return;
    }
    if (paymentMethodType === 'Card') {
      if (!cardHolderName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setFormError('Please complete all Debit / Credit Card payment fields.');
        return;
      }
    }

    // Enforce Sign In requirement at Checkout completion if not yet signed in
    if (!isUserAuthenticated) {
      openAuthModal(
        'Please sign in or create your account to complete your Checkout and receive live order tracking.',
        () => {
          finalizeOrderExecution();
        }
      );
      return;
    }

    finalizeOrderExecution();
  };

  if (completedOrder) {
    const whatsappReceiptText = encodeURIComponent(
      `Hello The Gift Gallery! 🎁\nI have completed Checkout for Order *${completedOrder.id}*.\n\n*Product:* ${completedOrder.selectedProductName} (${completedOrder.selectedProductTier}) x${completedOrder.quantity}\n*Total Amount:* PKR ${completedOrder.amountPKR.toLocaleString()}\n*Payment Method:* ${completedOrder.paymentMethod}\n*Recipient:* ${completedOrder.recipientName} (${completedOrder.city})\n*Delivery Date:* ${completedOrder.deliveryDate} (${completedOrder.deliveryTime})\n*Address:* ${completedOrder.deliveryAddress}\n\nPlease confirm my dispatch schedule. Thank you!`
    );

    return (
      <section className="py-12 md:py-20 bg-[#FBF9F5] min-h-[80vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#C59B27]/40 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-[#14382C] text-[#DFC066] flex items-center justify-center mx-auto mb-5 border border-[#C59B27]/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <Logo variant="mark" size={68} className="mb-3" />

            <div className="text-xs font-semibold uppercase tracking-widest text-[#C59B27] mb-1">
              Official Order Receipt · {completedOrder.id}
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#14382C] mb-2">
              Thank You, {completedOrder.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-8">
              Your order has been registered in our database and assigned to our artisan gifting team.
            </p>

            {/* Structured Receipt Details */}
            <div className="bg-[#FBF9F5] rounded-xl p-5 sm:p-6 border border-[#EADBCE] text-left mb-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EADBCE]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 block">
                    Order Tracking Number
                  </span>
                  <span className="font-mono font-bold text-base text-[#14382C] tabular-nums">
                    {completedOrder.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 block">
                    Payment Status
                  </span>
                  <span className="font-semibold text-xs text-[#14382C]">
                    {completedOrder.paymentStatus} · {completedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Selected Gift &amp; Tier:</span>
                  <span className="font-semibold text-slate-900">
                    {completedOrder.selectedProductName} ({completedOrder.selectedProductTier}) ×{' '}
                    {completedOrder.quantity}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Scheduled Delivery:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {completedOrder.deliveryDate} · {completedOrder.deliveryTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Recipient &amp; City:</span>
                  <span className="font-semibold text-slate-900">
                    {completedOrder.recipientName} · {completedOrder.city}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Delivery Address:</span>
                  <span className="font-semibold text-slate-900">
                    {completedOrder.deliveryAddress}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EADBCE] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Total Amount (PKR):</span>
                <span className="font-mono text-lg font-bold text-[#14382C] tabular-nums">
                  PKR {completedOrder.amountPKR.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenUserPortal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#DFC066]" />
                <span>Track Live in User Portal</span>
              </button>

              <a
                href={`${siteSettings.whatsappUrl}?text=${whatsappReceiptText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EADBCE] text-[#14382C] border border-[#C59B27]/40 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#14382C]" />
                <span>Share Receipt on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onBackToStore}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#14382C] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16 bg-[#FBF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EADBCE]">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#14382C] hover:text-[#C59B27] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gift Catalog</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Secure Boutique Checkout · Card, COD &amp; Instant Transfer</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#C59B27] mb-1">
            STEP-BY-STEP GIFT BOOKING &amp; CHECKOUT
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#14382C] tracking-tight">
            Complete Your Gift Order &amp; Checkout
          </h1>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 8 Columns: 1. Order Details, 2. Contact & Address Details, 3. Payment Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* SECTION 1: ORDER DETAILS & CUSTOMIZATION */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE]">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#EADBCE]">
                <span className="w-7 h-7 rounded-full bg-[#14382C] text-[#DFC066] font-serif font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#14382C]">
                    Order Details &amp; Bespoke Customization
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select your signature hamper, tier size, packaging add-ons, and delivery schedule
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Product & Quantity Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Selected Gift / Hamper <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => {
                        setSelectedProductId(e.target.value);
                        const prod = products.find((p) => p.id === e.target.value);
                        if (prod?.tiers?.[0]) setSelectedTier(prod.tiers[0].size);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 font-medium focus:outline-none focus:border-[#14382C]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ({p.priceDisplay})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Quantity
                    </label>
                    <div className="flex items-center border border-[#EADBCE] rounded-xl bg-[#FBF9F5] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2.5 text-slate-700 hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center font-mono font-bold text-sm tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3.5 py-2.5 text-slate-700 hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tier Selection if Product has Tiers */}
                {selectedProduct?.tiers && selectedProduct.tiers.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Select Hamper / Box Tier
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedProduct.tiers.map((tier) => {
                        const active = selectedTier === tier.size;
                        return (
                          <button
                            key={tier.size}
                            type="button"
                            onClick={() => setSelectedTier(tier.size)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              active
                                ? 'bg-[#14382C] text-white border-[#14382C]'
                                : 'bg-[#FBF9F5] text-slate-800 border-[#EADBCE] hover:border-[#C59B27]'
                            }`}
                          >
                            <div className="text-xs font-semibold">{tier.size}</div>
                            <div
                              className={`text-xs font-mono mt-0.5 tabular-nums ${
                                active ? 'text-[#DFC066]' : 'text-slate-500'
                              }`}
                            >
                              {tier.price}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Occasion & Gift For */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Occasion / Gift Type
                    </label>
                    <select
                      value={giftType}
                      onChange={(e) => setGiftType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    >
                      {formOptions.giftTypes.map((gt) => (
                        <option key={gt} value={gt}>
                          {gt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Who Is This Gift For?
                    </label>
                    <select
                      value={giftFor}
                      onChange={(e) => setGiftFor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    >
                      {formOptions.giftForOptions.map((gf) => (
                        <option key={gf} value={gf}>
                          {gf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Delivery Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Delivery Time Window
                    </label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    >
                      {formOptions.deliverySlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bespoke Packaging Add-ons */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Customize Packaging &amp; Luxury Add-Ons
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {formOptions.packagingAddons.map((addon) => {
                      const checked = selectedAddons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            checked
                              ? 'bg-[#F4EFE6] border-[#14382C] text-[#14382C]'
                              : 'bg-[#FBF9F5] border-[#EADBCE] text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                checked
                                  ? 'bg-[#14382C] border-[#14382C] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {checked && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-xs font-medium truncate">{addon.name}</span>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-[#C59B27] shrink-0 tabular-nums">
                            {addon.pricePKR === 0
                              ? 'Free'
                              : `+PKR ${addon.pricePKR.toLocaleString()}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Card Message & Special Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Personal Message for Gold-Foil Card
                    </label>
                    <textarea
                      rows={3}
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Write your heartfelt note to be handwritten on the card..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Special Customization / Color Theme Notes
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Ribbon color preference, fragrance notes, or surprise instructions..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CONTACT & DELIVERY ADDRESS DETAILS */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#EADBCE]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#14382C] text-[#DFC066] font-serif font-bold text-xs flex items-center justify-center">
                    02
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-[#14382C]">
                      Contact &amp; Delivery Address Details
                    </h2>
                    <p className="text-xs text-slate-500">
                      Your contact info for dispatch updates and the recipient&apos;s delivery address
                    </p>
                  </div>
                </div>

                {savedRecipients.length > 0 && (
                  <select
                    onChange={(e) => handleSelectSavedRecipient(e.target.value)}
                    defaultValue=""
                    className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] border border-[#C59B27]/40 text-xs font-semibold text-[#14382C] focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Autofill from Saved Recipients...
                    </option>
                    {savedRecipients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.relationship} · {r.city})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">
                  Sender Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 0300 4589210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (for Order Receipt)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Instagram Handle (Optional)
                    </label>
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      placeholder="@yourusername"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EADBCE] text-xs font-semibold uppercase tracking-wider text-[#C59B27]">
                  Recipient &amp; Delivery Address
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recipient&apos;s Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Hamza Tariq"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recipient&apos;s Phone Number (for Rider)
                    </label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="e.g. 0321 9876543"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Delivery City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    >
                      {formOptions.cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postal Code / Area Block
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54792 / DHA Phase 5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Complete Street / House / Apartment Delivery Address{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House #, Street #, Sector / Phase, Nearest Landmark..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PAYMENT DETAILS (CARD / COD / TRANSFER) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE]">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#EADBCE]">
                <span className="w-7 h-7 rounded-full bg-[#14382C] text-[#DFC066] font-serif font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#14382C]">
                    Payment Details — Card, COD, or Bank Transfer
                  </h2>
                  <p className="text-xs text-slate-500">
                    Choose your preferred payment method to complete your gift booking
                  </p>
                </div>
              </div>

              {/* 3-Method Segmented Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethodType('Card')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethodType === 'Card'
                      ? 'bg-[#14382C] text-white border-[#14382C] shadow-sm'
                      : 'bg-[#FBF9F5] text-slate-800 border-[#EADBCE] hover:border-[#C59B27]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <CreditCard
                      className={`w-5 h-5 ${
                        paymentMethodType === 'Card' ? 'text-[#DFC066]' : 'text-[#14382C]'
                      }`}
                    />
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                      Instant
                    </span>
                  </div>
                  <div className="text-xs font-bold">Debit / Credit Card</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      paymentMethodType === 'Card' ? 'text-emerald-100/80' : 'text-slate-500'
                    }`}
                  >
                    Visa, Mastercard, PayPak
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodType('COD')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethodType === 'COD'
                      ? 'bg-[#14382C] text-white border-[#14382C] shadow-sm'
                      : 'bg-[#FBF9F5] text-slate-800 border-[#EADBCE] hover:border-[#C59B27]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Truck
                      className={`w-5 h-5 ${
                        paymentMethodType === 'COD' ? 'text-[#DFC066]' : 'text-[#14382C]'
                      }`}
                    />
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                      Doorstep
                    </span>
                  </div>
                  <div className="text-xs font-bold">Cash on Delivery (COD)</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      paymentMethodType === 'COD' ? 'text-emerald-100/80' : 'text-slate-500'
                    }`}
                  >
                    Pay cash upon delivery
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodType('Transfer')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethodType === 'Transfer'
                      ? 'bg-[#14382C] text-white border-[#14382C] shadow-sm'
                      : 'bg-[#FBF9F5] text-slate-800 border-[#EADBCE] hover:border-[#C59B27]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Landmark
                      className={`w-5 h-5 ${
                        paymentMethodType === 'Transfer' ? 'text-[#DFC066]' : 'text-[#14382C]'
                      }`}
                    />
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                      Direct
                    </span>
                  </div>
                  <div className="text-xs font-bold">Bank / Raast / Wallet</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      paymentMethodType === 'Transfer' ? 'text-emerald-100/80' : 'text-slate-500'
                    }`}
                  >
                    Meezan, Raast, EasyPaisa
                  </div>
                </button>
              </div>

              {/* Method A: Card Payment Details */}
              {paymentMethodType === 'Card' && (
                <div className="bg-[#FBF9F5] rounded-xl p-5 border border-[#EADBCE] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#14382C]">
                      Enter Card Details (256-Bit Encrypted)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Visa · Mastercard · UnionPay
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Name on Card <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        placeholder="AYESHA KHAN"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 uppercase focus:outline-none focus:border-[#14382C]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 4821"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm font-mono text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry Date (MM/YY) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/29"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm font-mono text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CVV / Security Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm font-mono text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Method B: Cash on Delivery (COD) */}
              {paymentMethodType === 'COD' && (
                <div className="bg-[#FBF9F5] rounded-xl p-5 border border-[#EADBCE] space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#14382C] shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700 space-y-1 leading-relaxed">
                      <p className="font-semibold text-[#14382C]">
                        Cash on Delivery (COD) Verification Terms
                      </p>
                      <p>
                        Pay <strong className="font-mono">PKR {totalPayablePKR.toLocaleString()}</strong> in cash upon doorstep delivery. Our concierge team will confirm your order via a quick WhatsApp message before handcrafting your hamper.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Doorstep / Rider Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={codNote}
                      onChange={(e) => setCodNote(e.target.value)}
                      placeholder="e.g. Call sender upon arrival, do not ring bell if surprise..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                </div>
              )}

              {/* Method C: Bank Transfer / Raast / EasyPaisa / JazzCash */}
              {paymentMethodType === 'Transfer' && (
                <div className="bg-[#FBF9F5] rounded-xl p-5 border border-[#EADBCE] space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setTransferMethod('Raast / Bank')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        transferMethod === 'Raast / Bank'
                          ? 'bg-[#14382C] text-white'
                          : 'bg-white text-slate-700 border border-[#EADBCE]'
                      }`}
                    >
                      Meezan Bank / Raast ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferMethod('EasyPaisa / JazzCash')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        transferMethod === 'EasyPaisa / JazzCash'
                          ? 'bg-[#14382C] text-white'
                          : 'bg-white text-slate-700 border border-[#EADBCE]'
                      }`}
                    >
                      EasyPaisa / JazzCash
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#EADBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-800 space-y-1">
                      <div className="font-semibold text-[#14382C]">
                        {transferMethod === 'Raast / Bank'
                          ? siteSettings.bankTransferDetails
                          : siteSettings.easypaisaJazzcashDetails}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Transfer PKR {totalPayablePKR.toLocaleString()} and enter your reference below or share screenshot on WhatsApp.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyAccount(siteSettings.whatsappNumber)
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] hover:bg-[#EADBCE] text-xs font-semibold text-[#14382C] inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copiedBank ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Account / Raast</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Transaction ID / Reference Number (Optional — or send via WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={transferReference}
                      onChange={(e) => setTransferReference(e.target.value)}
                      placeholder="e.g. TID #783920 or Last 4 Digits"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm font-mono text-slate-800 tabular-nums focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 4 Columns: Contiguous Purchase & Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border border-[#C59B27]/40 sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C59B27]">
                  Checkout Summary
                </span>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {quantity} {quantity === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {selectedProduct && (
                <div className="flex items-center gap-3.5 pb-4 border-b border-[#EADBCE]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F4EFE6] border border-[#EADBCE] shrink-0">
                    <OptimizedImage
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      aspectRatio="aspect-square"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-sm text-[#14382C] truncate">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tier: <span className="font-medium text-slate-700">{selectedTier}</span> · Qty:{' '}
                      {quantity}
                    </p>
                    <p className="text-xs font-mono font-semibold text-[#C59B27] mt-0.5 tabular-nums">
                      PKR {(unitPricePKR * quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Gift Subtotal ({quantity}x)</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    PKR {(unitPricePKR * quantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging &amp; Add-Ons ({selectedAddons.length})</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {addonsTotalPKR === 0
                      ? 'Complimentary'
                      : `PKR ${addonsTotalPKR.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Delivery ({city} · {isMidnightSlot ? 'Midnight' : 'Standard'})
                  </span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {deliveryFeePKR === 0
                      ? 'FREE'
                      : `PKR ${deliveryFeePKR.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode</span>
                  <span className="font-semibold text-[#14382C]">{paymentMethodType}</span>
                </div>

                <div className="pt-3 border-t border-[#EADBCE] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Payable</span>
                  <span className="font-mono text-xl font-bold text-[#14382C] tabular-nums">
                    PKR {totalPayablePKR.toLocaleString()}
                  </span>
                </div>
              </div>

              {!isUserAuthenticated && (
                <div className="p-3 rounded-xl bg-[#F4EFE6] border border-[#C59B27]/30 text-[11px] text-slate-700 flex items-center justify-between gap-2">
                  <span>Sign in required on submission to track order</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal()}
                    className="font-semibold text-[#14382C] underline cursor-pointer shrink-0"
                  >
                    Sign In
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Gift className="w-4 h-4 text-[#DFC066]" />
                <span>
                  {isUserAuthenticated
                    ? `Complete Order · PKR ${totalPayablePKR.toLocaleString()}`
                    : `Sign In & Complete Order · PKR ${totalPayablePKR.toLocaleString()}`}
                </span>
              </button>

              <div className="text-[11px] text-slate-500 text-center space-y-1 pt-1">
                <div>Handcrafted with devotion · Fragile-safe PK delivery</div>
                <div>
                  Free standard delivery on orders above PKR{' '}
                  {siteSettings.freeDeliveryThresholdPKR.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
