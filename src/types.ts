export interface ProductTier {
  size: 'Small' | 'Medium' | 'Large (Premium)';
  price: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  tiers?: ProductTier[];
  priceDisplay: string;
  isPopular?: boolean;
  features: string[];
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  description: string;
}

export interface Occasion {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
}

export interface OrderFormData {
  fullName: string;
  whatsappNumber: string;
  instagramHandle: string;
  giftType: string;
  giftFor: string;
  selectedProductId?: string;
  selectedProductTier?: string;
  budgetRange: string;
  deliveryDate: string;
  deliveryTime: string;
  recipientName: string;
  personalMessage: string;
  specialRequests: string;
  city: string;
  deliveryAddress: string;
}

export interface PolicyItem {
  id: number;
  title: string;
  shortText: string;
  fullDetails: string;
  badgeLabel: string;
}

export type OrderStatus =
  | 'Pending Review'
  | 'Design Confirmed'
  | 'Handcrafting'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethodType = 'Card' | 'COD' | 'Transfer';

export type PaymentStatus =
  | 'Paid via Card'
  | 'Transfer Verified'
  | 'Awaiting Transfer'
  | 'COD - Pay on Delivery'
  | '100% Advance Verified'
  | 'Refunded';

export interface PortalOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  whatsappNumber: string;
  email?: string;
  instagramHandle: string;
  giftType: string;
  giftFor: string;
  selectedProductId?: string;
  selectedProductName?: string;
  selectedProductTier?: string;
  quantity?: number;
  budgetRange: string;
  subtotalPKR?: number;
  deliveryFeePKR?: number;
  amountPKR: number;
  deliveryDate: string;
  deliveryTime: string;
  recipientName: string;
  recipientPhone?: string;
  personalMessage: string;
  specialRequests: string;
  city: string;
  postalCode?: string;
  deliveryAddress: string;
  status: OrderStatus;
  paymentMethodType?: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReference?: string;
  cardLast4?: string;
  courierTracking?: string;
  conciergeNote?: string;
}

export interface CheckoutDraft {
  product?: Product;
  selectedTier?: string;
  quantity?: number;
  giftType?: string;
  giftFor?: string;
  budgetRange?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  recipientName?: string;
  recipientPhone?: string;
  personalMessage?: string;
  specialRequests?: string;
  city?: string;
  postalCode?: string;
  deliveryAddress?: string;
  fullName?: string;
  whatsappNumber?: string;
  email?: string;
  instagramHandle?: string;
}

export interface SavedRecipient {
  id: string;
  name: string;
  relationship: string;
  occasion: string;
  date: string;
  city: string;
  address: string;
  notes?: string;
}

export interface UserProfile {
  fullName: string;
  whatsappNumber: string;
  instagramHandle: string;
  email: string;
  city: string;
  defaultAddress: string;
  memberSince: string;
}

export interface PackagingAddon {
  id: string;
  name: string;
  pricePKR: number;
}

export interface FormCustomizeOptions {
  giftTypes: string[];
  giftForOptions: string[];
  budgetRanges: string[];
  deliverySlots: string[];
  cities: string[];
  packagingAddons: PackagingAddon[];
}

export interface SiteSettings {
  announcementText: string;
  noticePeriodText: string;
  heroEyebrow: string;
  heroHeadlinePrefix: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroCaptionTag: string;
  heroCaptionTitle: string;
  heroReviewQuote: string;
  heroReviewAuthor: string;
  heroTrustBadge1: string;
  heroTrustBadge2: string;
  heroTrustBadge3: string;
  brandPhilosophyTitle: string;
  brandPhilosophyQuote: string;
  whatsappNumber: string;
  whatsappUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  bankTransferDetails: string;
  easypaisaJazzcashDetails: string;
  standardDeliveryFeePKR: number;
  freeDeliveryThresholdPKR: number;
  midnightDeliveryFeePKR: number;
}

export type AppViewMode = 'storefront' | 'checkout' | 'user-portal' | 'admin-portal';

