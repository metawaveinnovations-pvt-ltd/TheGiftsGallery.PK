import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  Category,
  Occasion,
  PolicyItem,
  OrderFormData,
  PortalOrder,
  OrderStatus,
  PaymentStatus,
  CheckoutDraft,
  SavedRecipient,
  UserProfile,
  SiteSettings,
  FormCustomizeOptions,
} from '../types';
import {
  PRODUCTS,
  CATEGORIES,
  OCCASIONS,
  POLICIES,
  BRAND_INFO,
} from '../data/products';
import {
  supabase,
  isSupabaseConnected,
  syncStateToSupabase,
  fetchAllStateFromSupabase,
} from '../lib/supabase';

const STORAGE_KEYS = {
  ORDERS: 'tgg_portal_orders_v2',
  PRODUCTS: 'tgg_portal_products_v2',
  PROFILE: 'tgg_portal_user_profile_v2',
  RECIPIENTS: 'tgg_portal_recipients_v2',
  WISHLIST: 'tgg_portal_wishlist_v2',
  USER_AUTH: 'tgg_portal_user_auth_v2',
  ADMIN_AUTH: 'tgg_portal_admin_auth_v2',
  SITE_SETTINGS: 'tgg_portal_site_settings_v3',
  FORM_OPTIONS: 'tgg_portal_form_options_v2',
  CATEGORIES: 'tgg_portal_categories_v2',
  OCCASIONS: 'tgg_portal_occasions_v2',
  POLICIES: 'tgg_portal_policies_v2',
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  announcementText: '✨ Nationwide Delivery Across Pakistan',
  noticePeriodText: '1–2 Days Prior Notice',
  heroEyebrow: 'THE GIFT GALLERY • TGG',
  heroHeadlinePrefix: 'Gifts for',
  heroHeadlineHighlight: 'Every Moment.',
  heroSubtitle:
    'Thoughtfully curated gifts, beautifully presented and made to turn ordinary moments into memorable ones.',
  heroImageUrl: '/assets/images/tgg_hero_curated_gifting_1790253103850.jpg',
  heroCaptionTag: 'Signature Hampers & Bespoke Boxes',
  heroCaptionTitle: 'Curated with devotion, delivered with grace.',
  heroReviewQuote: '“The best surprise service in Pakistan!”',
  heroReviewAuthor: 'Verified Client · Lahore & Karachi',
  heroTrustBadge1: 'Nationwide PK Delivery',
  heroTrustBadge2: 'Handcrafted Packaging',
  heroTrustBadge3: 'Personalized Touch',
  brandPhilosophyTitle: 'Thoughtfully Chosen. Beautifully Gifted.',
  brandPhilosophyQuote:
    '“At The Gift Gallery, we believe a gift is more than an object — it is a feeling, a memory, and a way of saying ‘you matter.’”',
  whatsappNumber: BRAND_INFO.whatsappNumber,
  whatsappUrl: BRAND_INFO.whatsappUrl,
  instagramHandle: BRAND_INFO.instagramHandle,
  instagramUrl: BRAND_INFO.instagramUrl,
  raqamiAccount: {
    bankName: 'Raqami Islamic Digital Bank',
    accountTitle: 'Ali Hassan',
    accountNumber: '025335144063',
    iban: 'PK91RQMI0000025335144063',
  },
  mcbAccount: {
    bankName: 'MCB Bank',
    accountTitle: 'ALI HASSAN',
    accountNumber: '1481617251004009',
    iban: 'PK87MUCB1481617251004009',
  },
  bankTransferDetails:
    'Raqami Islamic Digital Bank · Title: Ali Hassan · Acc: 025335144063 · IBAN: PK91RQMI0000025335144063',
  easypaisaJazzcashDetails:
    'MCB Bank · Title: ALI HASSAN · Acc: 1481617251004009 · IBAN: PK87MUCB1481617251004009',
  standardDeliveryFeePKR: 350,
  freeDeliveryThresholdPKR: 10000,
  midnightDeliveryFeePKR: 600,
};

