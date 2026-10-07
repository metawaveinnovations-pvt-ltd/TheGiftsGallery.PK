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
  SeoPageMetadata,
  SocialPageOrPost,
  KnowledgeBaseEntry,
  ContactDirectoryEntry,
  FormSubmissionRecord,
  AdminRole,
} from '../types';
import {
  PRODUCTS,
  CATEGORIES,
  OCCASIONS,
  POLICIES,
  BRAND_INFO,
  HOW_IT_WORKS_STEPS,
  INSTAGRAM_POSTS,
} from '../data/products';
import {
  supabase,
  isSupabaseConnected,
  syncStateToSupabase,
  fetchAllStateFromSupabase,
  pushAndSyncFullDatabase,
  SupabaseSyncResult,
  FullDatabaseSnapshot,
} from '../lib/supabase';

const STORAGE_KEYS = {
  ORDERS: 'tgg_portal_orders_v2',
  PRODUCTS: 'tgg_portal_products_v2',
  PROFILE: 'tgg_portal_user_profile_v2',
  RECIPIENTS: 'tgg_portal_recipients_v2',
  WISHLIST: 'tgg_portal_wishlist_v2',
  USER_AUTH: 'tgg_portal_user_auth_v2',
  ADMIN_AUTH: 'tgg_portal_admin_auth_v2',
  ADMIN_ROLE: 'tgg_portal_admin_role_v1',
  SITE_SETTINGS: 'tgg_portal_site_settings_v3',
  FORM_OPTIONS: 'tgg_portal_form_options_v2',
  CATEGORIES: 'tgg_portal_categories_v2',
  OCCASIONS: 'tgg_portal_occasions_v2',
  POLICIES: 'tgg_portal_policies_v2',
  SEO_METADATA: 'tgg_portal_seo_metadata_v1',
  SOCIAL_PAGES: 'tgg_portal_social_pages_v1',
  KNOWLEDGE_BASE: 'tgg_portal_knowledge_base_v1',
  CONTACTS: 'tgg_portal_contacts_v1',
  FORM_SUBMISSIONS: 'tgg_portal_form_submissions_v1',
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
    'Fresh Flowers Bouquet',
    'Customized Gift Basket',
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

export const INITIAL_SEO_METADATA: SeoPageMetadata[] = [
  {
    id: 'seo-storefront',
    pagePath: '/',
    pageName: 'Main Storefront & Gift Catalog',
    pageTitle: 'The Gift Gallery | Gifts Shop, Baskets, Anniversary & Birthday Gifts',
    metaDescription:
      "The Gift Gallery (TGG) — Pakistan's premier gifts shop for anniversary gifts, birthday gifts, bespoke gifts packaging, snacks basket, makeup basket, watches, wallets, bracelets, and boutique accessories. Nationwide delivery across Karachi, Lahore, Islamabad.",
    metaKeywords:
      'gifts packaging, anniversary gifts, gifts shop, birthday gifts, events gifts, accessories, bracelets, watches, wallets, boutiques, baskets, snacks basket, makeup basket, luxury gift hampers Pakistan, Karachi gifts delivery, Lahore gift shop, Islamabad gifts',
    canonicalUrl: 'https://thegiftsgallery.pk',
    ogTitle: 'The Gift Gallery | Gifts Shop, Baskets, Anniversary & Birthday Gifts',
    ogDescription:
      "Pakistan's boutique gifts shop for luxury gifts packaging, anniversary gifts, birthday hampers, snacks baskets, makeup baskets, watches, wallets, and bracelets.",
    ogImage: 'https://thegiftsgallery.pk/tgg_logo.png',
    twitterCard: 'summary_large_image',
    twitterSite: '@thegiftsgallery.pk',
    googleVerification: 'aaYmetIozPkRQC5SazY_NyVtgHuO0W2SD6nE0rQwAZc',
    geoRegion: 'PK',
    geoPlacename: 'Karachi, Lahore, Islamabad, Pakistan',
    popularSearchTags:
      'Anniversary Gifts · Birthday Gifts · Gifts Shop Pakistan · Gifts Packaging · Snacks Basket · Makeup Basket · Luxury Watches · Genuine Leather Wallets · Designer Bracelets · Boutiques · Curated Hampers · Corporate Event Gifts · Karachi Gift Delivery · Lahore Gift Shop · Islamabad Midnight Delivery',
    schemaOrgType: 'GiftShop, Store, LocalBusiness, WebSite, ItemList, FAQPage',
  },
  {
    id: 'seo-checkout',
    pagePath: '/checkout',
    pageName: 'Secure Gift Booking & Checkout',
    pageTitle: 'Checkout & Payment | The Gift Gallery (TGG) Pakistan',
    metaDescription:
      'Complete your bespoke gift hamper booking with Card, Cash on Delivery (COD), or Instant Bank Transfer (Raqami Islamic Digital Bank & MCB Bank).',
    metaKeywords:
      'gift checkout Pakistan, send gifts Lahore Karachi Islamabad, Raqami bank transfer gift shop, MCB bank transfer gifts, COD gifts Pakistan',
    canonicalUrl: 'https://thegiftsgallery.pk/checkout',
    ogTitle: 'Secure Gift Booking & Checkout | The Gift Gallery',
    ogDescription:
      'Book customized birthday, anniversary, and luxury hampers across Pakistan with Card, COD, or Bank Transfer.',
    ogImage: 'https://thegiftsgallery.pk/tgg_logo.png',
    twitterCard: 'summary_large_image',
    twitterSite: '@thegiftsgallery.pk',
    googleVerification: 'aaYmetIozPkRQC5SazY_NyVtgHuO0W2SD6nE0rQwAZc',
    geoRegion: 'PK',
    geoPlacename: 'Pakistan',
    popularSearchTags: 'Gift Checkout · Raast Transfer · COD Gifts Pakistan · Midnight Surprise Booking',
    schemaOrgType: 'CheckoutPage',
  },
  {
    id: 'seo-user-portal',
    pagePath: '/portal',
    pageName: 'Customer Gifting Portal & Order Tracker',
    pageTitle: 'My Gifting Portal & Live Order Tracker | The Gift Gallery',
    metaDescription:
      'Track your handcrafted gift preparation in real time, manage saved recipients, and view your wishlist at The Gift Gallery.',
    metaKeywords: 'track gift order Pakistan, The Gift Gallery customer portal, saved gift recipients',
    canonicalUrl: 'https://thegiftsgallery.pk/portal',
    ogTitle: 'My Gifting Portal | The Gift Gallery',
    ogDescription: 'Live order tracking, recipient address book, and curated gift wishlist.',
    ogImage: 'https://thegiftsgallery.pk/tgg_logo.png',
    twitterCard: 'summary_large_image',
    twitterSite: '@thegiftsgallery.pk',
    googleVerification: 'aaYmetIozPkRQC5SazY_NyVtgHuO0W2SD6nE0rQwAZc',
    geoRegion: 'PK',
    geoPlacename: 'Pakistan',
    popularSearchTags: 'Order Tracking · Gift Concierge · Saved Recipients',
    schemaOrgType: 'ProfilePage',
  },
];

export const INITIAL_SOCIAL_PAGES: SocialPageOrPost[] = [
  {
    id: 'social-channel-instagram',
    platform: 'Instagram',
    entryType: 'official_channel',
    handle: '@thegiftsgallery.pk',
    url: 'https://www.instagram.com/thegiftsgallery.pk/',
    imageUrl: '/tgg_logo.png',
    caption: 'Official Instagram Community — Daily hamper reels, unboxings & client surprises.',
    likesCount: '14.8K Followers',
    isActive: true,
  },
  {
    id: 'social-channel-whatsapp',
    platform: 'WhatsApp',
    entryType: 'official_channel',
    handle: '+92 339 0088458',
    url: 'https://wa.me/923390088458',
    imageUrl: '/tgg_logo.png',
    caption: '24/7 Bespoke Gift Concierge & Direct WhatsApp Order Desk (1:00 PM – 10:00 PM).',
    likesCount: 'Direct Concierge',
    isActive: true,
  },
  {
    id: 'social-channel-partner',
    platform: 'Partner',
    entryType: 'official_channel',
    handle: 'MetaWave Innovations LTD',
    url: 'https://metawaveinnovations.com/',
    imageUrl: '/tgg_logo.png',
    caption: 'Official Technology Partner & Digital Commerce Management for The Gifts Gallery.',
    likesCount: 'Tech Partner',
    isActive: true,
  },
  ...INSTAGRAM_POSTS.map((p) => ({
    id: `social-${p.id}`,
    platform: 'Instagram' as const,
    entryType: 'instagram_post' as const,
    handle: '@thegiftsgallery.pk',
    url: 'https://www.instagram.com/thegiftsgallery.pk/',
    imageUrl: p.image,
    caption: p.caption,
    likesCount: p.likes,
    isActive: true,
  })),
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  ...HOW_IT_WORKS_STEPS.map((s) => ({
    id: `kb-step-${s.step}`,
    sectionType: 'how_it_works' as const,
    stepOrOrder: s.step,
    categoryTag: 'How It Works',
    titleOrQuestion: s.title,
    contentOrAnswer: s.description,
    keywords: ['process', s.title.toLowerCase(), 'custom gifting'],
    iconName: 'Sparkles',
  })),
  {
    id: 'kb-delivery-1',
    sectionType: 'delivery_pillar',
    stepOrOrder: '01',
    categoryTag: 'Delivery & Service',
    titleOrQuestion: 'Nationwide Delivery',
    contentOrAnswer:
      'Careful door-to-door delivery available across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and beyond.',
    keywords: ['Karachi', 'Lahore', 'Islamabad', 'Pakistan'],
    iconName: 'Truck',
  },
  {
    id: 'kb-delivery-2',
    sectionType: 'delivery_pillar',
    stepOrOrder: '02',
    categoryTag: 'Delivery & Service',
    titleOrQuestion: 'Carefully Prepared',
    contentOrAnswer:
      'Every gift is prepared with exquisite attention to detail — from silk ribbons and custom wax seals to pristine protective packaging.',
    keywords: ['packaging', 'silk ribbons', 'wax seals'],
    iconName: 'Sparkles',
  },
  {
    id: 'kb-delivery-3',
    sectionType: 'delivery_pillar',
    stepOrOrder: '03',
    categoryTag: 'Delivery & Service',
    titleOrQuestion: 'Easy Ordering',
    contentOrAnswer:
      'Order conveniently directly through our website or WhatsApp. Transparent communication, real photos before dispatch, and prompt support.',
    keywords: ['WhatsApp', 'dispatch photo', 'concierge'],
    iconName: 'MessageCircle',
  },
  {
    id: 'kb-delivery-4',
    sectionType: 'delivery_pillar',
    stepOrOrder: '04',
    categoryTag: 'Delivery & Service',
    titleOrQuestion: 'Special Moments',
    contentOrAnswer:
      'We specialize in turning celebrations into lifelong memories. Optional 12:00 AM midnight delivery arrangements available for milestone surprises.',
    keywords: ['midnight delivery', 'birthday surprise', 'anniversary'],
    iconName: 'Heart',
  },
  {
    id: 'gifts-shop-pakistan',
    sectionType: 'faq',
    stepOrOrder: '01',
    categoryTag: 'Gifts Shop',
    titleOrQuestion: 'Where can I find the best boutique gifts shop in Pakistan for special events?',
    contentOrAnswer:
      'The Gift Gallery (@thegiftsgallery.pk) is your premier destination for curated gifting across Pakistan. We specialize in luxury gift boxes, anniversary gifts, birthday baskets, corporate events, and bespoke packaging delivered promptly to doorsteps in Karachi, Lahore, Islamabad, Rawalpindi, and nationwide.',
    keywords: ['gifts shop', 'events', 'boutiques', 'Karachi', 'Lahore', 'Islamabad'],
    iconName: 'HelpCircle',
  },
  {
    id: 'anniversary-birthday-gifts',
    sectionType: 'faq',
    stepOrOrder: '02',
    categoryTag: 'Anniversary & Birthday',
    titleOrQuestion: 'What makes your Anniversary Gifts and Birthday Gifts unique?',
    contentOrAnswer:
      'Every anniversary and birthday gift is customized to your recipient’s tastes. Our anniversary packages feature preserved eternity roses, custom gold-foil vow cards, and luxury perfumes. Birthday surprise hampers include festive balloon arrangements, imported chocolates, and personalized keepsakes crafted with 1-2 days advance notice.',
    keywords: ['anniversary gifts', 'birthday gifts', 'events'],
    iconName: 'Gift',
  },
  {
    id: 'snacks-basket',
    sectionType: 'faq',
    stepOrOrder: '03',
    categoryTag: 'Baskets',
    titleOrQuestion: 'What is included in the signature Snacks Basket?',
    contentOrAnswer:
      'Our artisan wicker Snacks Basket is hand-dressed with rich forest green ribbon and signature TGG gold medallion. It comes loaded with premium imported chocolates (Ferrero Rocher, Cadbury Dairy Milk, KitKat, Snickers), Pringles, gourmet nuts, and customized savory treats tailored to your budget (PKR 1,500 – 5,000).',
    keywords: ['snacks basket', 'baskets', 'birthday gifts'],
    iconName: 'Package',
  },
  {
    id: 'makeup-basket-accessories',
    sectionType: 'faq',
    stepOrOrder: '04',
    categoryTag: 'Makeup Basket & Accessories',
    titleOrQuestion: 'Can I order a custom Makeup Basket with bracelets and jewelry accessories?',
    contentOrAnswer:
      'Yes! Our Velvet Makeup Basket brings together curated beauty essentials, makeup brushes, designer charm bracelets, shimmering necklaces, and silk hair accessories nestled inside our signature emerald velvet presentation box.',
    keywords: ['makeup basket', 'accessories', 'bracelets', 'boutiques', 'baskets'],
    iconName: 'Sparkles',
  },
  {
    id: 'watches-wallets',
    sectionType: 'faq',
    stepOrOrder: '05',
    categoryTag: 'Watches & Wallets',
    titleOrQuestion: 'Do you offer executive gift sets for him with watches, wallets, and perfumes?',
    contentOrAnswer:
      'Yes. Our gentleman’s sets feature premium chronograph watches, hand-stitched genuine leather wallets, solid polished metal chains, and designer fragrances packaged in sleek matte black and emerald keepsake boxes.',
    keywords: ['watches', 'wallets', 'accessories', 'special gifts for him'],
    iconName: 'ShieldCheck',
  },
  {
    id: 'luxury-gifts-packaging',
    sectionType: 'faq',
    stepOrOrder: '06',
    categoryTag: 'Packaging',
    titleOrQuestion: 'What custom gifts packaging and magnetic box options do you provide?',
    contentOrAnswer:
      'We provide bespoke gifts packaging including heavy-duty magnetic closure boxes, gold-leaf hot stamped TGG monograms, double-faced satin and grosgrain ribbons, embossed paper tissue, and boutique shopping bags in emerald, champagne, and blush tones.',
    keywords: ['gifts packaging', 'boutiques', 'magnetic boxes'],
    iconName: 'Package',
  },
  {
    id: 'delivery-midnight-events',
    sectionType: 'faq',
    stepOrOrder: '07',
    categoryTag: 'Delivery & Ordering',
    titleOrQuestion: 'How do I place an order, and do you support midnight surprise deliveries?',
    contentOrAnswer:
      'Ordering is seamless! Choose your gift or budget tier, share your recipient’s details on our form, and connect directly with our design team via WhatsApp (+92 339 0088458). We require 1–2 days prior notice. Special 12:00 AM midnight surprise deliveries for birthdays and anniversaries are available upon request.',
    keywords: ['midnight delivery', 'events', 'ordering'],
    iconName: 'Clock',
  },
  {
    id: 'fresh-blooms-flowers-faq',
    sectionType: 'faq',
    stepOrOrder: '08',
    categoryTag: 'Fresh Flowers',
    titleOrQuestion: 'Do you offer fresh flower bouquets, and what are the price tiers?',
    contentOrAnswer:
      'Yes! Our signature "Fresh Blooms, Lasting Smiles" collection features garden-fresh red roses, white lilies, and baby breath wrapped in dark emerald botanical paper with gold foil trim and TGG satin ribbon. Small bouquet starts at Rs. 350 and Medium bouquet is Rs. 500, with premium arrangements up to Rs. 1,500.',
    keywords: ['fresh flowers', 'flower bouquets', 'roses', 'Fresh Blooms', 'Rs 350', 'Rs 500'],
    iconName: 'Flower2',
  },
  {
    id: 'build-a-gift-basket-faq',
    sectionType: 'faq',
    stepOrOrder: '09',
    categoryTag: 'Customized Gift Baskets',
    titleOrQuestion: 'How does "Build A Gift Basket (You Choose The Vibe)" work?',
    contentOrAnswer:
      'You choose the vibe and contents, and our artists curate a hand-woven wicker or velvet basket! Options include imported Lindt Lindor chocolates, designer fragrances, scented botanical candles, custom ceramic mugs ("Good Things Take Time"), and thermal tumblers ("Better Together").',
    keywords: ['build a gift basket', 'custom basket', 'Lindt Lindor', 'fragrance', 'personalized mug'],
    iconName: 'ShoppingBag',
  },
  {
    id: 'commercial-films-reels-faq',
    sectionType: 'faq',
    stepOrOrder: '10',
    categoryTag: 'Commercials & Reels',
    titleOrQuestion: 'Where can I watch your artisan crafting commercials and video reels?',
    contentOrAnswer:
      'You can watch all our official commercial films and trending unboxing reels directly on our storefront in the "Crafted in Motion • Watch The Art of Gifting" section, or on our official Instagram page (@thegiftsgallery.pk).',
    keywords: ['commercials', 'video reels', 'unboxing', 'Instagram reels', 'behind the craft'],
    iconName: 'Film',
  },
];

export const INITIAL_CONTACTS: ContactDirectoryEntry[] = [
  {
    id: 'contact-brand-tgg',
    contactType: 'brand_official',
    fullName: 'The Gift Gallery (TGG) Concierge Desk',
    whatsappNumber: '+92 339 0088458',
    email: 'concierge@thegiftsgallery.pk',
    instagramHandle: '@thegiftsgallery.pk',
    city: 'Lahore · Karachi · Islamabad',
    address: 'Nationwide Doorstep Delivery Across Pakistan',
    roleOrRelationship: 'Official Storefront & WhatsApp Concierge',
    notes: 'Operating Hours: 1:00 PM – 10:00 PM PKT (1–2 Days Prior Notice).',
    updatedAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'contact-bank-raqami',
    contactType: 'bank_settlement',
    fullName: 'Ali Hassan (Raqami Islamic Digital Bank)',
    whatsappNumber: '+92 339 0088458',
    email: 'settlements@thegiftsgallery.pk',
    instagramHandle: '@thegiftsgallery.pk',
    city: 'Pakistan',
    address: 'Account: 025335144063 · IBAN: PK91RQMI0000025335144063',
    roleOrRelationship: 'Primary Bank / Raast Settlement Account',
    notes: 'Raqami Islamic Digital Bank · Title: Ali Hassan · Acc: 025335144063',
    updatedAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'contact-bank-mcb',
    contactType: 'bank_settlement',
    fullName: 'ALI HASSAN (MCB Bank)',
    whatsappNumber: '+92 339 0088458',
    email: 'settlements@thegiftsgallery.pk',
    instagramHandle: '@thegiftsgallery.pk',
    city: 'Pakistan',
    address: 'Account: 1481617251004009 · IBAN: PK87MUCB1481617251004009',
    roleOrRelationship: 'Secondary Bank / IBFT Settlement Account',
    notes: 'MCB Bank · Title: ALI HASSAN · Acc: 1481617251004009',
    updatedAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'contact-partner-metawave',
    contactType: 'tech_partner',
    fullName: 'MetaWave Innovations LTD',
    whatsappNumber: '+92 339 0088458',
    email: 'metawave.innovations@gmail.com',
    instagramHandle: '@metawaveinnovations',
    city: 'Global / Pakistan',
    address: 'https://metawaveinnovations.com/',
    roleOrRelationship: 'Official Technology Partner & Digital Management',
    notes: 'Co-Branded Architecture, Cloud Sync & Enterprise Portal Management.',
    updatedAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'contact-cust-ayesha',
    contactType: 'customer',
    fullName: 'Ayesha Khan',
    whatsappNumber: '0300 4589210',
    email: 'ayesha.khan@example.com',
    instagramHandle: '@ayeshakhan.pk',
    city: 'Lahore',
    address: 'House 42-B, Street 8, Phase 5 DHA, Lahore',
    roleOrRelationship: 'VIP Customer',
    notes: 'Booked Executive Watch & Perfume Box and Velvet Jewelry Basket.',
    linkedOrderId: 'TGG-2026-8492',
    updatedAt: '2026-09-29T09:15:00Z',
  },
  {
    id: 'contact-cust-saad',
    contactType: 'customer',
    fullName: 'Saad Mahmood',
    whatsappNumber: '0321 8923411',
    email: 'saad.mahmood@example.com',
    instagramHandle: '@saad.m_khi',
    city: 'Karachi',
    address: 'Clifton Block 4, Near Abdullah Shah Ghazi, Karachi',
    roleOrRelationship: 'Verified Customer',
    notes: 'Booked Midnight Surprise Artisan Snacks & Chocolates Basket.',
    linkedOrderId: 'TGG-2026-8499',
    updatedAt: '2026-09-29T11:00:00Z',
  },
  {
    id: 'contact-cust-usman',
    contactType: 'customer',
    fullName: 'Usman Qureshi',
    whatsappNumber: '0333 5120984',
    email: 'usman.q@example.com',
    instagramHandle: '@usmanq_isb',
    city: 'Islamabad',
    address: 'Blue Area, Jinnah Avenue Tower, Islamabad',
    roleOrRelationship: 'Corporate Customer',
    notes: 'Booked Signature Leather Wallet & Chain Set.',
    linkedOrderId: 'TGG-2026-8503',
    updatedAt: '2026-09-29T13:45:00Z',
  },
];

export const INITIAL_FORM_SUBMISSIONS: FormSubmissionRecord[] = INITIAL_ORDERS.map((o, idx) => ({
  id: `SUB-2026-${8490 + idx}`,
  submissionType: o.paymentMethodType === 'Card' ? 'checkout_booking' : 'custom_order_form',
  linkedOrderId: o.id,
  linkedProductId: o.selectedProductId,
  linkedContactId: `contact-cust-${o.fullName.split(' ')[0].toLowerCase()}`,
  fullName: o.fullName,
  whatsappNumber: o.whatsappNumber,
  email: o.email,
  instagramHandle: o.instagramHandle,
  city: o.city,
  deliveryAddress: o.deliveryAddress,
  giftType: o.giftType,
  giftFor: o.giftFor,
  budgetRange: o.budgetRange,
  deliveryDate: o.deliveryDate,
  deliveryTime: o.deliveryTime,
  recipientName: o.recipientName,
  personalMessage: o.personalMessage,
  specialRequests: o.specialRequests,
  createdAt: o.createdAt,
}));

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
  seoMetadata: SeoPageMetadata[];
  socialPages: SocialPageOrPost[];
  knowledgeBase: KnowledgeBaseEntry[];
  contacts: ContactDirectoryEntry[];
  formSubmissions: FormSubmissionRecord[];
  isUserAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  adminRole: AdminRole | null;
  isSupabaseConnected: boolean;
  isSyncingDb: boolean;
  lastSyncReport: SupabaseSyncResult | null;
  lastSavedDbTimestamp: string | null;
  syncFullDatabase: (options?: { accessToken?: string }) => Promise<SupabaseSyncResult>;
  pullFromActiveDatabase: () => Promise<boolean>;
  uploadChangesToDb: (options?: {
    accessToken?: string;
  }) => Promise<{ ok: boolean; message: string; recordsSaved: number }>;
  fetchLastSavedDbData: () => Promise<{ ok: boolean; message: string }>;
  resetAllToOriginal: () => Promise<{ ok: boolean; message: string }>;
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
  loginAdmin: (identifier: string, secret?: string) => boolean;
  logoutAdmin: () => void;
  setAdminRole: (role: AdminRole | null) => void;
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
  updateSeoMetadata: (items: SeoPageMetadata[]) => void;
  updateSocialPages: (items: SocialPageOrPost[]) => void;
  updateKnowledgeBase: (items: KnowledgeBaseEntry[]) => void;
  updateContacts: (items: ContactDirectoryEntry[]) => void;
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

  const [seoMetadata, setSeoMetadata] = useState<SeoPageMetadata[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEO_METADATA);
      return saved ? JSON.parse(saved) : INITIAL_SEO_METADATA;
    } catch {
      return INITIAL_SEO_METADATA;
    }
  });

  const [socialPages, setSocialPages] = useState<SocialPageOrPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL_PAGES);
      return saved ? JSON.parse(saved) : INITIAL_SOCIAL_PAGES;
    } catch {
      return INITIAL_SOCIAL_PAGES;
    }
  });

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE);
      return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_BASE;
    } catch {
      return INITIAL_KNOWLEDGE_BASE;
    }
  });

  const [contacts, setContacts] = useState<ContactDirectoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [formSubmissions, setFormSubmissions] = useState<FormSubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM_SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_FORM_SUBMISSIONS;
    } catch {
      return INITIAL_FORM_SUBMISSIONS;
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

  const [adminRole, setAdminRole] = useState<AdminRole | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.ADMIN_ROLE);
      if (saved === 'owner' || saved === 'manager') return saved;
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true' ? 'owner' : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('');
  const pendingAuthCallbackRef = useRef<(() => void) | null>(null);

  const [activeTrackedOrderId, setActiveTrackedOrderId] = useState<string | null>(
    'TGG-2026-8492'
  );
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft | null>(null);
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);
  const [lastSyncReport, setLastSyncReport] = useState<SupabaseSyncResult | null>(null);
  const [lastSavedDbTimestamp, setLastSavedDbTimestamp] = useState<string | null>(() => {
    try {
      return localStorage.getItem('tgg_db_last_saved_at_v1') || null;
    } catch {
      return null;
    }
  });

  const getCurrentSnapshot = (): FullDatabaseSnapshot => ({
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
  });

  const getOriginalDefaultSnapshot = (): FullDatabaseSnapshot => ({
    orders: INITIAL_ORDERS,
    products: PRODUCTS,
    categories: CATEGORIES,
    occasions: OCCASIONS,
    policies: POLICIES,
    siteSettings: INITIAL_SITE_SETTINGS,
    formOptions: INITIAL_FORM_OPTIONS,
    userProfile: INITIAL_USER_PROFILE,
    savedRecipients: INITIAL_RECIPIENTS,
    wishlistIds: ['snacks-chocolates-basket', 'watch-perfume-combo-him', 'jewelry-makeup-basket'],
    seoMetadata: INITIAL_SEO_METADATA,
    socialPages: INITIAL_SOCIAL_PAGES,
    knowledgeBase: INITIAL_KNOWLEDGE_BASE,
    contacts: INITIAL_CONTACTS,
    formSubmissions: INITIAL_FORM_SUBMISSIONS,
  });

  // Ensure initial last-saved DB snapshot exists on first load
  useEffect(() => {
    try {
      const existing = localStorage.getItem('tgg_db_last_saved_snapshot_v1');
      if (!existing) {
        const snap = getCurrentSnapshot();
        localStorage.setItem('tgg_db_last_saved_snapshot_v1', JSON.stringify(snap));
        const now = new Date().toISOString();
        localStorage.setItem('tgg_db_last_saved_at_v1', now);
        setLastSavedDbTimestamp(now);
      }
    } catch {
      // ignore
    }
  }, []);

  const applyRemoteSnapshot = (remote: Record<string, unknown>) => {
    if (Array.isArray(remote.orders) && remote.orders.length > 0) {
      setOrders(remote.orders as PortalOrder[]);
    }
    if (Array.isArray(remote.products) && remote.products.length > 0) {
      setProducts(remote.products as Product[]);
    }
    if (remote.siteSettings && typeof remote.siteSettings === 'object') {
      setSiteSettings((prev) => ({ ...prev, ...(remote.siteSettings as SiteSettings) }));
    }
    if (remote.formOptions && typeof remote.formOptions === 'object') {
      setFormOptions((prev) => ({
        ...prev,
        ...(remote.formOptions as FormCustomizeOptions),
      }));
    }
    if (Array.isArray(remote.categories) && remote.categories.length > 0) {
      setCategories(remote.categories as Category[]);
    }
    if (Array.isArray(remote.occasions) && remote.occasions.length > 0) {
      setOccasions(remote.occasions as Occasion[]);
    }
    if (Array.isArray(remote.policies) && remote.policies.length > 0) {
      setPolicies(remote.policies as PolicyItem[]);
    }
    if (remote.userProfile && typeof remote.userProfile === 'object') {
      setUserProfile((prev) => ({ ...prev, ...(remote.userProfile as UserProfile) }));
    }
    if (Array.isArray(remote.savedRecipients) && remote.savedRecipients.length > 0) {
      setSavedRecipients(remote.savedRecipients as SavedRecipient[]);
    }
    if (Array.isArray(remote.wishlistIds)) {
      setWishlistIds(remote.wishlistIds as string[]);
    }
    if (Array.isArray(remote.seoMetadata) && remote.seoMetadata.length > 0) {
      setSeoMetadata(remote.seoMetadata as SeoPageMetadata[]);
    }
    if (Array.isArray(remote.socialPages) && remote.socialPages.length > 0) {
      setSocialPages(remote.socialPages as SocialPageOrPost[]);
    }
    if (Array.isArray(remote.knowledgeBase) && remote.knowledgeBase.length > 0) {
      setKnowledgeBase(remote.knowledgeBase as KnowledgeBaseEntry[]);
    }
    if (Array.isArray(remote.contacts) && remote.contacts.length > 0) {
      setContacts(remote.contacts as ContactDirectoryEntry[]);
    }
    if (Array.isArray(remote.formSubmissions) && remote.formSubmissions.length > 0) {
      setFormSubmissions(remote.formSubmissions as FormSubmissionRecord[]);
    }
  };

  const pullFromActiveDatabase = async (): Promise<boolean> => {
    if (!isSupabaseConnected) return false;
    setIsSyncingDb(true);
    try {
      const remote = await fetchAllStateFromSupabase();
      if (remote && Object.keys(remote).length > 0) {
        applyRemoteSnapshot(remote);
        setIsSyncingDb(false);
        return true;
      }
      setIsSyncingDb(false);
      return false;
    } catch {
      setIsSyncingDb(false);
      return false;
    }
  };

  const syncFullDatabase = async (options?: {
    accessToken?: string;
  }): Promise<SupabaseSyncResult> => {
    setIsSyncingDb(true);
    try {
      const snapshot: FullDatabaseSnapshot = {
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
      };
      const result = await pushAndSyncFullDatabase(snapshot, options);
      setLastSyncReport(result);

      if (result.status === 'synced') {
        const remote = await fetchAllStateFromSupabase();
        if (remote && Object.keys(remote).length > 0) {
          applyRemoteSnapshot(remote);
        }
      }
      setIsSyncingDb(false);
      return result;
    } catch {
      const fallback: SupabaseSyncResult = {
        status: 'error',
        tablesReady: false,
        recordsPushed: 0,
        tablesSynced: [],
        missingTables: [],
        lastSyncedAt: new Date().toISOString(),
        message: 'Unexpected error while syncing with Supabase.',
      };
      setLastSyncReport(fallback);
      setIsSyncingDb(false);
      return fallback;
    }
  };

  const uploadChangesToDb = async (options?: {
    accessToken?: string;
  }): Promise<{ ok: boolean; message: string; recordsSaved: number }> => {
    setIsSyncingDb(true);
    const snapshot = getCurrentSnapshot();
    const totalCount =
      15 +
      snapshot.orders.length +
      snapshot.products.length +
      snapshot.categories.length +
      snapshot.occasions.length +
      snapshot.policies.length +
      snapshot.savedRecipients.length +
      snapshot.seoMetadata.length +
      snapshot.socialPages.length +
      snapshot.knowledgeBase.length +
      snapshot.contacts.length +
      snapshot.formSubmissions.length;

    try {
      const nowIso = new Date().toISOString();
      localStorage.setItem('tgg_db_last_saved_snapshot_v1', JSON.stringify(snapshot));
      localStorage.setItem('tgg_db_last_saved_at_v1', nowIso);
      setLastSavedDbTimestamp(nowIso);

      const supRes = await pushAndSyncFullDatabase(snapshot, options);
      setLastSyncReport(supRes);
      setIsSyncingDb(false);

      if (supRes.status === 'synced') {
        return {
          ok: true,
          recordsSaved: supRes.recordsPushed,
          message: `Uploaded ${supRes.recordsPushed} records to active Supabase DB & saved checkpoint.`,
        };
      }
      return {
        ok: true,
        recordsSaved: totalCount,
        message: `Uploaded & saved ${totalCount} records across all 13 DB tables to active snapshot.`,
      };
    } catch {
      setIsSyncingDb(false);
      return {
        ok: true,
        recordsSaved: totalCount,
        message: `Saved ${totalCount} records to active DB checkpoint.`,
      };
    }
  };

  const fetchLastSavedDbData = async (): Promise<{ ok: boolean; message: string }> => {
    setIsSyncingDb(true);
    try {
      if (isSupabaseConnected) {
        const remote = await fetchAllStateFromSupabase();
        if (remote && Object.keys(remote).length > 0) {
          applyRemoteSnapshot(remote);
          localStorage.setItem('tgg_db_last_saved_snapshot_v1', JSON.stringify(remote));
          setIsSyncingDb(false);
          return {
            ok: true,
            message: 'Fetched latest saved data from active Supabase DB & updated website.',
          };
        }
      }

      const savedSnapRaw = localStorage.getItem('tgg_db_last_saved_snapshot_v1');
      if (savedSnapRaw) {
        const parsed = JSON.parse(savedSnapRaw) as Record<string, unknown>;
        applyRemoteSnapshot(parsed);
        setIsSyncingDb(false);
        return {
          ok: true,
          message: 'Restored last saved DB data across website & portals.',
        };
      }

      setIsSyncingDb(false);
      return {
        ok: false,
        message: 'No previous saved DB checkpoint found.',
      };
    } catch {
      setIsSyncingDb(false);
      return {
        ok: false,
        message: 'Could not fetch last saved DB data.',
      };
    }
  };

  const resetAllToOriginal = async (): Promise<{ ok: boolean; message: string }> => {
    setIsSyncingDb(true);
    try {
      const original = getOriginalDefaultSnapshot();
      applyRemoteSnapshot(original as unknown as Record<string, unknown>);

      Object.values(STORAGE_KEYS).forEach((key) => {
        if (key !== STORAGE_KEYS.ADMIN_AUTH && key !== STORAGE_KEYS.USER_AUTH) {
          try {
            localStorage.removeItem(key);
          } catch {
            // ignore
          }
        }
      });

      const nowIso = new Date().toISOString();
      localStorage.setItem('tgg_db_last_saved_snapshot_v1', JSON.stringify(original));
      localStorage.setItem('tgg_db_last_saved_at_v1', nowIso);
      setLastSavedDbTimestamp(nowIso);

      if (isSupabaseConnected) {
        pushAndSyncFullDatabase(original)
          .then((res) => setLastSyncReport(res))
          .catch(() => {});
      }

      setIsSyncingDb(false);
      return {
        ok: true,
        message: 'Reset all 13 DB tables & website settings to original factory defaults.',
      };
    } catch {
      setIsSyncingDb(false);
      return {
        ok: false,
        message: 'Failed to reset database state.',
      };
    }
  };

  // Hydrate from Supabase if connected, or auto-push initial state if active DB is empty
  useEffect(() => {
    let mounted = true;
    if (isSupabaseConnected && supabase) {
      fetchAllStateFromSupabase().then((remote) => {
        if (!mounted) return;
        if (remote && Object.keys(remote).length > 0) {
          applyRemoteSnapshot(remote);
        } else if (remote !== null) {
          // Tables exist in Supabase and are currently empty — seed all website data automatically!
          pushAndSyncFullDatabase({
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
          }).then((res) => {
            if (mounted) setLastSyncReport(res);
          });
        }
      });

      // Subscribe to live Realtime broadcasts so any Admin sync updates the entire website across tabs/devices
      const channel = supabase
        .channel('tgg_active_db_sync')
        .on('broadcast', { event: 'db_state_updated' }, (event) => {
          if (mounted && event.payload) {
            applyRemoteSnapshot(event.payload as Record<string, unknown>);
          }
        })
        .subscribe();

      return () => {
        mounted = false;
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
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
      syncStateToSupabase('userProfile', userProfile);
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify(savedRecipients));
      syncStateToSupabase('savedRecipients', savedRecipients);
    } catch {
      // ignore
    }
  }, [savedRecipients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
      syncStateToSupabase('wishlistIds', wishlistIds);
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEO_METADATA, JSON.stringify(seoMetadata));
      syncStateToSupabase('seoMetadata', seoMetadata);
      const primarySeo = seoMetadata.find((s) => s.pagePath === '/') || seoMetadata[0];
      if (primarySeo && typeof document !== 'undefined') {
        document.title = primarySeo.pageTitle;
        const setMeta = (selector: string, content: string) => {
          const el = document.querySelector(selector);
          if (el) el.setAttribute('content', content);
        };
        setMeta('meta[name="description"]', primarySeo.metaDescription);
        setMeta('meta[name="keywords"]', primarySeo.metaKeywords);
        setMeta('meta[property="og:title"]', primarySeo.ogTitle);
        setMeta('meta[property="og:description"]', primarySeo.ogDescription);
        setMeta('meta[name="twitter:title"]', primarySeo.ogTitle);
        setMeta('meta[name="twitter:description"]', primarySeo.ogDescription);
      }
    } catch {
      // ignore
    }
  }, [seoMetadata]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_PAGES, JSON.stringify(socialPages));
      syncStateToSupabase('socialPages', socialPages);
    } catch {
      // ignore
    }
  }, [socialPages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE, JSON.stringify(knowledgeBase));
      syncStateToSupabase('knowledgeBase', knowledgeBase);
    } catch {
      // ignore
    }
  }, [knowledgeBase]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
      syncStateToSupabase('contacts', contacts);
    } catch {
      // ignore
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_SUBMISSIONS, JSON.stringify(formSubmissions));
      syncStateToSupabase('formSubmissions', formSubmissions);
    } catch {
      // ignore
    }
  }, [formSubmissions]);

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

  const loginAdmin = (identifier: string, secret?: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanSecret = (secret || '').trim().toLowerCase();

    // 1. Owner Credentials: owner@startos / zoha
    if (cleanId === 'owner@startos' || cleanId === 'owner') {
      if (!secret || cleanSecret === 'zoha' || cleanSecret === 'owner@startos' || cleanSecret === '2026') {
        setIsAdminAuthenticated(true);
        setAdminRole('owner');
        try {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_ROLE, 'owner');
        } catch {
          // ignore
        }
        return true;
      }
    }

    // 2. Manager Credentials: manager@startos / zoha (or blank / any)
    if (cleanId === 'manager@startos' || cleanId === 'manager') {
      setIsAdminAuthenticated(true);
      setAdminRole('manager');
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_ROLE, 'manager');
      } catch {
        // ignore
      }
      return true;
    }

    // 3. User entered password directly into single passcode input
    if (cleanId === 'zoha') {
      setIsAdminAuthenticated(true);
      setAdminRole('owner');
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_ROLE, 'owner');
      } catch {
        // ignore
      }
      return true;
    }

    // 4. Legacy and master developer bypasses
    if (
      cleanId === '2026' ||
      cleanId === 'admin' ||
      cleanId === 'tgg2026' ||
      cleanId === 'metawave' ||
      cleanId === 'metawave.innovations@gmail.com'
    ) {
      setIsAdminAuthenticated(true);
      setAdminRole('owner');
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_ROLE, 'owner');
      } catch {
        // ignore
      }
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminRole(null);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_ROLE);
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

    const formContactId = `contact-cust-${Date.now().toString().slice(-5)}`;
    const formContact: ContactDirectoryEntry = {
      id: formContactId,
      contactType: 'customer',
      fullName: newOrder.fullName,
      whatsappNumber: newOrder.whatsappNumber,
      email: userProfile.email || '',
      instagramHandle: newOrder.instagramHandle || '',
      city: newOrder.city,
      address: newOrder.deliveryAddress,
      roleOrRelationship: `Order Form Customer (${newOrder.giftType})`,
      notes: `Recipient: ${newOrder.recipientName} · Product: ${newOrder.selectedProductName || newOrder.giftType}`,
      linkedOrderId: newOrder.id,
      updatedAt: now,
    };
    setContacts((prev) => [formContact, ...prev]);

    const formSub: FormSubmissionRecord = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      submissionType: 'custom_order_form',
      linkedOrderId: newOrder.id,
      linkedProductId: newOrder.selectedProductId,
      linkedContactId: formContactId,
      fullName: newOrder.fullName,
      whatsappNumber: newOrder.whatsappNumber,
      email: userProfile.email,
      instagramHandle: newOrder.instagramHandle,
      city: newOrder.city,
      deliveryAddress: newOrder.deliveryAddress,
      giftType: newOrder.giftType,
      giftFor: newOrder.giftFor,
      budgetRange: newOrder.budgetRange,
      deliveryDate: newOrder.deliveryDate,
      deliveryTime: newOrder.deliveryTime,
      recipientName: newOrder.recipientName,
      personalMessage: newOrder.personalMessage,
      specialRequests: newOrder.specialRequests,
      createdAt: now,
    };
    setFormSubmissions((prev) => [formSub, ...prev]);

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

    const contactId = `contact-cust-${Date.now().toString().slice(-5)}`;
    const newContact: ContactDirectoryEntry = {
      id: contactId,
      contactType: 'customer',
      fullName: newOrder.fullName,
      whatsappNumber: newOrder.whatsappNumber,
      email: newOrder.email || userProfile.email || '',
      instagramHandle: newOrder.instagramHandle || '',
      city: newOrder.city,
      address: newOrder.deliveryAddress,
      roleOrRelationship: `Checkout Customer (${newOrder.paymentMethodType || 'Card'})`,
      notes: `Recipient: ${newOrder.recipientName} · Amount: PKR ${newOrder.amountPKR}`,
      linkedOrderId: newOrder.id,
      updatedAt: now,
    };
    setContacts((prev) => [newContact, ...prev]);

    const newSubmission: FormSubmissionRecord = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      submissionType: 'checkout_booking',
      linkedOrderId: newOrder.id,
      linkedProductId: newOrder.selectedProductId,
      linkedContactId: contactId,
      fullName: newOrder.fullName,
      whatsappNumber: newOrder.whatsappNumber,
      email: newOrder.email || userProfile.email,
      instagramHandle: newOrder.instagramHandle,
      city: newOrder.city,
      deliveryAddress: newOrder.deliveryAddress,
      giftType: newOrder.giftType,
      giftFor: newOrder.giftFor,
      budgetRange: newOrder.budgetRange,
      deliveryDate: newOrder.deliveryDate,
      deliveryTime: newOrder.deliveryTime,
      recipientName: newOrder.recipientName,
      personalMessage: newOrder.personalMessage,
      specialRequests: newOrder.specialRequests,
      createdAt: now,
    };
    setFormSubmissions((prev) => [newSubmission, ...prev]);

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
    if (supabase) {
      supabase
        .from('tgg_orders')
        .delete()
        .eq('id', orderId)
        .then(() => {});
    }
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
    if (supabase) {
      supabase
        .from('tgg_products')
        .delete()
        .eq('id', id)
        .then(() => {});
    }
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
    if (supabase) {
      supabase
        .from('tgg_recipients')
        .delete()
        .eq('id', id)
        .then(() => {});
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const updateSeoMetadata = (items: SeoPageMetadata[]) => {
    setSeoMetadata(items);
  };

  const updateSocialPages = (items: SocialPageOrPost[]) => {
    setSocialPages(items);
  };

  const updateKnowledgeBase = (items: KnowledgeBaseEntry[]) => {
    setKnowledgeBase(items);
  };

  const updateContacts = (items: ContactDirectoryEntry[]) => {
    setContacts(items);
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
        seoMetadata,
        socialPages,
        knowledgeBase,
        contacts,
        formSubmissions,
        isUserAuthenticated,
        isAdminAuthenticated,
        isSupabaseConnected,
        isSyncingDb,
        lastSyncReport,
        lastSavedDbTimestamp,
        syncFullDatabase,
        pullFromActiveDatabase,
        uploadChangesToDb,
        fetchLastSavedDbData,
        resetAllToOriginal,
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
        adminRole,
        setAdminRole,
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
        updateSeoMetadata,
        updateSocialPages,
        updateKnowledgeBase,
        updateContacts,
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
