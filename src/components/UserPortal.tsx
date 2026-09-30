import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { OrderStatus, Product, SavedRecipient } from '../types';
import { OptimizedImage } from './OptimizedImage';
import {
  Package,
  CalendarHeart,
  Heart,
  User,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  MapPin,
  MessageCircle,
  Plus,
  Trash2,
  ArrowLeft,
  LogOut,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface UserPortalProps {
  onBackToStore: () => void;
  onStartCheckoutWithDraft: (draft: {
    product?: Product;
    selectedTier?: string;
    recipientName?: string;
    city?: string;
    deliveryAddress?: string;
    giftType?: string;
    deliveryDate?: string;
    specialRequests?: string;
  }) => void;
}

const PIPELINE_STEPS: OrderStatus[] = [
  'Pending Review',
  'Design Confirmed',
  'Handcrafting',
  'Out for Delivery',
  'Delivered',
];

export const UserPortal: React.FC<UserPortalProps> = ({
  onBackToStore,
  onStartCheckoutWithDraft,
}) => {
  const {
    orders,
    products,
    userProfile,
    savedRecipients,
    wishlistIds,
    isUserAuthenticated,
    openAuthModal,
    loginUser,
    logoutUser,
    activeTrackedOrderId,
    setActiveTrackedOrderId,
    updateUserProfile,
    addRecipient,
    deleteRecipient,
    toggleWishlist,
    siteSettings,
    formOptions,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'orders' | 'recipients' | 'wishlist' | 'profile'>(
    'orders'
  );
  const [orderSearch, setOrderSearch] = useState('');

  // New recipient form state
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [recName, setRecName] = useState('');
  const [recRelation, setRecRelation] = useState('Spouse');
  const [recOccasion, setRecOccasion] = useState('Anniversary');
  const [recDate, setRecDate] = useState('');
  const [recCity, setRecCity] = useState('Lahore');
  const [recAddress, setRecAddress] = useState('');
  const [recNotes, setRecNotes] = useState('');

  // Profile edit state
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.recipientName.toLowerCase().includes(q) ||
        o.fullName.toLowerCase().includes(q) ||
        o.whatsappNumber.toLowerCase().includes(q) ||
        (o.selectedProductName && o.selectedProductName.toLowerCase().includes(q)) ||
        o.city.toLowerCase().includes(q)
    );
  }, [orders, orderSearch]);

  const selectedOrder = useMemo(() => {
    return (
      orders.find((o) => o.id === activeTrackedOrderId) ||
      filteredOrders[0] ||
      orders[0] ||
      null
    );
  }, [orders, activeTrackedOrderId, filteredOrders]);

  const wishlistedProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const handleCreateRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recName.trim() || !recDate || !recAddress.trim()) return;
    addRecipient({
      name: recName.trim(),
      relationship: recRelation,
      occasion: recOccasion,
      date: recDate,
      city: recCity,
      address: recAddress.trim(),
      notes: recNotes.trim(),
    });
    setRecName('');
    setRecDate('');
    setRecAddress('');
    setRecNotes('');
    setShowAddRecipient(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  if (!isUserAuthenticated) {
    return (
      <section className="py-16 md:py-24 bg-[#FBF9F5] min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#EADBCE] text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#14382C] text-[#DFC066] flex items-center justify-center mx-auto border border-[#C59B27]/40">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C59B27] mb-1">
              CUSTOMER PORTAL ACCESS
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#14382C]">
              Sign In to Your Gifting Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Access your live order tracking, delivery receipts, saved recipient reminders, and wishlist.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() =>
                openAuthModal('Sign in or create an account to open your personal User Portal.')
              }
              className="w-full py-3.5 px-5 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer"
            >
              Sign In or Create Account
            </button>
            <button
              type="button"
              onClick={() => loginUser('ayesha.khan@example.com')}
              className="w-full py-3 px-5 rounded-xl bg-[#F4EFE6] hover:bg-[#EADBCE] text-[#14382C] border border-[#C59B27]/40 font-semibold text-xs transition-colors cursor-pointer"
            >
              Quick Demo Login (Ayesha Khan)
            </button>
            <button
              type="button"
              onClick={onBackToStore}
              className="w-full py-2.5 text-xs font-medium text-slate-500 hover:text-[#14382C] transition-colors cursor-pointer"
            >
              ← Return to Storefront
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-[#FBF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Portal Breadcrumb & Account Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EADBCE]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs font-semibold text-[#14382C] hover:border-[#C59B27] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
            <span className="text-slate-300">/</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#14382C]">
                My Gifting Portal
              </h1>
              <p className="text-xs text-slate-500">
                Welcome back, <span className="font-semibold text-slate-800">{userProfile.fullName}</span> ·{' '}
                {userProfile.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onStartCheckoutWithDraft({})}
              className="px-4 py-2.5 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#DFC066]" />
              <span>+ New Gift Order</span>
            </button>

            <button
              type="button"
              onClick={logoutUser}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-[#EADBCE] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Workspace Layout: Horizontal App Tab Bar (< 1024px) + Sidebar (Desktop) + Content Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Left Navigation Sidebar (3 cols on Desktop, Horizontal Scrollable App Tabs on Mobile/Tablet) */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-1.5 sm:p-3 lg:p-4 border border-[#EADBCE] flex lg:flex-col overflow-x-auto no-scrollbar gap-1.5 lg:gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 lg:py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Orders &amp; Tracking</span>
                </span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  ({orders.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('recipients')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 lg:py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'recipients'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CalendarHeart className="w-4 h-4 shrink-0" />
                  <span>Saved Recipients</span>
                </span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  ({savedRecipients.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 lg:py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'wishlist'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>Wishlist</span>
                </span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  ({wishlistedProducts.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 lg:py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 shrink-0" />
                  <span>Profile &amp; Address</span>
                </span>
              </button>
            </div>

            {/* Direct Concierge Help Box (Desktop Sidebar) */}
            <div className="hidden lg:block bg-[#14382C] text-white rounded-2xl p-5 border border-[#C59B27]/40 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#DFC066]">
                VIP Gifting Concierge
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Need a custom midnight arrangement or live dispatch photo? Connect directly on WhatsApp.
              </p>
              <a
                href={siteSettings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#DFC066] hover:bg-[#e8cc77] text-[#14382C] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </aside>

          {/* Main Content Viewport (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: ORDERS & LIVE TRACKER */}
            {activeTab === 'orders' && (
              <>
                {/* Search & Filter */}
                <div className="bg-white rounded-2xl p-5 border border-[#EADBCE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#14382C]">
                      My Gift Orders &amp; Live Dispatch Tracker
                    </h2>
                    <p className="text-xs text-slate-500">
                      Click any order below to inspect its 5-stage preparation timeline and payment receipt
                    </p>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search Order ID, Recipient, City..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                </div>

                {/* Active Order Live Tracker Detail */}
                {selectedOrder && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C59B27]/50 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-mono font-bold text-[#14382C] tabular-nums">
                            {selectedOrder.id}
                          </span>
                          <span>·</span>
                          <span>{selectedOrder.giftType}</span>
                          <span>·</span>
                          <span>For {selectedOrder.recipientName}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#14382C]">
                          {selectedOrder.selectedProductName || selectedOrder.giftType}
                          {selectedOrder.selectedProductTier
                            ? ` (${selectedOrder.selectedProductTier})`
                            : ''}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="font-mono text-lg font-bold text-[#14382C] tabular-nums">
                          PKR {selectedOrder.amountPKR.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {selectedOrder.paymentStatus} · {selectedOrder.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* 5-Stage Progress Pipeline */}
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-3">
                        Order Preparation &amp; Delivery Pipeline
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {PIPELINE_STEPS.map((step, index) => {
                          const currentIndex = PIPELINE_STEPS.indexOf(selectedOrder.status);
                          const isCompleted = currentIndex >= index;
                          const isCurrent = selectedOrder.status === step;
                          return (
                            <div
                              key={step}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                isCurrent
                                  ? 'bg-[#14382C] text-white border-[#14382C]'
                                  : isCompleted
                                  ? 'bg-[#F4EFE6] text-[#14382C] border-[#C59B27]/40'
                                  : 'bg-[#FBF9F5] text-slate-400 border-[#EADBCE]'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-[11px] font-bold tabular-nums">
                                  0{index + 1}
                                </span>
                                {isCompleted && (
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 ${
                                      isCurrent ? 'text-[#DFC066]' : 'text-[#14382C]'
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="text-xs font-semibold leading-snug">{step}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Concierge Dispatch Note */}
                    {selectedOrder.conciergeNote && (
                      <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-700 leading-relaxed">
                          <span className="font-semibold text-[#14382C] block mb-0.5">
                            Live Concierge Note
                            {selectedOrder.courierTracking
                              ? ` · Dispatch Code: ${selectedOrder.courierTracking}`
                              : ''}
                          </span>
                          {selectedOrder.conciergeNote}
                        </div>
                      </div>
                    )}

                    {/* Contact, Address & Order Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE]">
                        <span className="text-slate-400 uppercase text-[10px] font-semibold block mb-1">
                          Recipient &amp; Address
                        </span>
                        <div className="font-semibold text-slate-900">
                          {selectedOrder.recipientName}
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          {selectedOrder.deliveryAddress}, {selectedOrder.city}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE]">
                        <span className="text-slate-400 uppercase text-[10px] font-semibold block mb-1">
                          Scheduled Delivery Slot
                        </span>
                        <div className="font-semibold text-slate-900 tabular-nums">
                          {selectedOrder.deliveryDate}
                        </div>
                        <div className="text-slate-600 mt-0.5">{selectedOrder.deliveryTime}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE]">
                        <span className="text-slate-400 uppercase text-[10px] font-semibold block mb-1">
                          Card Message &amp; Notes
                        </span>
                        <div className="text-slate-700 italic line-clamp-2">
                          {selectedOrder.personalMessage
                            ? `“${selectedOrder.personalMessage}”`
                            : 'Standard gold-foil greeting card'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* All Orders Table */}
                <div className="bg-white rounded-2xl border border-[#EADBCE] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#EADBCE] flex items-center justify-between">
                    <h3 className="text-sm font-serif font-bold text-[#14382C]">
                      Order History ({filteredOrders.length})
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FBF9F5] border-b border-[#EADBCE] text-slate-500 uppercase text-[11px]">
                          <th className="py-3 px-4 font-semibold">Order ID</th>
                          <th className="py-3 px-4 font-semibold">Gift / Product</th>
                          <th className="py-3 px-4 font-semibold">Recipient &amp; City</th>
                          <th className="py-3 px-4 font-semibold">Delivery Date</th>
                          <th className="py-3 px-4 font-semibold">Payment</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EADBCE]">
                        {filteredOrders.map((ord) => {
                          const isSelected = selectedOrder?.id === ord.id;
                          return (
                            <tr
                              key={ord.id}
                              onClick={() => setActiveTrackedOrderId(ord.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#F4EFE6]/70' : 'hover:bg-[#FBF9F5]'
                              }`}
                            >
                              <td className="py-3.5 px-4 font-mono font-bold text-[#14382C] tabular-nums whitespace-nowrap">
                                {ord.id}
                              </td>
                              <td className="py-3.5 px-4 font-medium text-slate-900">
                                {ord.selectedProductName || ord.giftType}
                                {ord.selectedProductTier ? ` · ${ord.selectedProductTier}` : ''}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {ord.recipientName} · {ord.city}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                                {ord.deliveryDate}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {ord.paymentMethodType || 'Transfer'} · {ord.paymentStatus}
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-[#14382C] whitespace-nowrap">
                                {ord.status}
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right tabular-nums whitespace-nowrap">
                                PKR {ord.amountPKR.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: SAVED RECIPIENTS & OCCASION REMINDERS */}
            {activeTab === 'recipients' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#14382C]">
                      Saved Recipients &amp; Important Dates
                    </h2>
                    <p className="text-xs text-slate-500">
                      Store family &amp; friends&apos; addresses and anniversaries for 1-click gift checkout
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddRecipient(!showAddRecipient)}
                    className="px-4 py-2.5 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#DFC066]" />
                    <span>Add Recipient</span>
                  </button>
                </div>

                {showAddRecipient && (
                  <form
                    onSubmit={handleCreateRecipient}
                    className="p-5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-4"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">
                      New Recipient Profile
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Recipient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={recName}
                          onChange={(e) => setRecName(e.target.value)}
                          placeholder="e.g. Sara Ahmed"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={recRelation}
                          onChange={(e) => setRecRelation(e.target.value)}
                          placeholder="Spouse, Sister, Mother, Friend"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Occasion
                        </label>
                        <input
                          type="text"
                          value={recOccasion}
                          onChange={(e) => setRecOccasion(e.target.value)}
                          placeholder="Birthday, Anniversary"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Celebration Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={recDate}
                          onChange={(e) => setRecDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          City
                        </label>
                        <select
                          value={recCity}
                          onChange={(e) => setRecCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
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
                          Delivery Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={recAddress}
                          onChange={(e) => setRecAddress(e.target.value)}
                          placeholder="House, Street, Area"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddRecipient(false)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                      >
                        Save Recipient
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedRecipients.map((rec: SavedRecipient) => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B27]">
                              {rec.relationship} · {rec.occasion}
                            </span>
                            <h3 className="text-base font-serif font-bold text-[#14382C]">
                              {rec.name}
                            </h3>
                          </div>
                          <span className="font-mono text-xs text-slate-600 tabular-nums">
                            {rec.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          <MapPin className="w-3.5 h-3.5 inline text-[#C59B27] mr-1" />
                          {rec.address}, {rec.city}
                        </p>
                        {rec.notes && (
                          <p className="text-[11px] text-slate-500 italic mt-1.5">{rec.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#EADBCE]">
                        <button
                          type="button"
                          onClick={() =>
                            onStartCheckoutWithDraft({
                              recipientName: rec.name,
                              city: rec.city,
                              deliveryAddress: rec.address,
                              giftType: `${rec.occasion} Gift`,
                              deliveryDate: rec.date,
                              specialRequests: rec.notes,
                            })
                          }
                          className="px-3.5 py-2 rounded-lg bg-[#14382C] hover:bg-[#0D261E] text-white text-xs font-semibold cursor-pointer"
                        >
                          Order Gift for {rec.name.split(' ')[0]} →
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecipient(rec.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete recipient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SAVED WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE] space-y-6">
                <div className="pb-4 border-b border-[#EADBCE]">
                  <h2 className="text-xl font-serif font-bold text-[#14382C]">
                    Saved Gift Hampers &amp; Wishlist
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your favorite curated creations ready for instant checkout
                  </p>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="text-sm text-slate-600">
                      You have no saved hampers in your wishlist yet.
                    </p>
                    <button
                      type="button"
                      onClick={onBackToStore}
                      className="px-5 py-2.5 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                    >
                      Explore Gift Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlistedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-xl bg-[#FBF9F5] border border-[#EADBCE] overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[4/3] bg-[#F4EFE6] relative">
                            <OptimizedImage
                              src={product.image}
                              alt={product.name}
                              aspectRatio="aspect-[4/3]"
                              className="w-full h-full"
                            />
                          </div>
                          <div className="p-4">
                            <div className="text-[11px] text-[#C59B27] font-semibold uppercase">
                              {product.category}
                            </div>
                            <h3 className="font-serif font-bold text-base text-[#14382C] mt-0.5">
                              {product.name}
                            </h3>
                            <div className="text-xs font-mono font-bold text-slate-700 mt-1 tabular-nums">
                              {product.priceDisplay}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 pt-0 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onStartCheckoutWithDraft({ product })}
                            className="flex-1 py-2.5 px-3 rounded-lg bg-[#14382C] hover:bg-[#0D261E] text-white text-xs font-semibold cursor-pointer"
                          >
                            Checkout Now
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="p-2.5 rounded-lg bg-white border border-[#EADBCE] text-slate-500 hover:text-red-600 cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PROFILE & ADDRESS PREFERENCES */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE] space-y-6">
                <div className="pb-4 border-b border-[#EADBCE]">
                  <h2 className="text-xl font-serif font-bold text-[#14382C]">
                    Account Profile &amp; Default Checkout Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your saved details automatically pre-fill during Checkout
                  </p>
                </div>

                {profileSavedToast && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                    ✓ Profile and default checkout preferences saved.
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userProfile.fullName}
                        onChange={(e) => updateUserProfile({ fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={userProfile.whatsappNumber}
                        onChange={(e) => updateUserProfile({ whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => updateUserProfile({ email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={userProfile.instagramHandle}
                        onChange={(e) => updateUserProfile({ instagramHandle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Default City
                      </label>
                      <select
                        value={userProfile.city}
                        onChange={(e) => updateUserProfile({ city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm"
                      >
                        {formOptions.cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Default Delivery Address
                    </label>
                    <input
                      type="text"
                      value={userProfile.defaultAddress}
                      onChange={(e) => updateUserProfile({ defaultAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