export const INITIAL_FORM_OPTIONS: FormCustomizeOptions = {
  giftTypes: [
    'Birthday Gift',
    'Anniversary Gift',
    'Special Gifts for Him',
    'Personalized Gift',
    'Gift Hamper',
    'Romantic Gift',
    'Graduation Gift',
    'New Baby Gift',
    'Family Gift',
    'Surprise Gift',
  ],
  giftForOptions: [
    'Her',
    'Him',
    'Wife / Husband',
    'Mother / Father',
    'Sister / Brother',
    'Friend',
    'Couple',
    'Colleague',
  ],
  budgetRanges: [
    'PKR 2,000 – 5,000',
    'PKR 5,000 – 10,000',
    'PKR 10,000 – 18,000',
    'PKR 18,000 – 30,000+',
  ],
  deliverySlots: [
    '1 PM – 4 PM (Afternoon)',
    '4 PM – 7 PM (Evening)',
    '7 PM – 10 PM (Night)',
    '12:00 AM Midnight Surprise (Special)',
  ],
  cities: [
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
  ],
  packagingAddons: [
    { id: 'addon-velvet-box', name: 'Signature Emerald Rigid Magnetic Box', pricePKR: 800 },
    { id: 'addon-gold-card', name: 'Handwritten Gold-Foil Vow Card', pricePKR: 0 },
    { id: 'addon-eternity-rose', name: 'Preserved Eternity Rose Add-on', pricePKR: 1200 },
    { id: 'addon-ferrero', name: 'Imported Ferrero Rocher 8pc Pack', pricePKR: 1500 },
    { id: 'addon-balloons', name: 'Celebration Helium Balloons Bouquet', pricePKR: 950 },
  ],
};

const INITIAL_USER_PROFILE: UserProfile = {
  fullName: 'Ayesha Khan',
  whatsappNumber: '0300 4589210',
  instagramHandle: '@ayeshakhan.pk',
  email: 'ayesha.khan@example.com',
  city: 'Lahore',
  defaultAddress: 'House 42-B, Street 8, Phase 5 DHA, Lahore',
  memberSince: 'January 2026',
};

const INITIAL_RECIPIENTS: SavedRecipient[] = [
  {
    id: 'rec-1',
    name: 'Zainab Ali',
    relationship: 'Sister',
    occasion: 'Birthday',
    date: '2026-10-14',
    city: 'Lahore',
    address: 'Block Y, Phase 3 DHA, Lahore',
    notes: 'Loves Ferrero Rocher, pastel silk scrunchies, and rose-gold bracelets.',
  },
  {
    id: 'rec-2',
    name: 'Hamza Tariq',
    relationship: 'Spouse',
    occasion: 'Anniversary',
    date: '2026-11-02',
    city: 'Lahore',
    address: 'House 42-B, Street 8, Phase 5 DHA, Lahore',
    notes: 'Prefers woody oud fragrances, matte black chronograph watch sets.',
  },
  {
    id: 'rec-3',
    name: 'Mrs. Farida Begum',
    relationship: 'Mother',
    occasion: 'Family Celebration',
    date: '2026-12-05',
    city: 'Islamabad',
    address: 'Street 14, Sector F-7/2, Islamabad',
    notes: 'Enjoys luxury dry fruit & imported chocolate hampers with gold-foil card.',
  },
];

