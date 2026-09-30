import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { OrderStatus, PaymentStatus, PortalOrder, Product } from '../types';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { OptimizedImage } from './OptimizedImage';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Globe,
  Sliders,
  Search,
  Plus,
  Trash2,
  Edit3,
  Check,
  Copy,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  MessageCircle,
  Download,
  RotateCcw,
  Lock,
  Database,
  Sparkles,
} from 'lucide-react';

interface AdminPortalProps {
  onBackToStore: () => void;
}

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'Pending Review',
  'Design Confirmed',
  'Handcrafting',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const ALL_PAYMENT_STATUSES: PaymentStatus[] = [
  'Paid via Card',
  'Transfer Verified',
  'Awaiting Transfer',
  'COD - Pay on Delivery',
  '100% Advance Verified',
  'Refunded',
];

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToStore }) => {
  const {
    orders,
    products,
    siteSettings,
    formOptions,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateOrderStatus,
    updateOrderPayment,
    deleteOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
    updateSiteSettings,
    resetSiteSettings,
    updateFormOptions,
    resetFormOptions,
  } = usePortal();

  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'website-cms' | 'customize-options'
  >('overview');

  // Orders Filter & Inspector State
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [inspectingOrderId, setInspectingOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  // Product Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Birthday Gifts');
  const [prodTagline, setProdTagline] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('PKR 4,500 – 9,500');
  const [prodImage, setProdImage] = useState(
    '/assets/images/tgg_snacks_basket_1790253106884.jpg'
  );
  const [prodPopular, setProdPopular] = useState(true);

  // Customize Options Add State
  const [newGiftType, setNewGiftType] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('1000');

  const [savedNotice, setSavedNotice] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  const triggerSavedToast = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(''), 2500);
  };

  // Metrics
  const metrics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((acc, o) => acc + o.amountPKR, 0);
    const activeCount = orders.filter(
      (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
    ).length;
    const cardOrders = orders.filter((o) => o.paymentMethodType === 'Card').length;
    const codOrders = orders.filter((o) => o.paymentMethodType === 'COD').length;
    const transferOrders = orders.filter(
      (o) => !o.paymentMethodType || o.paymentMethodType === 'Transfer'
    ).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      activeCount,
      cardOrders,
      codOrders,
      transferOrders,
      catalogCount: products.length,
    };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      const q = orderSearch.trim().toLowerCase();
      if (!q) return matchesStatus;
      const matchesQuery =
        o.id.toLowerCase().includes(q) ||
        o.fullName.toLowerCase().includes(q) ||
        o.recipientName.toLowerCase().includes(q) ||
        o.whatsappNumber.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        (o.selectedProductName && o.selectedProductName.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, orderSearch]);

  const inspectedOrder: PortalOrder | null = useMemo(() => {
    return (
      orders.find((o) => o.id === inspectingOrderId) ||
      filteredOrders[0] ||
      orders[0] ||
      null
    );
  }, [orders, inspectingOrderId, filteredOrders]);

  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Date',
      'Sender Name',
      'WhatsApp',
      'Recipient',
      'City',
      'Product',
      'Tier',
      'Amount PKR',
      'Payment Method',
      'Payment Status',
      'Order Status',
    ];
    const rows = orders.map((o) => [
      o.id,
      o.deliveryDate,
      `"${o.fullName}"`,
      o.whatsappNumber,
      `"${o.recipientName}"`,
      o.city,
      `"${o.selectedProductName || o.giftType}"`,
      o.selectedProductTier || '',
      o.amountPKR,
      `"${o.paymentMethod}"`,
      o.paymentStatus,
      o.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TGG_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    addProduct({
      name: prodName.trim(),
      category: prodCategory,
      tagline: prodTagline.trim() || 'Handcrafted Curated Gift Box',
      description:
        prodDesc.trim() ||
        'Bespoke luxury gift creation presented with signature emerald ribbon and gold-foil sentiment card.',
      image: prodImage.trim() || '/assets/images/tgg_snacks_basket_1790253106884.jpg',
      priceDisplay: prodPrice.trim() || 'PKR 5,000',
      isPopular: prodPopular,
      tiers: [
        { size: 'Small', price: 'PKR 3,500' },
        { size: 'Medium', price: prodPrice.trim() || 'PKR 5,500' },
        { size: 'Large (Premium)', price: 'PKR 9,500' },
      ],
      features: [
        'Signature emerald presentation packaging',
        'Complimentary handwritten gold-foil card',
        'Nationwide fragile-safe delivery',
      ],
      tags: [prodCategory, 'Curated Gift'],
    });
    setProdName('');
    setProdTagline('');
    setProdDesc('');
    setShowNewProductForm(false);
    triggerSavedToast('New product added to live Storefront catalog.');
  };

  if (!isAdminAuthenticated) {
    return (
      <section className="py-16 md:py-24 bg-[#0C1A14] text-[#FBF9F5] min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#14382C] rounded-2xl p-8 border border-[#C59B27]/40 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0C1A14] text-[#DFC066] flex items-center justify-center mx-auto border border-[#C59B27]/40">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#DFC066] mb-1">
              THE GIFTS GALLERY × METAWAVE INNOVATIONS LTD
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Executive Admin Portal
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1.5 leading-relaxed">
              Manage orders, Card/COD/Transfer payments, product catalog, Hero content, and custom form options.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200">
              {authError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loginAdmin(passcodeInput)) {
                setAuthError('Invalid passcode. Try 2026 or click Quick Demo Unlock below.');
              } else {
                setAuthError('');
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter Admin Passcode (2026)"
              className="w-full px-4 py-3 rounded-xl bg-[#0C1A14] border border-[#C59B27]/40 text-sm text-white placeholder:text-emerald-100/40 text-center focus:outline-none focus:border-[#DFC066]"
            />
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-[#DFC066] hover:bg-[#e7c973] text-[#0C1A14] font-bold text-xs tracking-wide transition-colors cursor-pointer"
            >
              Unlock Admin Console
            </button>
          </form>

          <div className="pt-3 border-t border-emerald-900/80 space-y-2">
            <button
              type="button"
              onClick={() => loginAdmin('2026')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-[#DFC066] text-xs font-semibold transition-colors cursor-pointer"
            >
              ⚡ Instant Demo Admin Unlock (Passcode: 2026)
            </button>
            <button
              type="button"
              onClick={onBackToStore}
              className="w-full py-2 text-xs text-emerald-100/60 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Public Storefront
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-10 bg-[#FBF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Console Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EADBCE]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs font-semibold text-[#14382C] hover:border-[#C59B27] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </button>
            <span className="text-slate-300">/</span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#C59B27]">
                TGG × MetaWave Innovations LTD · Management Console
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#14382C]">
                Admin Portal &amp; Website CMS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {savedNotice && (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                ✓ {savedNotice}
              </span>
            )}
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#14382C] border border-[#EADBCE] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Export Orders CSV</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-[#EADBCE] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Workspace Grid: Horizontal App Tab Bar (< 1024px) + Sidebar (3 cols) + Main Content (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-1.5 sm:p-3 border border-[#EADBCE] flex lg:flex-col overflow-x-auto no-scrollbar gap-1.5 lg:gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Overview</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span>Orders &amp; Payments</span>
                </span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  ({orders.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Catalog</span>
                </span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  ({products.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('website-cms')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'website-cms'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>Website CMS</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('customize-options')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'customize-options'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 shrink-0" />
                  <span>Form &amp; SQL</span>
                </span>
              </button>
            </div>

            {/* Quick KPI Summary Card */}
            <div className="hidden lg:block bg-[#14382C] text-white rounded-2xl p-5 border border-[#C59B27]/40 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#DFC066]">
                Database Sync Active
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                All edits to Hero copy, products, prices, form options, and order statuses update the live website immediately.
              </p>
            </div>
          </aside>

          {/* Main Viewport (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-[#EADBCE]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Total Revenue
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-[#14382C] mt-1 tabular-nums">
                      PKR {metrics.totalRevenue.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Across {metrics.totalOrders} bookings
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-[#EADBCE]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Active Pipeline
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-[#C59B27] mt-1 tabular-nums">
                      {metrics.activeCount} Orders
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      In preparation / transit
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-[#EADBCE]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Payment Split
                    </span>
                    <div className="font-mono text-sm font-bold text-slate-900 mt-2 tabular-nums">
                      Card: {metrics.cardOrders} · COD: {metrics.codOrders} · Transfer:{' '}
                      {metrics.transferOrders}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      All 3 modes enabled
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-[#EADBCE]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Live Catalog
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-[#14382C] mt-1 tabular-nums">
                      {metrics.catalogCount} Items
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Hampers &amp; gift sets
                    </span>
                  </div>
                </div>

                {/* Recent Orders Action Table */}
                <div className="bg-white rounded-2xl border border-[#EADBCE] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#EADBCE] flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-serif font-bold text-[#14382C]">
                        Recent Gift Bookings &amp; Quick Status Control
                      </h2>
                      <p className="text-xs text-slate-500">
                        Update status directly or click any row to open the full Order Inspector
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#14382C] hover:text-[#C59B27] cursor-pointer"
                    >
                      Open Full Orders Manager →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FBF9F5] border-b border-[#EADBCE] text-slate-500 uppercase text-[11px]">
                          <th className="py-3 px-4 font-semibold">Order ID</th>
                          <th className="py-3 px-4 font-semibold">Sender &amp; Recipient</th>
                          <th className="py-3 px-4 font-semibold">Product</th>
                          <th className="py-3 px-4 font-semibold">Payment</th>
                          <th className="py-3 px-4 font-semibold">Stage</th>
                          <th className="py-3 px-4 font-semibold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EADBCE]">
                        {orders.slice(0, 6).map((ord) => (
                          <tr
                            key={ord.id}
                            onClick={() => {
                              setInspectingOrderId(ord.id);
                              setActiveTab('orders');
                            }}
                            className="hover:bg-[#FBF9F5] cursor-pointer transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#14382C] tabular-nums">
                              {ord.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">{ord.fullName}</div>
                              <div className="text-[11px] text-slate-500">
                                To: {ord.recipientName} ({ord.city})
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-800">
                              {ord.selectedProductName || ord.giftType}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">
                                {ord.paymentMethodType || 'Transfer'}
                              </div>
                              <div className="text-[11px] text-slate-500">{ord.paymentStatus}</div>
                            </td>
                            <td
                              className="py-3.5 px-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                value={ord.status}
                                onChange={(e) => {
                                  updateOrderStatus(ord.id, e.target.value as OrderStatus);
                                  triggerSavedToast(`Order ${ord.id} updated to ${e.target.value}`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#F4EFE6] border border-[#C59B27]/40 text-xs font-semibold text-[#14382C]"
                              >
                                {ALL_ORDER_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right tabular-nums">
                              PKR {ord.amountPKR.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: ORDERS & PAYMENTS MANAGER */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Filter Bar */}
                <div className="bg-white rounded-2xl p-5 border border-[#EADBCE] space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-serif font-bold text-[#14382C]">
                      Orders, Dispatch &amp; Payment Verification
                    </h2>
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search ID, Sender, Phone, City..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {['All', ...ALL_ORDER_STATUSES].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#14382C] text-white'
                            : 'bg-[#F4EFE6] text-slate-700 hover:bg-[#EADBCE]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Order Inspector */}
                {inspectedOrder && (
                  <div className="bg-white rounded-2xl p-6 border border-[#C59B27]/60 space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C59B27]">
                          Inspecting Order · {inspectedOrder.id}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-[#14382C] mt-0.5">
                          {inspectedOrder.selectedProductName || inspectedOrder.giftType}{' '}
                          {inspectedOrder.selectedProductTier
                            ? `(${inspectedOrder.selectedProductTier})`
                            : ''}{' '}
                          × {inspectedOrder.quantity || 1}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${inspectedOrder.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Assalam-o-Alaikum ${inspectedOrder.fullName}! Update from The Gift Gallery regarding your Order *${inspectedOrder.id}* (${inspectedOrder.selectedProductName || inspectedOrder.giftType}): Status is now *${inspectedOrder.status}*.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#DFC066]" />
                          <span>WhatsApp Client</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            deleteOrder(inspectedOrder.id);
                            triggerSavedToast(`Order ${inspectedOrder.id} deleted.`);
                          }}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 3-Column Breakdown: Contact, Address, Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-1">
                        <div className="text-[10px] font-semibold uppercase text-slate-400">
                          1. Sender Contact Details
                        </div>
                        <div className="font-bold text-slate-900">{inspectedOrder.fullName}</div>
                        <div className="font-mono text-slate-700 tabular-nums">
                          WhatsApp: {inspectedOrder.whatsappNumber}
                        </div>
                        {inspectedOrder.email && (
                          <div className="text-slate-600">Email: {inspectedOrder.email}</div>
                        )}
                        {inspectedOrder.instagramHandle && (
                          <div className="text-slate-600">IG: {inspectedOrder.instagramHandle}</div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-1">
                        <div className="text-[10px] font-semibold uppercase text-slate-400">
                          2. Recipient &amp; Address Details
                        </div>
                        <div className="font-bold text-slate-900">
                          {inspectedOrder.recipientName}
                          {inspectedOrder.recipientPhone ? ` (${inspectedOrder.recipientPhone})` : ''}
                        </div>
                        <div className="text-slate-700">
                          {inspectedOrder.deliveryAddress}, {inspectedOrder.city}{' '}
                          {inspectedOrder.postalCode || ''}
                        </div>
                        <div className="font-mono text-[#14382C] font-semibold tabular-nums">
                          Slot: {inspectedOrder.deliveryDate} · {inspectedOrder.deliveryTime}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-1">
                        <div className="text-[10px] font-semibold uppercase text-slate-400">
                          3. Payment Details ({inspectedOrder.paymentMethodType || 'Transfer'})
                        </div>
                        <div className="font-mono text-base font-bold text-[#14382C] tabular-nums">
                          PKR {inspectedOrder.amountPKR.toLocaleString()}
                        </div>
                        <div className="text-slate-700 font-medium">
                          {inspectedOrder.paymentMethod}
                        </div>
                        {inspectedOrder.paymentReference && (
                          <div className="font-mono text-[11px] text-slate-500">
                            Ref: {inspectedOrder.paymentReference}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Editable Controls for Status, Payment Status, Courier Tracking, Concierge Note */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Order Stage
                        </label>
                        <select
                          value={inspectedOrder.status}
                          onChange={(e) => {
                            updateOrderStatus(
                              inspectedOrder.id,
                              e.target.value as OrderStatus
                            );
                            triggerSavedToast('Order stage updated.');
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-semibold text-[#14382C]"
                        >
                          {ALL_ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Payment Status
                        </label>
                        <select
                          value={inspectedOrder.paymentStatus}
                          onChange={(e) => {
                            updateOrderPayment(
                              inspectedOrder.id,
                              e.target.value as PaymentStatus
                            );
                            triggerSavedToast('Payment status updated.');
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-semibold text-[#14382C]"
                        >
                          {ALL_PAYMENT_STATUSES.map((ps) => (
                            <option key={ps} value={ps}>
                              {ps}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Courier / Rider Tracking Code
                        </label>
                        <input
                          type="text"
                          value={inspectedOrder.courierTracking || ''}
                          onChange={(e) =>
                            updateOrderStatus(
                              inspectedOrder.id,
                              inspectedOrder.status,
                              inspectedOrder.conciergeNote,
                              e.target.value
                            )
                          }
                          placeholder="e.g. TGG-LHR-HAND-099"
                          className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Live Concierge Note (Visible in Customer&apos;s User Portal)
                      </label>
                      <input
                        type="text"
                        value={inspectedOrder.conciergeNote || ''}
                        onChange={(e) =>
                          updateOrderStatus(
                            inspectedOrder.id,
                            inspectedOrder.status,
                            e.target.value,
                            inspectedOrder.courierTracking
                          )
                        }
                        placeholder="Write live preparation or dispatch update for customer..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {/* Orders List */}
                <div className="bg-white rounded-2xl border border-[#EADBCE] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FBF9F5] border-b border-[#EADBCE] text-slate-500 uppercase text-[11px]">
                          <th className="py-3 px-4 font-semibold">Order ID</th>
                          <th className="py-3 px-4 font-semibold">Customer</th>
                          <th className="py-3 px-4 font-semibold">Recipient &amp; City</th>
                          <th className="py-3 px-4 font-semibold">Gift</th>
                          <th className="py-3 px-4 font-semibold">Payment</th>
                          <th className="py-3 px-4 font-semibold">Stage</th>
                          <th className="py-3 px-4 font-semibold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EADBCE]">
                        {filteredOrders.map((ord) => (
                          <tr
                            key={ord.id}
                            onClick={() => setInspectingOrderId(ord.id)}
                            className={`cursor-pointer transition-colors ${
                              inspectedOrder?.id === ord.id
                                ? 'bg-[#F4EFE6]'
                                : 'hover:bg-[#FBF9F5]'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#14382C] tabular-nums">
                              {ord.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">{ord.fullName}</div>
                              <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                                {ord.whatsappNumber}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">
                              {ord.recipientName} · {ord.city}
                            </td>
                            <td className="py-3.5 px-4 text-slate-800">
                              {ord.selectedProductName || ord.giftType}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">{ord.paymentStatus}</td>
                            <td className="py-3.5 px-4 font-semibold text-[#14382C]">
                              {ord.status}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right tabular-nums">
                              PKR {ord.amountPKR.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCTS & CATALOG MANAGER */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#14382C]">
                      Live Storefront Product Catalog ({products.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Add new gift hampers, edit prices, or update product descriptions on the live website
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewProductForm(!showNewProductForm)}
                      className="px-4 py-2.5 rounded-xl bg-[#14382C] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#DFC066]" />
                      <span>Add New Gift Product</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetCatalog();
                        triggerSavedToast('Catalog restored to default items.');
                      }}
                      className="px-3 py-2.5 rounded-xl bg-[#F4EFE6] text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Reset catalog to default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {showNewProductForm && (
                  <form
                    onSubmit={handleCreateProductSubmit}
                    className="p-5 rounded-xl bg-[#FBF9F5] border border-[#C59B27]/40 space-y-4"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">
                      Create New Storefront Gift / Hamper
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="e.g. Royal Oud & Chronograph Set"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          placeholder="Anniversary Gifts, Snacks Basket..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Price Display (PKR) *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          placeholder="PKR 6,500 – 14,000"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Image Path or URL
                        </label>
                        <input
                          type="text"
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Short Tagline
                        </label>
                        <input
                          type="text"
                          value={prodTagline}
                          onChange={(e) => setProdTagline(e.target.value)}
                          placeholder="Bespoke Luxury Edition"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Describe what is inside this gift box..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewProductForm(false)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                      >
                        Publish Product
                      </button>
                    </div>
                  </form>
                )}

                {editingProduct && (
                  <div className="p-5 rounded-xl bg-[#F4EFE6] border border-[#14382C]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#14382C]">
                        Editing Product: {editingProduct.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        Done Editing ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => {
                            const updated = { ...editingProduct, name: e.target.value };
                            setEditingProduct(updated);
                            updateProduct(editingProduct.id, { name: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editingProduct.category}
                          onChange={(e) => {
                            const updated = { ...editingProduct, category: e.target.value };
                            setEditingProduct(updated);
                            updateProduct(editingProduct.id, { category: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Price Display
                        </label>
                        <input
                          type="text"
                          value={editingProduct.priceDisplay}
                          onChange={(e) => {
                            const updated = { ...editingProduct, priceDisplay: e.target.value };
                            setEditingProduct(updated);
                            updateProduct(editingProduct.id, { priceDisplay: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) => {
                          const updated = { ...editingProduct, description: e.target.value };
                          setEditingProduct(updated);
                          updateProduct(editingProduct.id, { description: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#EADBCE] shrink-0">
                          <OptimizedImage
                            src={p.image}
                            alt={p.name}
                            aspectRatio="aspect-square"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase text-[#C59B27]">
                            {p.category} {p.isPopular ? '· ★ Featured' : ''}
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#14382C] truncate">
                            {p.name}
                          </h3>
                          <div className="font-mono text-xs text-slate-600 tabular-nums">
                            {p.priceDisplay}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            updateProduct(p.id, { isPopular: !p.isPopular })
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                            p.isPopular
                              ? 'bg-[#14382C] text-[#DFC066] border-[#14382C]'
                              : 'bg-white text-slate-500 border-[#EADBCE]'
                          }`}
                        >
                          ★
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="p-2 rounded-lg bg-white border border-[#EADBCE] text-slate-700 hover:text-[#14382C] cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteProduct(p.id);
                            triggerSavedToast(`Deleted ${p.name}`);
                          }}
                          className="p-2 rounded-lg bg-white border border-[#EADBCE] text-slate-400 hover:text-red-600 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: HERO & WEBSITE CONTENT CMS */}
            {activeTab === 'website-cms' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#14382C]">
                      Website, Hero Section &amp; Checkout Settings CMS
                    </h2>
                    <p className="text-xs text-slate-500">
                      Update the live Hero headline, imagery, brand philosophy, WhatsApp/Instagram links, and delivery fees
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetSiteSettings();
                      triggerSavedToast('Website settings restored to defaults.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#F4EFE6] text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Top Bar & Hero Copy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Top Bar Announcement Text
                      </label>
                      <input
                        type="text"
                        value={siteSettings.announcementText}
                        onChange={(e) =>
                          updateSiteSettings({ announcementText: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Top Bar Notice Period Text
                      </label>
                      <input
                        type="text"
                        value={siteSettings.noticePeriodText}
                        onChange={(e) =>
                          updateSiteSettings({ noticePeriodText: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Headline Prefix
                      </label>
                      <input
                        type="text"
                        value={siteSettings.heroHeadlinePrefix}
                        onChange={(e) =>
                          updateSiteSettings({ heroHeadlinePrefix: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Headline Gold Highlight
                      </label>
                      <input
                        type="text"
                        value={siteSettings.heroHeadlineHighlight}
                        onChange={(e) =>
                          updateSiteSettings({ heroHeadlineHighlight: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Supporting Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={siteSettings.heroSubtitle}
                        onChange={(e) =>
                          updateSiteSettings({ heroSubtitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Showcase Image Path / URL
                      </label>
                      <input
                        type="text"
                        value={siteSettings.heroImageUrl}
                        onChange={(e) =>
                          updateSiteSettings({ heroImageUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Review Quote
                      </label>
                      <input
                        type="text"
                        value={siteSettings.heroReviewQuote}
                        onChange={(e) =>
                          updateSiteSettings({ heroReviewQuote: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                    </div>
                  </div>

                  {/* Checkout Fees & Bank / Wallet Details */}
                  <div className="pt-4 border-t border-[#EADBCE]">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-3">
                      Checkout Payment &amp; Delivery Fee Settings
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Standard Delivery Fee (PKR)
                        </label>
                        <input
                          type="number"
                          value={siteSettings.standardDeliveryFeePKR}
                          onChange={(e) =>
                            updateSiteSettings({
                              standardDeliveryFeePKR: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Midnight Delivery Fee (PKR)
                        </label>
                        <input
                          type="number"
                          value={siteSettings.midnightDeliveryFeePKR}
                          onChange={(e) =>
                            updateSiteSettings({
                              midnightDeliveryFeePKR: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Free Delivery Threshold (PKR)
                        </label>
                        <input
                          type="number"
                          value={siteSettings.freeDeliveryThresholdPKR}
                          onChange={(e) =>
                            updateSiteSettings({
                              freeDeliveryThresholdPKR: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-mono tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Raqami Account Editor */}
                      <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#14382C]">
                          Raqami Account (Digital Bank / Wallet)
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={siteSettings.raqamiAccount.bankName}
                            onChange={(e) =>
                              updateSiteSettings({
                                raqamiAccount: {
                                  ...siteSettings.raqamiAccount,
                                  bankName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Account Title
                          </label>
                          <input
                            type="text"
                            value={siteSettings.raqamiAccount.accountTitle}
                            onChange={(e) =>
                              updateSiteSettings({
                                raqamiAccount: {
                                  ...siteSettings.raqamiAccount,
                                  accountTitle: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              Account Number
                            </label>
                            <input
                              type="text"
                              value={siteSettings.raqamiAccount.accountNumber}
                              onChange={(e) =>
                                updateSiteSettings({
                                  raqamiAccount: {
                                    ...siteSettings.raqamiAccount,
                                    accountNumber: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              IBAN
                            </label>
                            <input
                              type="text"
                              value={siteSettings.raqamiAccount.iban}
                              onChange={(e) =>
                                updateSiteSettings({
                                  raqamiAccount: {
                                    ...siteSettings.raqamiAccount,
                                    iban: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* MCB Account Editor */}
                      <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#14382C]">
                          MCB Account (Bank Transfer)
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={siteSettings.mcbAccount.bankName}
                            onChange={(e) =>
                              updateSiteSettings({
                                mcbAccount: {
                                  ...siteSettings.mcbAccount,
                                  bankName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Account Title
                          </label>
                          <input
                            type="text"
                            value={siteSettings.mcbAccount.accountTitle}
                            onChange={(e) =>
                              updateSiteSettings({
                                mcbAccount: {
                                  ...siteSettings.mcbAccount,
                                  accountTitle: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              Account Number
                            </label>
                            <input
                              type="text"
                              value={siteSettings.mcbAccount.accountNumber}
                              onChange={(e) =>
                                updateSiteSettings({
                                  mcbAccount: {
                                    ...siteSettings.mcbAccount,
                                    accountNumber: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              IBAN
                            </label>
                            <input
                              type="text"
                              value={siteSettings.mcbAccount.iban}
                              onChange={(e) =>
                                updateSiteSettings({
                                  mcbAccount: {
                                    ...siteSettings.mcbAccount,
                                    iban: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      triggerSavedToast('Website & Hero CMS changes published live!')
                    }
                    className="px-6 py-3 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white text-xs font-semibold cursor-pointer"
                  >
                    Save &amp; Publish Website Changes
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMIZE OPTIONS, FORMS & SUPABASE SCHEMA */}
            {activeTab === 'customize-options' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBCE] space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-[#14382C]">
                        Order Form &amp; Checkout Customization Options
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage packaging add-ons, gift types, delivery time slots, budget ranges, and cities
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetFormOptions();
                        triggerSavedToast('Form options restored to defaults.');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#F4EFE6] text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Options</span>
                    </button>
                  </div>

                  {/* 1. Packaging Add-Ons Manager */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-3">
                      Bespoke Packaging &amp; Luxury Add-Ons
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                      {formOptions.packagingAddons.map((addon) => (
                        <div
                          key={addon.id}
                          className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-800">{addon.name}</span>
                            <span className="font-mono text-[#C59B27] ml-2 tabular-nums">
                              {addon.pricePKR === 0
                                ? 'Free'
                                : `+PKR ${addon.pricePKR.toLocaleString()}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              updateFormOptions({
                                packagingAddons: formOptions.packagingAddons.filter(
                                  (a) => a.id !== addon.id
                                ),
                              })
                            }
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={newAddonName}
                        onChange={(e) => setNewAddonName(e.target.value)}
                        placeholder="New Add-on Name (e.g. Polaroid Photo Strip)"
                        className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                      />
                      <input
                        type="number"
                        value={newAddonPrice}
                        onChange={(e) => setNewAddonPrice(e.target.value)}
                        placeholder="Price PKR"
                        className="w-28 px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newAddonName.trim()) return;
                          updateFormOptions({
                            packagingAddons: [
                              ...formOptions.packagingAddons,
                              {
                                id: `addon-${Date.now()}`,
                                name: newAddonName.trim(),
                                pricePKR: Number(newAddonPrice) || 0,
                              },
                            ],
                          });
                          setNewAddonName('');
                          triggerSavedToast('Packaging add-on added.');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                      >
                        + Add Add-On
                      </button>
                    </div>
                  </div>

                  {/* 2. Gift Types & Cities Manager */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EADBCE]">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-2">
                        Occasion / Gift Types ({formOptions.giftTypes.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {formOptions.giftTypes.map((gt) => (
                          <span
                            key={gt}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBF9F5] border border-[#EADBCE] text-xs text-slate-700"
                          >
                            <span>{gt}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateFormOptions({
                                  giftTypes: formOptions.giftTypes.filter((x) => x !== gt),
                                })
                              }
                              className="text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGiftType}
                          onChange={(e) => setNewGiftType(e.target.value)}
                          placeholder="Add Gift Type (e.g. Eid Hamper)"
                          className="flex-1 px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newGiftType.trim()) return;
                            updateFormOptions({
                              giftTypes: [...formOptions.giftTypes, newGiftType.trim()],
                            });
                            setNewGiftType('');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-2">
                        Active Delivery Cities ({formOptions.cities.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {formOptions.cities.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBF9F5] border border-[#EADBCE] text-xs text-slate-700"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateFormOptions({
                                  cities: formOptions.cities.filter((x) => x !== c),
                                })
                              }
                              className="text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="Add City (e.g. Bahawalpur)"
                          className="flex-1 px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newCity.trim()) return;
                            updateFormOptions({
                              cities: [...formOptions.cities, newCity.trim()],
                            });
                            setNewCity('');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Delivery Slots & Budget Ranges Manager */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EADBCE]">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-2">
                        Delivery Time Slots ({formOptions.deliverySlots.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {formOptions.deliverySlots.map((slot) => (
                          <span
                            key={slot}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBF9F5] border border-[#EADBCE] text-xs text-slate-700"
                          >
                            <span>{slot}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateFormOptions({
                                  deliverySlots: formOptions.deliverySlots.filter(
                                    (x) => x !== slot
                                  ),
                                })
                              }
                              className="text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                          placeholder="Add Slot (e.g. 10 AM – 1 PM Morning)"
                          className="flex-1 px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newSlot.trim()) return;
                            updateFormOptions({
                              deliverySlots: [...formOptions.deliverySlots, newSlot.trim()],
                            });
                            setNewSlot('');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] mb-2">
                        Budget Ranges ({formOptions.budgetRanges.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {formOptions.budgetRanges.map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBF9F5] border border-[#EADBCE] text-xs text-slate-700"
                          >
                            <span>{b}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateFormOptions({
                                  budgetRanges: formOptions.budgetRanges.filter((x) => x !== b),
                                })
                              }
                              className="text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newBudget}
                          onChange={(e) => setNewBudget(e.target.value)}
                          placeholder="Add Budget Range (e.g. PKR 30,000 – 50,000)"
                          className="flex-1 px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newBudget.trim()) return;
                            updateFormOptions({
                              budgetRanges: [...formOptions.budgetRanges, newBudget.trim()],
                            });
                            setNewBudget('');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supabase SQL Schema Reference Card */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#14382C]" />
                      <h3 className="text-sm font-serif font-bold text-[#14382C]">
                        Supabase PostgreSQL Schema &amp; RLS Policies
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] hover:bg-[#EADBCE] text-xs font-semibold text-[#14382C] flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSql ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copied SQL!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy SQL Schema</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0C1A14] text-emerald-100/90 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
