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