const INITIAL_ORDERS: PortalOrder[] = [
  {
    id: 'TGG-2026-8492',
    createdAt: '2026-09-28T14:20:00Z',
    updatedAt: '2026-09-29T09:15:00Z',
    fullName: 'Ayesha Khan',
    whatsappNumber: '0300 4589210',
    email: 'ayesha.khan@example.com',
    instagramHandle: '@ayeshakhan.pk',
    giftType: 'Anniversary Gift',
    giftFor: 'Him',
    selectedProductId: 'watch-perfume-combo-him',
    selectedProductName: 'Executive Watch & Perfume Box for Him',
    selectedProductTier: 'Large (Premium)',
    quantity: 1,
    budgetRange: 'PKR 18,500',
    subtotalPKR: 18500,
    deliveryFeePKR: 0,
    amountPKR: 18500,
    deliveryDate: '2026-10-01',
    deliveryTime: '7 PM – 10 PM',
    recipientName: 'Hamza Tariq',
    recipientPhone: '0300 9821440',
    personalMessage: 'Happy Anniversary! Every moment with you is a timeless blessing.',
    specialRequests: 'Emerald velvet ribbon with gold wax seal and dark chocolate add-on.',
    city: 'Lahore',
    postalCode: '54792',
    deliveryAddress: 'House 42-B, Street 8, Phase 5 DHA, Lahore',
    status: 'Handcrafting',
    paymentMethodType: 'Card',
    paymentStatus: 'Paid via Card',
    paymentMethod: 'Debit / Credit Card (•••• 4821)',
    cardLast4: '4821',
    paymentReference: 'AUTH-994821',
    courierTracking: 'TGG-LHR-HAND-092',
    conciergeNote:
      'Chronograph timepiece and prestige bottle arranged in emerald rigid box. Pre-dispatch photo scheduled for 4:00 PM.',
  },
  {
    id: 'TGG-2026-8487',
    createdAt: '2026-09-25T11:05:00Z',
    updatedAt: '2026-09-27T19:40:00Z',
    fullName: 'Ayesha Khan',
    whatsappNumber: '0300 4589210',
    email: 'ayesha.khan@example.com',
    instagramHandle: '@ayeshakhan.pk',
    giftType: 'Birthday Gift',
    giftFor: 'Her',
    selectedProductId: 'jewelry-makeup-basket',
    selectedProductName: 'Velvet Jewelry & Makeup Basket',
    selectedProductTier: 'Medium',
    quantity: 1,
    budgetRange: 'PKR 6,500',
    subtotalPKR: 6500,
    deliveryFeePKR: 0,
    amountPKR: 6500,
    deliveryDate: '2026-09-27',
    deliveryTime: '4 PM – 7 PM',
    recipientName: 'Zainab Ali',
    recipientPhone: '0321 4401928',
    personalMessage: 'Wishing the happiest birthday to my dearest sister!',
    specialRequests: 'Include rose-gold charm bracelet and pastel blush tones.',
    city: 'Lahore',
    postalCode: '54792',
    deliveryAddress: 'Block Y, Phase 3 DHA, Lahore',
    status: 'Delivered',
    paymentMethodType: 'Transfer',
    paymentStatus: 'Transfer Verified',
    paymentMethod: 'Bank Transfer / Raast (TID #783920)',
    paymentReference: 'TID-783920',
    courierTracking: 'TGG-LHR-HAND-074',
    conciergeNote:
      'Delivered directly to recipient at 5:18 PM in pristine celebration condition.',
  },
  {
    id: 'TGG-2026-8499',
    createdAt: '2026-09-29T10:30:00Z',
    updatedAt: '2026-09-29T11:00:00Z',
    fullName: 'Saad Mahmood',
    whatsappNumber: '0321 8923411',
    email: 'saad.mahmood@example.com',
    instagramHandle: '@saad.m_khi',
    giftType: 'Birthday Gift',
    giftFor: 'Her',
    selectedProductId: 'snacks-chocolates-basket',
    selectedProductName: 'Artisan Snacks & Chocolates Basket',
    selectedProductTier: 'Large (Premium)',
    quantity: 1,
    budgetRange: 'PKR 5,500',
    subtotalPKR: 5000,
    deliveryFeePKR: 500,
    amountPKR: 5500,
    deliveryDate: '2026-10-02',
    deliveryTime: '12:00 AM Midnight Surprise',
    recipientName: 'Mahira Saad',
    recipientPhone: '0321 8923412',
    personalMessage: 'Happy Birthday my love! Here is to sweet memories ahead.',
    specialRequests:
      'Midnight 12:00 AM doorstep surprise with extra Ferrero Rocher & balloons.',
    city: 'Karachi',
    postalCode: '75600',
    deliveryAddress: 'Clifton Block 4, Near Abdullah Shah Ghazi, Karachi',
    status: 'Design Confirmed',
    paymentMethodType: 'Transfer',
    paymentStatus: 'Transfer Verified',
    paymentMethod: 'Raast Instant Transfer (TID #910442)',
    paymentReference: 'TID-910442',
    courierTracking: 'TGG-KHI-MID-019',
    conciergeNote: 'Midnight surprise rider slot reserved for Oct 2 at 12:00 AM sharp.',
  },
  {
    id: 'TGG-2026-8503',
    createdAt: '2026-09-29T13:45:00Z',
    updatedAt: '2026-09-29T13:45:00Z',
    fullName: 'Usman Qureshi',
    whatsappNumber: '0333 5120984',
    email: 'usman.q@example.com',
    instagramHandle: '@usmanq_isb',
    giftType: 'Corporate / Event Gift',
    giftFor: 'Colleague',
    selectedProductId: 'wallet-chain-combo-him',
    selectedProductName: 'Signature Leather Wallet & Chain Set',
    selectedProductTier: 'Medium',
    quantity: 1,
    budgetRange: 'PKR 7,500',
    subtotalPKR: 7200,
    deliveryFeePKR: 300,
    amountPKR: 7500,
    deliveryDate: '2026-10-03',
    deliveryTime: '1 PM – 4 PM',
    recipientName: 'Bilal Ahmed',
    recipientPhone: '0333 9981201',
    personalMessage: 'Congratulations on your promotion and leadership milestone!',
    specialRequests: 'Executive matte black magnetic packaging with gold foil monogram.',
    city: 'Islamabad',
    postalCode: '44000',
    deliveryAddress: 'Blue Area, Jinnah Avenue Tower, Islamabad',
    status: 'Pending Review',
    paymentMethodType: 'COD',
    paymentStatus: 'COD - Pay on Delivery',
    paymentMethod: 'Cash on Delivery (COD)',
    courierTracking: '',
    conciergeNote: 'COD verification call scheduled with sender prior to dispatch.',
  },
];

