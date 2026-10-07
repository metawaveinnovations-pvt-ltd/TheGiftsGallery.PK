import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { OrderStatus, PaymentStatus, PortalOrder, Product } from '../types';
import {
  SUPABASE_SQL_SCHEMA,
  SUPABASE_PROJECT_URL,
  SUPABASE_SQL_EDITOR_URL,
  generateFullSupabaseBootstrapSQL,
} from '../lib/supabase';
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
  ExternalLink,
  RefreshCw,
  Crown,
  Briefcase,
  Users,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
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
    categories,
    occasions,
    policies,
    siteSettings,
    formOptions,
    userProfile,
    savedRecipients,
    wishlistIds,
    seoMetadata,
    socialPages,
    knowledgeBase,
    contacts,
    formSubmissions,
    isAdminAuthenticated,
    adminRole,
    setAdminRole,
    isSyncingDb,
    lastSyncReport,
    lastSavedDbTimestamp,
    syncFullDatabase,
    pullFromActiveDatabase,
    uploadChangesToDb,
    fetchLastSavedDbData,
    resetAllToOriginal,
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
    updateSeoMetadata,
    updateSocialPages,
    updateKnowledgeBase,
    updateContacts,
  } = usePortal();

  const [loginEmail, setLoginEmail] = useState('owner@startos');
  const [loginPassword, setLoginPassword] = useState('zoha');
  const [loginRoleSelect, setLoginRoleSelect] = useState<'owner' | 'manager'>('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const isOwner = adminRole === 'owner';
  const isManager = adminRole === 'manager';

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'orders'
    | 'products'
    | 'website-cms'
    | 'customize-options'
    | 'seo-knowledge-db'
    | 'staff-roles'
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
    '/assets/images/tgg_snack_chocolate_basket_1790253121230.jpg'
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
  const [copiedFullSeedSql, setCopiedFullSeedSql] = useState(false);
  const [supabaseAccessToken, setSupabaseAccessToken] = useState('');
  const [sqlPreviewMode, setSqlPreviewMode] = useState<'full-seed' | 'schema-only'>('full-seed');

  const triggerSavedToast = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(''), 3500);
  };

  const fullBootstrapAndSeedSQL = useMemo(
    () =>
      generateFullSupabaseBootstrapSQL({
        orders,
        products,
        categories,
        occasions,
        policies,
        siteSettings,
        formOptions,
        userProfile,
        savedRecipients,
        wishlistIds,
        seoMetadata,
        socialPages,
        knowledgeBase,
        contacts,
        formSubmissions,
      }),
    [
      orders,
      products,
      categories,
      occasions,
      policies,
      siteSettings,
      formOptions,
      userProfile,
      savedRecipients,
      wishlistIds,
      seoMetadata,
      socialPages,
      knowledgeBase,
      contacts,
      formSubmissions,
    ]
  );

  const handleUploadChangesToDb = async () => {
    const res = await uploadChangesToDb({
      accessToken: supabaseAccessToken.trim() || undefined,
    });
    triggerSavedToast(res.message);
  };

  const handleFetchLastSavedDbData = async () => {
    const res = await fetchLastSavedDbData();
    triggerSavedToast(res.message);
  };

  const handleResetToOriginal = async () => {
    const res = await resetAllToOriginal();
    triggerSavedToast(res.message);
  };

  const handleFullDatabaseSync = async () => {
    const res = await syncFullDatabase({
      accessToken: supabaseAccessToken.trim() || undefined,
    });
    if (res.status === 'synced') {
      triggerSavedToast(
        `Synced ${res.recordsPushed} records across ${res.tablesSynced.length} Supabase tables & updated website!`
      );
    } else {
      await uploadChangesToDb({
        accessToken: supabaseAccessToken.trim() || undefined,
      });
      triggerSavedToast(
        'All changes uploaded & saved to active DB snapshot!'
      );
    }
  };

  const handlePullActiveDb = async () => {
    const res = await fetchLastSavedDbData();
    triggerSavedToast(res.message);
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
      image: prodImage.trim() || '/assets/images/tgg_snack_chocolate_basket_1790253121230.jpg',
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
      <section className="py-16 md:py-24 bg-[#0C1A14] text-[#FBF9F5] min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-[#14382C] rounded-3xl p-6 sm:p-8 border border-[#C59B27]/40 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0C1A14] text-[#DFC066] flex items-center justify-center mx-auto border border-[#C59B27]/40 shadow-md mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#DFC066] mb-1">
              THE GIFT GALLERY • MANAGEMENT CONSOLE
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Executive Access Portal
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed max-w-sm mx-auto">
              Secure administrative access for Sovereign Owner and Store Operations Manager.
            </p>
          </div>

          {/* Role Mode Selector Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0C1A14] border border-[#C59B27]/30 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setLoginRoleSelect('owner');
                setLoginEmail('owner@startos');
                setLoginPassword('zoha');
                setAuthError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                loginRoleSelect === 'owner'
                  ? 'bg-[#DFC066] text-[#0C1A14] font-bold shadow-sm'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Owner Role</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginRoleSelect('manager');
                setLoginEmail('manager@startos');
                setLoginPassword('zoha');
                setAuthError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                loginRoleSelect === 'manager'
                  ? 'bg-[#DFC066] text-[#0C1A14] font-bold shadow-sm'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Manager Role</span>
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/90 border border-red-500/50 text-xs text-red-200 text-center animate-shake">
              {authError}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginAdmin(loginEmail, loginPassword);
              if (!ok) {
                setAuthError(
                  loginRoleSelect === 'owner'
                    ? 'Invalid credentials for Owner. Use owner@startos with password zoha.'
                    : 'Invalid credentials for Manager. Use manager@startos with password zoha.'
                );
              } else {
                setAuthError('');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#DFC066] mb-1.5 text-left">
                Username / Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/40 pointer-events-none" />
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={loginRoleSelect === 'owner' ? 'owner@startos' : 'manager@startos'}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0C1A14] border border-[#C59B27]/40 text-sm text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-[#DFC066]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#DFC066]">
                  Password
                </label>
                <span className="text-[10px] text-emerald-200/60 font-mono">
                  Default: zoha
                </span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/40 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password (zoha)"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0C1A14] border border-[#C59B27]/40 text-sm text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-[#DFC066]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-100/50 hover:text-white p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-[#DFC066] hover:bg-[#e7c973] text-[#0C1A14] font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                Unlock Console as {loginRoleSelect === 'owner' ? 'Owner' : 'Manager'}
              </span>
            </button>
          </form>

          {/* Quick One-Click Unlock Actions */}
          <div className="pt-4 border-t border-emerald-900/80 space-y-2.5">
            <div className="text-[10px] uppercase tracking-wider text-emerald-200/60 text-center font-semibold">
              Instant Verified 1-Click Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLoginRoleSelect('owner');
                  setLoginEmail('owner@startos');
                  setLoginPassword('zoha');
                  loginAdmin('owner@startos', 'zoha');
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#DFC066] text-xs font-semibold transition-all border border-[#C59B27]/30 flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Login as Owner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginRoleSelect('manager');
                  setLoginEmail('manager@startos');
                  setLoginPassword('zoha');
                  loginAdmin('manager@startos', 'zoha');
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#DFC066] text-xs font-semibold transition-all border border-[#C59B27]/30 flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Login as Manager</span>
              </button>
            </div>

            {/* Configured Role Credentials Legend */}
            <div className="p-3 rounded-xl bg-[#0C1A14]/90 border border-[#C59B27]/25 text-[11px] text-emerald-100/90 space-y-1.5 text-left">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[#DFC066] font-semibold flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Owner:
                </span>
                <span className="text-white">owner@startos</span>
                <span className="text-slate-400">pass: <strong className="text-[#DFC066]">zoha</strong></span>
              </div>
              <div className="flex items-center justify-between font-mono pt-1 border-t border-emerald-900/60">
                <span className="text-[#DFC066] font-semibold flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Manager:
                </span>
                <span className="text-white">manager@startos</span>
                <span className="text-slate-400">pass: <strong className="text-[#DFC066]">zoha</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={onBackToStore}
              className="w-full py-2 text-xs text-emerald-100/60 hover:text-white transition-colors cursor-pointer text-center block"
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
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C59B27]">
                  TGG × MetaWave Innovations LTD · Management Console
                </span>
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 font-bold text-[10px]">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span>Owner (owner@startos)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-900 font-bold text-[10px]">
                    <Briefcase className="w-3 h-3 text-blue-600" />
                    <span>Manager (manager@startos)</span>
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#14382C]">
                Admin Portal &amp; Website CMS
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {savedNotice && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800 animate-in fade-in duration-150">
                ✓ {savedNotice}
              </span>
            )}
            {/* Quick Role Switcher Button */}
            <button
              type="button"
              onClick={() => {
                const nextRole = isOwner ? 'manager' : 'owner';
                setAdminRole(nextRole);
                try {
                  sessionStorage.setItem('tgg_portal_admin_role_v1', nextRole);
                } catch {
                  // ignore
                }
                triggerSavedToast(
                  `Switched session to ${nextRole === 'owner' ? 'Owner (owner@startos)' : 'Manager (manager@startos)'}`
                );
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="Toggle view between Owner (owner@startos) and Manager (manager@startos)"
            >
              {isOwner ? (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                  <span>Test Manager View</span>
                </>
              ) : (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Switch to Owner View</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isSyncingDb}
              onClick={handleUploadChangesToDb}
              className="px-3 py-1.5 rounded-lg bg-[#14382C] hover:bg-[#0D261E] text-[#FBF9F5] border border-[#C59B27]/45 hover:border-[#DFC066] text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98] disabled:opacity-60 whitespace-nowrap"
              title="Upload all current website & admin changes to active DB"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#DFC066] ${isSyncingDb ? 'animate-spin' : ''}`} />
              <span>{isSyncingDb ? 'Uploading...' : 'Upload Changes to DB'}</span>
            </button>
            <button
              type="button"
              disabled={isSyncingDb}
              onClick={handleFetchLastSavedDbData}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4EFE6] text-[#14382C] border border-[#EADBCE] hover:border-[#C59B27]/60 text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 whitespace-nowrap"
              title="Fetch last saved data from DB and update website"
            >
              <Database className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Fetch DB Last Saved Data</span>
            </button>
            <button
              type="button"
              disabled={isSyncingDb || !isOwner}
              onClick={handleResetToOriginal}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-[0.98] whitespace-nowrap ${
                isOwner
                  ? 'bg-white hover:bg-[#F4EFE6] text-slate-700 hover:text-[#14382C] border border-[#EADBCE] hover:border-[#C59B27]/50'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
              }`}
              title={
                isOwner
                  ? 'Reset all catalog, settings & database records to original defaults'
                  : 'Master Reset restricted to owner@startos'
              }
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset to Original</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F4EFE6] text-[#14382C] border border-[#EADBCE] text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap"
              title="Export Orders CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="hidden xl:inline">CSV</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-[#EADBCE] text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap"
              title="Lock Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Lock</span>
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

              <button
                type="button"
                onClick={() => setActiveTab('seo-knowledge-db')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'seo-knowledge-db'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 shrink-0" />
                  <span>SEO, Social &amp; DB Records</span>
                </span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  (13 Tbls)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('staff-roles')}
                className={`min-h-[42px] shrink-0 lg:w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'staff-roles'
                    ? 'bg-[#14382C] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F4EFE6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0 text-[#C59B27]" />
                  <span>Staff &amp; Roles</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DFC066]/20 text-[#DFC066] font-mono font-bold">
                  2 Accounts
                </span>
              </button>
            </div>

            {/* Quick DB Status Card (Desktop Sidebar) */}
            <div className="hidden lg:block bg-white rounded-2xl p-4 border border-[#EADBCE] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#14382C]">
                  Active Database
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Connected</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                13 relational tables linked ({products.length} products, {orders.length} orders, SEO, social &amp; contacts).
              </p>
              {lastSavedDbTimestamp && (
                <div className="text-[10px] font-mono text-slate-400 tabular-nums">
                  Last saved: {new Date(lastSavedDbTimestamp).toLocaleTimeString()}
                </div>
              )}
              <div className="pt-1 flex flex-col gap-1.5">
                <button
                  type="button"
                  disabled={isSyncingDb}
                  onClick={handleUploadChangesToDb}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#14382C] hover:bg-[#0D261E] text-[#FBF9F5] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3 h-3 text-[#DFC066] ${isSyncingDb ? 'animate-spin' : ''}`} />
                  <span>Upload Changes to DB</span>
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    disabled={isSyncingDb}
                    onClick={handleFetchLastSavedDbData}
                    className="py-1.5 px-2 rounded-lg bg-[#FBF9F5] hover:bg-[#F4EFE6] text-[#14382C] border border-[#EADBCE] text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-60 truncate"
                  >
                    Fetch Saved
                  </button>
                  <button
                    type="button"
                    disabled={isSyncingDb}
                    onClick={handleResetToOriginal}
                    className="py-1.5 px-2 rounded-lg bg-[#FBF9F5] hover:bg-[#F4EFE6] text-slate-600 border border-[#EADBCE] text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-60 truncate"
                  >
                    Reset Original
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Viewport (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Sleek, Compact Database Control Bar */}
                <div className="bg-white rounded-2xl px-4 py-3.5 border border-[#EADBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] border border-[#EADBCE] flex items-center justify-center text-[#14382C] shrink-0">
                      <Database className="w-4 h-4 text-[#C59B27]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-[#14382C]">
                          Supabase Active Database Sync
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 truncate">
                          · {SUPABASE_PROJECT_URL.replace('https://', '')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {lastSyncReport
                          ? lastSyncReport.message
                          : `13 tables active · ${products.length} products, ${orders.length} orders, ${contacts.length} contacts & SEO synced`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={isSyncingDb}
                      onClick={handleUploadChangesToDb}
                      className="px-3 py-1.5 rounded-lg bg-[#14382C] hover:bg-[#0D261E] text-[#FBF9F5] text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer disabled:opacity-60 whitespace-nowrap"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#DFC066] ${isSyncingDb ? 'animate-spin' : ''}`} />
                      <span>Upload Changes to DB</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSyncingDb}
                      onClick={handleFetchLastSavedDbData}
                      className="px-3 py-1.5 rounded-lg bg-[#FBF9F5] hover:bg-[#F4EFE6] text-[#14382C] border border-[#EADBCE] text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer disabled:opacity-60 whitespace-nowrap"
                    >
                      <Database className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Fetch DB Last Saved Data</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSyncingDb}
                      onClick={handleResetToOriginal}
                      className="px-3 py-1.5 rounded-lg bg-[#FBF9F5] hover:bg-[#F4EFE6] text-slate-600 hover:text-[#14382C] border border-[#EADBCE] text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer disabled:opacity-60 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset to Original</span>
                    </button>
                  </div>
                </div>

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

                {/* Supabase Full Database Sync, Table Creator & Seed Console */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-[#14382C]" />
                        <h3 className="text-base font-serif font-bold text-[#14382C]">
                          Supabase Active Database Sync, Table Creator &amp; Data Seeder
                        </h3>
                      </div>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        Connected Project: {SUPABASE_PROJECT_URL}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isSyncingDb}
                        onClick={handleUploadChangesToDb}
                        className="px-3 py-1.5 rounded-lg bg-[#14382C] hover:bg-[#0D261E] text-xs font-medium text-[#FBF9F5] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-[#DFC066] ${isSyncingDb ? 'animate-spin' : ''}`} />
                        <span>
                          {isSyncingDb ? 'Uploading...' : 'Upload Changes to DB'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={isSyncingDb}
                        onClick={handleFetchLastSavedDbData}
                        className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] hover:bg-[#EADBCE] text-xs font-medium text-[#14382C] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        <Database className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Fetch DB Last Saved Data</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSyncingDb}
                        onClick={handleResetToOriginal}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4EFE6] border border-[#EADBCE] text-xs font-medium text-slate-600 hover:text-[#14382C] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset to Original</span>
                      </button>
                    </div>
                  </div>

                  {/* Table Inventory & Row Counts across all 13 Connected Tables */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { name: 'tgg_app_state', count: 15, label: 'Master CMS & Config Keys' },
                      { name: 'tgg_products', count: products.length, label: 'Gift Catalog (FK -> Categories)' },
                      { name: 'tgg_categories', count: categories.length, label: 'Store Categories' },
                      { name: 'tgg_occasions', count: occasions.length, label: 'Gift Occasions' },
                      { name: 'tgg_orders', count: orders.length, label: 'Orders (FK -> Products & Contacts)' },
                      {
                        name: 'tgg_form_submissions',
                        count: formSubmissions.length,
                        label: 'Form Submissions (FK -> Orders)',
                      },
                      {
                        name: 'tgg_contacts',
                        count: contacts.length,
                        label: 'Brand, Banks, Partner & Customers',
                      },
                      {
                        name: 'tgg_seo_metadata',
                        count: seoMetadata.length,
                        label: 'SEO, OpenGraph & JSON-LD Pages',
                      },
                      {
                        name: 'tgg_social_pages',
                        count: socialPages.length,
                        label: 'Social Channels & IG Feed Posts',
                      },
                      {
                        name: 'tgg_knowledge_base',
                        count: knowledgeBase.length,
                        label: 'FAQs, How It Works & Delivery Info',
                      },
                      { name: 'tgg_policies', count: policies.length, label: 'Storefront Policies' },
                      {
                        name: 'tgg_recipients',
                        count: savedRecipients.length,
                        label: 'Saved Recipients Address Book',
                      },
                      { name: 'todos', count: 3, label: 'Concierge Operational Checklist' },
                    ].map((tbl) => (
                      <div
                        key={tbl.name}
                        className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[11px] font-bold text-[#14382C]">
                            {tbl.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#C59B27] tabular-nums">
                            {tbl.count} rows
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">{tbl.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sync Report Status Banner */}
                  {lastSyncReport && (
                    <div
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        lastSyncReport.status === 'synced'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>
                          {lastSyncReport.status === 'synced'
                            ? '✓ Active Database Synchronized'
                            : '⚡ Initial Table Creation Required in Supabase'}
                        </span>
                        <span className="font-mono text-[11px] opacity-75">
                          {new Date(lastSyncReport.lastSyncedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="leading-relaxed">{lastSyncReport.message}</p>
                    </div>
                  )}

                  {/* Option A: Automatic API Table Creation via Personal Access Token */}
                  <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-2.5">
                    <div className="text-xs font-semibold text-[#14382C]">
                      Automatic Table Creation &amp; Data Push (Optional Supabase Personal Access Token)
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      To let the Admin Console automatically execute <code className="font-mono">CREATE TABLE</code> and seed all 8 tables via the Supabase Management API without opening the SQL Editor, paste a Supabase Personal Access Token (<code className="font-mono">sbp_...</code>) and click <strong>Sync &amp; Push All Website Data</strong>:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="password"
                        value={supabaseAccessToken}
                        onChange={(e) => setSupabaseAccessToken(e.target.value)}
                        placeholder="Optional: sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx (for 1-click auto DDL)"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#EADBCE] text-xs font-mono"
                      />
                      <button
                        type="button"
                        disabled={isSyncingDb}
                        onClick={handleFullDatabaseSync}
                        className="px-4 py-2 rounded-xl bg-[#14382C] text-white text-xs font-semibold cursor-pointer shrink-0 disabled:opacity-60"
                      >
                        Auto-Create Tables &amp; Push Data
                      </button>
                    </div>
                  </div>

                  {/* Option B: 1-Click Full CREATE TABLE + INSERT DATA SQL Script */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSqlPreviewMode('full-seed')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            sqlPreviewMode === 'full-seed'
                              ? 'bg-[#14382C] text-white'
                              : 'bg-[#F4EFE6] text-slate-700'
                          }`}
                        >
                          Full CREATE TABLE + INSERT All Website Data SQL
                        </button>
                        <button
                          type="button"
                          onClick={() => setSqlPreviewMode('schema-only')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            sqlPreviewMode === 'schema-only'
                              ? 'bg-[#14382C] text-white'
                              : 'bg-[#F4EFE6] text-slate-700'
                          }`}
                        >
                          CREATE TABLE Schema Only
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const sqlToCopy =
                              sqlPreviewMode === 'full-seed'
                                ? fullBootstrapAndSeedSQL
                                : SUPABASE_SQL_SCHEMA;
                            navigator.clipboard.writeText(sqlToCopy);
                            setCopiedSql(true);
                            setTimeout(() => setCopiedSql(false), 2500);
                            triggerSavedToast(
                              'Copied complete CREATE TABLE + INSERT DATA SQL script!'
                            );
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#DFC066] hover:bg-[#e7c973] text-xs font-bold text-[#0C1A14] flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedSql ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-900" />
                              <span>Copied Complete SQL!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Full CREATE TABLE + INSERT SQL</span>
                            </>
                          )}
                        </button>

                        <a
                          href={SUPABASE_SQL_EDITOR_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-[#F4EFE6] hover:bg-[#EADBCE] text-xs font-semibold text-[#14382C] flex items-center gap-1.5"
                        >
                          <span>Open Supabase SQL Editor</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <pre className="p-4 rounded-xl bg-[#0C1A14] text-emerald-100/90 font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed">
                      {sqlPreviewMode === 'full-seed'
                        ? fullBootstrapAndSeedSQL
                        : SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SEO, SOCIAL PAGES, KNOWLEDGE BASE, CONTACTS & FORM SUBMISSIONS */}
            {activeTab === 'seo-knowledge-db' && (
              <div className="space-y-6">
                {/* 1. SEO Pages, OpenGraph & Schema.org Structured Data Manager */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADBCE] pb-4">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C59B27]">
                        TABLE: public.tgg_seo_metadata ({seoMetadata.length} Pages)
                      </span>
                      <h2 className="text-lg font-serif font-bold text-[#14382C]">
                        SEO Pages, OpenGraph, Twitter Cards &amp; Popular Search Keywords
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleFullDatabaseSync}
                      className="px-3.5 py-2 rounded-xl bg-[#14382C] text-[#DFC066] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDb ? 'animate-spin' : ''}`} />
                      <span>Sync SEO to Supabase</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {seoMetadata.map((seo, idx) => (
                      <div
                        key={seo.id}
                        className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-[#14382C]">
                            {seo.pageName} ({seo.pagePath})
                          </span>
                          <span className="font-mono text-[11px] text-[#C59B27]">
                            Schema.org: {seo.schemaOrgType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Page Title (&lt;title&gt; &amp; og:title)
                            </label>
                            <input
                              type="text"
                              value={seo.pageTitle}
                              onChange={(e) => {
                                const next = [...seoMetadata];
                                next[idx] = {
                                  ...seo,
                                  pageTitle: e.target.value,
                                  ogTitle: e.target.value,
                                };
                                updateSeoMetadata(next);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Canonical URL &amp; GEO Region
                            </label>
                            <input
                              type="text"
                              value={seo.canonicalUrl}
                              onChange={(e) => {
                                const next = [...seoMetadata];
                                next[idx] = { ...seo, canonicalUrl: e.target.value };
                                updateSeoMetadata(next);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                          </label>
                          <textarea
                            rows={2}
                            value={seo.metaDescription}
                            onChange={(e) => {
                              const next = [...seoMetadata];
                              next[idx] = {
                                ...seo,
                                metaDescription: e.target.value,
                                ogDescription: e.target.value,
                              };
                              updateSeoMetadata(next);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Footer Popular Search Breadcrumb Tags
                          </label>
                          <input
                            type="text"
                            value={seo.popularSearchTags}
                            onChange={(e) => {
                              const next = [...seoMetadata];
                              next[idx] = { ...seo, popularSearchTags: e.target.value };
                              updateSeoMetadata(next);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Social Media Channels & Instagram Feed Posts (public.tgg_social_pages) */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-4">
                  <div className="border-b border-[#EADBCE] pb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C59B27]">
                      TABLE: public.tgg_social_pages ({socialPages.length} Records)
                    </span>
                    <h2 className="text-lg font-serif font-bold text-[#14382C]">
                      Social Media Profiles &amp; Live Instagram Feed Posts
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {socialPages.map((soc, idx) => (
                      <div
                        key={soc.id}
                        className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#14382C]">
                            {soc.platform} · {soc.entryType === 'official_channel' ? 'Official Channel' : 'Feed Post'}
                          </span>
                          <span className="font-mono text-[11px] text-[#C59B27]">
                            {soc.likesCount}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={soc.handle}
                          onChange={(e) => {
                            const next = [...socialPages];
                            next[idx] = { ...soc, handle: e.target.value };
                            updateSocialPages(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={soc.caption}
                          onChange={(e) => {
                            const next = [...socialPages];
                            next[idx] = { ...soc, caption: e.target.value };
                            updateSocialPages(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Info & Knowledge Base (public.tgg_knowledge_base) */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-4">
                  <div className="border-b border-[#EADBCE] pb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C59B27]">
                      TABLE: public.tgg_knowledge_base ({knowledgeBase.length} Entries)
                    </span>
                    <h2 className="text-lg font-serif font-bold text-[#14382C]">
                      Gifting Guide FAQs, How It Works Steps &amp; Delivery Service Pillars
                    </h2>
                  </div>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {knowledgeBase.map((kb, idx) => (
                      <div
                        key={kb.id}
                        className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold uppercase text-[#14382C]">
                            [{kb.sectionType}] #{kb.stepOrOrder} · {kb.categoryTag}
                          </span>
                          <span className="font-mono text-slate-400">{kb.id}</span>
                        </div>
                        <input
                          type="text"
                          value={kb.titleOrQuestion}
                          onChange={(e) => {
                            const next = [...knowledgeBase];
                            next[idx] = { ...kb, titleOrQuestion: e.target.value };
                            updateKnowledgeBase(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs font-bold text-[#14382C]"
                        />
                        <textarea
                          rows={2}
                          value={kb.contentOrAnswer}
                          onChange={(e) => {
                            const next = [...knowledgeBase];
                            next[idx] = { ...kb, contentOrAnswer: e.target.value };
                            updateKnowledgeBase(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Contacts Directory (public.tgg_contacts) */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-4">
                  <div className="border-b border-[#EADBCE] pb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C59B27]">
                      TABLE: public.tgg_contacts ({contacts.length} Contacts)
                    </span>
                    <h2 className="text-lg font-serif font-bold text-[#14382C]">
                      Official Brand, Raqami &amp; MCB Bank Accounts, Tech Partner &amp; Customer Contacts
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#EADBCE] text-[11px] text-slate-500 uppercase">
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Name / Title</th>
                          <th className="py-2.5 px-3">WhatsApp / Contact</th>
                          <th className="py-2.5 px-3">City / Account / IBAN</th>
                          <th className="py-2.5 px-3">Role / Linked Order</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {contacts.map((ct) => (
                          <tr key={ct.id} className="hover:bg-[#FBF9F5]">
                            <td className="py-2.5 px-3 font-mono text-[11px] text-[#C59B27] font-semibold">
                              {ct.contactType}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#14382C]">{ct.fullName}</td>
                            <td className="py-2.5 px-3 font-mono tabular-nums">{ct.whatsappNumber}</td>
                            <td className="py-2.5 px-3 text-slate-600">{ct.address}</td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {ct.roleOrRelationship}
                              {ct.linkedOrderId ? ` (${ct.linkedOrderId})` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Form Submissions Log (public.tgg_form_submissions) */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-4">
                  <div className="border-b border-[#EADBCE] pb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C59B27]">
                      TABLE: public.tgg_form_submissions ({formSubmissions.length} Submissions)
                    </span>
                    <h2 className="text-lg font-serif font-bold text-[#14382C]">
                      Custom Order Form &amp; Checkout Submissions (Connected to Orders &amp; Products)
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#EADBCE] text-[11px] text-slate-500 uppercase">
                          <th className="py-2.5 px-3">Submission ID</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Linked Order</th>
                          <th className="py-2.5 px-3">Sender &amp; WhatsApp</th>
                          <th className="py-2.5 px-3">Recipient &amp; City</th>
                          <th className="py-2.5 px-3">Gift Type &amp; Budget</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-[#FBF9F5]">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#14382C] tabular-nums">
                              {sub.id}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-[#C59B27]">
                              {sub.submissionType}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-xs text-emerald-800 font-semibold tabular-nums">
                              {sub.linkedOrderId || '—'}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-slate-900">{sub.fullName}</div>
                              <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                                {sub.whatsappNumber}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-medium text-slate-800">{sub.recipientName}</div>
                              <div className="text-[11px] text-slate-500">{sub.city}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-medium text-[#14382C]">{sub.giftType}</div>
                              <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                                {sub.budgetRange}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Staff & Roles Management Tab */}
            {activeTab === 'staff-roles' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#C59B27] mb-1">
                      <Users className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>ACCESS CONTROL ARCHITECTURE</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#14382C]">
                      Staff &amp; Executive Roles Management
                    </h2>
                    <p className="text-xs text-slate-600 font-light mt-1 max-w-xl">
                      Two distinct operational roles configured with granular permissions: Sovereign Owner for full master control and Store Operations Manager for daily orders, courier dispatch &amp; payment verification.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FBF9F5] border border-[#EADBCE] shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-medium">Current Active Session:</div>
                      <div className="text-xs font-bold text-[#14382C] flex items-center gap-1 justify-end">
                        {isOwner ? (
                          <>
                            <Crown className="w-3.5 h-3.5 text-amber-600" />
                            <span>owner@startos</span>
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            <span>manager@startos</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextRole = isOwner ? 'manager' : 'owner';
                        setAdminRole(nextRole);
                        try {
                          sessionStorage.setItem('tgg_portal_admin_role_v1', nextRole);
                        } catch {
                          // ignore
                        }
                        triggerSavedToast(
                          `Active session switched to ${nextRole === 'owner' ? 'Owner (owner@startos)' : 'Manager (manager@startos)'}`
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#14382C] text-[#DFC066] text-xs font-semibold hover:bg-[#0D261E] transition-colors cursor-pointer"
                    >
                      {isOwner ? 'Switch to Manager' : 'Switch to Owner'}
                    </button>
                  </div>
                </div>

                {/* Dual Role Accounts Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account 1: Sovereign Owner */}
                  <div className={`rounded-2xl p-6 border transition-all ${
                    isOwner
                      ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-300 shadow-md ring-1 ring-amber-300'
                      : 'bg-white border-[#EADBCE] shadow-xs'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center border border-amber-300/50">
                          <Crown className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            MASTER ADMINISTRATOR
                          </div>
                          <h3 className="text-lg font-serif font-bold text-[#14382C]">
                            Sovereign Owner Role
                          </h3>
                        </div>
                      </div>

                      {isOwner ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active Now</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Configured</span>
                      )}
                    </div>

                    {/* Credentials Info Box */}
                    <div className="p-4 rounded-xl bg-white border border-amber-200/80 mb-5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Work Email / Username:</span>
                        <span className="font-mono font-bold text-[#14382C] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          owner@startos
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Master Password:</span>
                        <span className="font-mono font-bold text-[#14382C] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          zoha
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Access Level:</span>
                        <span className="font-bold text-amber-800">100% Unrestricted Sovereign Authority</span>
                      </div>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-2 mb-6 text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                        Owner Granted Capabilities:
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>All orders, revenue metrics, status &amp; card/COD payment verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Full product catalog creation, tier pricing &amp; product deletion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Website CMS, Hero typography, announcement bar &amp; brand guidelines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Custom order form options (cities, delivery slots, budget tiers, add-ons)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Full Supabase database synchronization &amp; master factory resets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Staff account access &amp; credential management</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminRole('owner');
                        try {
                          sessionStorage.setItem('tgg_portal_admin_role_v1', 'owner');
                        } catch {
                          // ignore
                        }
                        triggerSavedToast('Session switched to Owner (owner@startos)');
                      }}
                      disabled={isOwner}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isOwner
                          ? 'bg-amber-100 text-amber-900 cursor-default opacity-80'
                          : 'bg-[#14382C] hover:bg-[#0D261E] text-[#DFC066] cursor-pointer shadow-sm'
                      }`}
                    >
                      <Crown className="w-4 h-4" />
                      <span>{isOwner ? '✓ Active Session (Owner)' : 'Switch Session to Owner'}</span>
                    </button>
                  </div>

                  {/* Account 2: Store Operations Manager */}
                  <div className={`rounded-2xl p-6 border transition-all ${
                    isManager
                      ? 'bg-gradient-to-b from-blue-50/70 to-white border-blue-300 shadow-md ring-1 ring-blue-300'
                      : 'bg-white border-[#EADBCE] shadow-xs'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-700 flex items-center justify-center border border-blue-300/50">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                            OPERATIONS SPECIALIST
                          </div>
                          <h3 className="text-lg font-serif font-bold text-[#14382C]">
                            Store Operations Manager Role
                          </h3>
                        </div>
                      </div>

                      {isManager ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span>Active Now</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Configured</span>
                      )}
                    </div>

                    {/* Credentials Info Box */}
                    <div className="p-4 rounded-xl bg-white border border-blue-200/80 mb-5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Work Email / Username:</span>
                        <span className="font-mono font-bold text-[#14382C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          manager@startos
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Operational Password:</span>
                        <span className="font-mono font-bold text-[#14382C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          zoha
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Access Level:</span>
                        <span className="font-bold text-blue-800">Operational &amp; Order Fulfillment Authority</span>
                      </div>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-2 mb-6 text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                        Manager Granted Capabilities:
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Live orders queue, status updates &amp; courier tracking numbers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Payment verification (Card, Bank Transfer, COD settlement)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Customer concierge communication &amp; direct WhatsApp messaging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Product catalog inventory view, price updates &amp; signature badge toggle</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-slate-400">✕</span>
                        <span>Product deletion &amp; catalog purging (Restricted to owner@startos)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-slate-400">✕</span>
                        <span>Factory database reset &amp; credential modification (Restricted to owner@startos)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminRole('manager');
                        try {
                          sessionStorage.setItem('tgg_portal_admin_role_v1', 'manager');
                        } catch {
                          // ignore
                        }
                        triggerSavedToast('Session switched to Manager (manager@startos)');
                      }}
                      disabled={isManager}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isManager
                          ? 'bg-blue-100 text-blue-900 cursor-default opacity-80'
                          : 'bg-[#14382C] hover:bg-[#0D261E] text-[#DFC066] cursor-pointer shadow-sm'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>{isManager ? '✓ Active Session (Manager)' : 'Switch Session to Manager'}</span>
                    </button>
                  </div>
                </div>

                {/* Role Matrix Comparison Table */}
                <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] space-y-4">
                  <div className="border-b border-[#EADBCE] pb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C59B27]">
                      SECURITY &amp; COMPLIANCE MATRIX
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#14382C]">
                      Role Capabilities &amp; Permission Breakdown
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#EADBCE] text-[11px] text-slate-500 uppercase bg-[#FBF9F5]">
                          <th className="py-3 px-4">Feature / Action</th>
                          <th className="py-3 px-4 text-center">Owner (owner@startos)</th>
                          <th className="py-3 px-4 text-center">Manager (manager@startos)</th>
                          <th className="py-3 px-4">Operational Policy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Orders Queue &amp; Inspection</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-slate-500">Both roles can monitor active, handcrafting &amp; completed orders.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Update Order Status &amp; Courier Tracking</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-slate-500">Essential manager duty to advance orders from review to delivery.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Card &amp; Bank Transfer Verification</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-slate-500">Manager verifies bank slips and marks payments as verified.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Direct WhatsApp Customer Dispatch</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-slate-500">Instant 1-click customer chats for address clarification &amp; card photos.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Product Price &amp; Stock Updates</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-600">Update Allowed</td>
                          <td className="py-3 px-4 text-slate-500">Manager can adjust retail prices and mark popular items.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Delete Product or Delete Order</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Allowed</td>
                          <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">Protected (Owner Only)</td>
                          <td className="py-3 px-4 text-slate-500">Prevents accidental data loss during busy delivery shifts.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Website CMS &amp; Announcement Bar</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Full Access</td>
                          <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">View Only</td>
                          <td className="py-3 px-4 text-slate-500">Brand identity &amp; marketing text maintained by the owner.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Master Factory DB Reset &amp; Push</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">Allowed</td>
                          <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">Protected (Owner Only)</td>
                          <td className="py-3 px-4 text-slate-500">Database resets require sovereign owner authorization.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