export function parseAmountFromBudget(budgetRange: string): number {
  const cleaned = budgetRange.replace(/,/g, '');
  const matches = cleaned.match(/\d+/g);
  if (!matches || matches.length === 0) return 5000;
  if (matches.length === 1) return parseInt(matches[0], 10);
  const first = parseInt(matches[0], 10);
  const second = parseInt(matches[1], 10);
  return Math.round((first + second) / 2);
}

interface PortalContextValue {
  orders: PortalOrder[];
  products: Product[];
  categories: Category[];
  occasions: Occasion[];
  policies: PolicyItem[];
  siteSettings: SiteSettings;
  formOptions: FormCustomizeOptions;
  userProfile: UserProfile;
  savedRecipients: SavedRecipient[];
  wishlistIds: string[];
  isUserAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isSupabaseConnected: boolean;
  authModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  loginUser: (emailOrPhone: string, password?: string) => boolean;
  signupUser: (data: {
    fullName: string;
    whatsappNumber: string;
    email: string;
    city: string;
    defaultAddress?: string;
    instagramHandle?: string;
  }) => void;
  logoutUser: () => void;
  activeTrackedOrderId: string | null;
  setActiveTrackedOrderId: (id: string | null) => void;
  checkoutDraft: CheckoutDraft | null;
  setCheckoutDraft: (draft: CheckoutDraft | null) => void;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  createOrderFromForm: (
    formData: OrderFormData,
    selectedProduct?: Product,
    selectedTier?: string
  ) => PortalOrder;
  submitCheckoutOrder: (
    payload: Omit<PortalOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => PortalOrder;
  createManualOrder: (
    orderData: Omit<PortalOrder, 'id' | 'createdAt' | 'updatedAt'>
  ) => PortalOrder;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    conciergeNote?: string,
    courierTracking?: string
  ) => void;
  updateOrderPayment: (
    orderId: string,
    paymentStatus: PaymentStatus,
    amountPKR?: number
  ) => void;
  deleteOrder: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;
  updateFormOptions: (updates: Partial<FormCustomizeOptions>) => void;
  resetFormOptions: () => void;
  updateCategories: (cats: Category[]) => void;
  updateOccasions: (occs: Occasion[]) => void;
  updatePolicies: (pols: PolicyItem[]) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addRecipient: (recipient: Omit<SavedRecipient, 'id'>) => void;
  deleteRecipient: (id: string) => void;
  toggleWishlist: (productId: string) => void;
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<PortalOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  const [occasions, setOccasions] = useState<Occasion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OCCASIONS);
      return saved ? JSON.parse(saved) : OCCASIONS;
    } catch {
      return OCCASIONS;
    }
  });

  const [policies, setPolicies] = useState<PolicyItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POLICIES);
      return saved ? JSON.parse(saved) : POLICIES;
    } catch {
      return POLICIES;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
      return saved ? { ...INITIAL_SITE_SETTINGS, ...JSON.parse(saved) } : INITIAL_SITE_SETTINGS;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  const [formOptions, setFormOptions] = useState<FormCustomizeOptions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM_OPTIONS);
      return saved ? { ...INITIAL_FORM_OPTIONS, ...JSON.parse(saved) } : INITIAL_FORM_OPTIONS;
    } catch {
      return INITIAL_FORM_OPTIONS;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECIPIENTS);
      return saved ? JSON.parse(saved) : INITIAL_RECIPIENTS;
    } catch {
      return INITIAL_RECIPIENTS;
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved
        ? JSON.parse(saved)
        : ['snacks-chocolates-basket', 'watch-perfume-combo-him', 'jewelry-makeup-basket'];
    } catch {
      return ['snacks-chocolates-basket', 'watch-perfume-combo-him', 'jewelry-makeup-basket'];
    }
  });

  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('');
  const pendingAuthCallbackRef = useRef<(() => void) | null>(null);

  const [activeTrackedOrderId, setActiveTrackedOrderId] = useState<string | null>(
    'TGG-2026-8492'
  );
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft | null>(null);

  // Hydrate from Supabase if connected
  useEffect(() => {
    let mounted = true;
    if (isSupabaseConnected) {
      fetchAllStateFromSupabase().then((remote) => {
        if (!mounted || !remote) return;
        if (remote.orders) setOrders(remote.orders as PortalOrder[]);
        if (remote.products) setProducts(remote.products as Product[]);
        if (remote.siteSettings)
          setSiteSettings((prev) => ({ ...prev, ...(remote.siteSettings as SiteSettings) }));
        if (remote.formOptions)
          setFormOptions((prev) => ({
            ...prev,
            ...(remote.formOptions as FormCustomizeOptions),
          }));
        if (remote.categories) setCategories(remote.categories as Category[]);
        if (remote.occasions) setOccasions(remote.occasions as Occasion[]);
        if (remote.policies) setPolicies(remote.policies as PolicyItem[]);
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      syncStateToSupabase('orders', orders);
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      syncStateToSupabase('products', products);
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(siteSettings));
      syncStateToSupabase('siteSettings', siteSettings);
    } catch {
      // ignore
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_OPTIONS, JSON.stringify(formOptions));
      syncStateToSupabase('formOptions', formOptions);
    } catch {
      // ignore
    }
  }, [formOptions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      syncStateToSupabase('categories', categories);
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OCCASIONS, JSON.stringify(occasions));
      syncStateToSupabase('occasions', occasions);
    } catch {
      // ignore
    }
  }, [occasions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
      syncStateToSupabase('policies', policies);
    } catch {
      // ignore
    }
  }, [policies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify(savedRecipients));
    } catch {
      // ignore
    }
  }, [savedRecipients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const openAuthModal = (reason?: string, onSuccess?: () => void) => {
    setAuthModalReason(
      reason ||
        'Sign in or create your complimentary account to proceed to Checkout and track your orders.'
    );
    pendingAuthCallbackRef.current = onSuccess || null;
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    pendingAuthCallbackRef.current = null;
  };

  const loginUser = (emailOrPhone: string): boolean => {
    const clean = emailOrPhone.trim();
    if (!clean) return false;
    setIsUserAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_AUTH, 'true');
    } catch {
      // ignore
    }
    if (clean.includes('@')) {
      setUserProfile((prev) => ({ ...prev, email: clean }));
    } else {
      setUserProfile((prev) => ({ ...prev, whatsappNumber: clean }));
    }
    setAuthModalOpen(false);
    if (pendingAuthCallbackRef.current) {
      const cb = pendingAuthCallbackRef.current;
      pendingAuthCallbackRef.current = null;
      setTimeout(() => cb(), 50);
    }
    return true;
  };

  const signupUser = (data: {
    fullName: string;
    whatsappNumber: string;
    email: string;
    city: string;
    defaultAddress?: string;
    instagramHandle?: string;
  }) => {
    setUserProfile({
      fullName: data.fullName,
      whatsappNumber: data.whatsappNumber,
      email: data.email,
      city: data.city,
      defaultAddress: data.defaultAddress || '',
      instagramHandle: data.instagramHandle || '',
      memberSince: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    });
    setIsUserAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_AUTH, 'true');
    } catch {
      // ignore
    }
    setAuthModalOpen(false);
    if (pendingAuthCallbackRef.current) {
      const cb = pendingAuthCallbackRef.current;
      pendingAuthCallbackRef.current = null;
      setTimeout(() => cb(), 50);
    }
  };

  const logoutUser = () => {
    setIsUserAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_AUTH);
    } catch {
      // ignore
    }
  };

  const loginAdmin = (passcode: string): boolean => {
    const clean = passcode.trim().toLowerCase();
    if (
      clean === '2026' ||
      clean === 'admin' ||
      clean === 'tgg2026' ||
      clean === 'metawave' ||
      clean === 'metawave.innovations@gmail.com'
    ) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {
      // ignore
    }
  };

  const createOrderFromForm = (
    formData: OrderFormData,
    selectedProduct?: Product,
    selectedTier?: string
  ): PortalOrder => {
    const randomNum = Math.floor(8510 + Math.random() * 1400);
    const now = new Date().toISOString();
    const amount = parseAmountFromBudget(formData.budgetRange);
    const newOrder: PortalOrder = {
      id: `TGG-2026-${randomNum}`,
      createdAt: now,
      updatedAt: now,
      fullName: formData.fullName,
      whatsappNumber: formData.whatsappNumber,
      instagramHandle: formData.instagramHandle,
      giftType: formData.giftType,
      giftFor: formData.giftFor,
      selectedProductId: selectedProduct?.id,
      selectedProductName: selectedProduct?.name,
      selectedProductTier: selectedTier,
      quantity: 1,
      budgetRange: formData.budgetRange,
      subtotalPKR: amount,
      deliveryFeePKR: 0,
      amountPKR: amount,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      recipientName: formData.recipientName || formData.giftFor,
      personalMessage: formData.personalMessage,
      specialRequests: formData.specialRequests,
      city: formData.city,
      deliveryAddress: formData.deliveryAddress,
      status: 'Pending Review',
      paymentMethodType: 'Transfer',
      paymentStatus: 'Awaiting Transfer',
      paymentMethod: 'Bank Transfer / Raast',
      courierTracking: '',
      conciergeNote:
        'Order logged via Storefront. Concierge reviewing gift customization and delivery slot.',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackedOrderId(newOrder.id);

    if (supabase) {
      supabase
        .from('tgg_orders')
        .upsert({
          id: newOrder.id,
          user_email: userProfile.email,
          full_name: newOrder.fullName,
          whatsapp_number: newOrder.whatsappNumber,
          recipient_name: newOrder.recipientName,
          city: newOrder.city,
          delivery_address: newOrder.deliveryAddress,
          gift_type: newOrder.giftType,
          selected_product_name: newOrder.selectedProductName,
          selected_product_tier: newOrder.selectedProductTier,
          amount_pkr: newOrder.amountPKR,
          payment_method_type: newOrder.paymentMethodType || 'Transfer',
          payment_status: newOrder.paymentStatus,
          status: newOrder.status,
          order_json: newOrder,
        })
        .then(() => {});
    }

    return newOrder;
  };

  const submitCheckoutOrder = (
    payload: Omit<PortalOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): PortalOrder => {
    const randomNum = Math.floor(8510 + Math.random() * 1400);
    const now = new Date().toISOString();
    const newOrder: PortalOrder = {
      ...payload,
      id: `TGG-2026-${randomNum}`,
      createdAt: now,
      updatedAt: now,
      status: payload.paymentMethodType === 'Card' ? 'Design Confirmed' : 'Pending Review',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackedOrderId(newOrder.id);

    setUserProfile((prev) => ({
      ...prev,
      fullName: payload.fullName || prev.fullName,
      whatsappNumber: payload.whatsappNumber || prev.whatsappNumber,
      email: payload.email || prev.email,
      instagramHandle: payload.instagramHandle || prev.instagramHandle,
      city: payload.city || prev.city,
      defaultAddress: payload.deliveryAddress || prev.defaultAddress,
    }));

    if (supabase) {
      supabase
        .from('tgg_orders')
        .upsert({
          id: newOrder.id,
          user_email: newOrder.email || userProfile.email,
          full_name: newOrder.fullName,
          whatsapp_number: newOrder.whatsappNumber,
          recipient_name: newOrder.recipientName,
          city: newOrder.city,
          delivery_address: newOrder.deliveryAddress,
          gift_type: newOrder.giftType,
          selected_product_name: newOrder.selectedProductName,
          selected_product_tier: newOrder.selectedProductTier,
          amount_pkr: newOrder.amountPKR,
          payment_method_type: newOrder.paymentMethodType || 'Card',
          payment_status: newOrder.paymentStatus,
          status: newOrder.status,
          order_json: newOrder,
        })
        .then(() => {});
    }

    return newOrder;
  };

  const createManualOrder = (
    orderData: Omit<PortalOrder, 'id' | 'createdAt' | 'updatedAt'>
  ): PortalOrder => {
    const randomNum = Math.floor(8510 + Math.random() * 1400);
    const now = new Date().toISOString();
    const newOrder: PortalOrder = {
      ...orderData,
      id: `TGG-2026-${randomNum}`,
      createdAt: now,
      updatedAt: now,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    conciergeNote?: string,
    courierTracking?: string
  ) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status,
          updatedAt: now,
          conciergeNote: conciergeNote !== undefined ? conciergeNote : order.conciergeNote,
          courierTracking:
            courierTracking !== undefined ? courierTracking : order.courierTracking,
        };
      })
    );
  };

  const updateOrderPayment = (
    orderId: string,
    paymentStatus: PaymentStatus,
    amountPKR?: number
  ) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          paymentStatus,
          amountPKR: amountPKR !== undefined ? amountPKR : order.amountPKR,
          updatedAt: now,
        };
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      ...productData,
      id: `${slug}-${Date.now().toString().slice(-4)}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    if (supabase) {
      supabase
        .from('tgg_products')
        .upsert({
          id: newProduct.id,
          name: newProduct.name,
          category: newProduct.category,
          price_display: newProduct.priceDisplay,
          is_popular: Boolean(newProduct.isPopular),
          product_json: newProduct,
        })
        .then(() => {});
    }
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetCatalog = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    } catch {
      // ignore
    }
  };

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSiteSettings = () => {
    setSiteSettings(INITIAL_SITE_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEYS.SITE_SETTINGS);
    } catch {
      // ignore
    }
  };

  const updateFormOptions = (updates: Partial<FormCustomizeOptions>) => {
    setFormOptions((prev) => ({ ...prev, ...updates }));
  };

  const resetFormOptions = () => {
    setFormOptions(INITIAL_FORM_OPTIONS);
    try {
      localStorage.removeItem(STORAGE_KEYS.FORM_OPTIONS);
    } catch {
      // ignore
    }
  };

  const updateCategories = (cats: Category[]) => {
    setCategories(cats);
  };

  const updateOccasions = (occs: Occasion[]) => {
    setOccasions(occs);
  };

  const updatePolicies = (pols: PolicyItem[]) => {
    setPolicies(pols);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const addRecipient = (recipientData: Omit<SavedRecipient, 'id'>) => {
    const newRec: SavedRecipient = {
      ...recipientData,
      id: `rec-${Date.now()}`,
    };
    setSavedRecipients((prev) => [newRec, ...prev]);
  };

  const deleteRecipient = (id: string) => {
    setSavedRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <PortalContext.Provider
      value={{
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
        isUserAuthenticated,
        isAdminAuthenticated,
        isSupabaseConnected,
        authModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        loginUser,
        signupUser,
        logoutUser,
        activeTrackedOrderId,
        setActiveTrackedOrderId,
        checkoutDraft,
        setCheckoutDraft,
        loginAdmin,
        logoutAdmin,
        createOrderFromForm,
        submitCheckoutOrder,
        createManualOrder,
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
        updateCategories,
        updateOccasions,
        updatePolicies,
        updateUserProfile,
        addRecipient,
        deleteRecipient,
        toggleWishlist,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextValue => {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return ctx;
};
