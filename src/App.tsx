/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandIntro } from './components/BrandIntro';
import { Categories } from './components/Categories';
import { FeaturedGifts } from './components/FeaturedGifts';
import { Occasions } from './components/Occasions';
import { HowItWorks } from './components/HowItWorks';
import { DeliveryService } from './components/DeliveryService';
import { Policies } from './components/Policies';
import { GiftingGuideFAQ } from './components/GiftingGuideFAQ';
import { OrderForm } from './components/OrderForm';
import { InstagramSection } from './components/InstagramSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { QuickWhatsAppFloat } from './components/QuickWhatsAppFloat';
import { Product } from './types';

export default function App() {
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<{
    product: Product;
    selectedTier?: string;
  } | null>(null);

  const [selectedOccasionForOrder, setSelectedOccasionForOrder] = useState<string | null>(null);

  const scrollToOrder = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGifts = () => {
    const el = document.getElementById('gifts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderProduct = (product: Product, selectedTier?: string) => {
    setSelectedProductForOrder({ product, selectedTier });
    scrollToOrder();
  };

  const handleSelectCategory = () => {
    scrollToGifts();
  };

  const handleSelectOccasion = (occasionName: string) => {
    setSelectedOccasionForOrder(occasionName);
    scrollToOrder();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C2826] selection:bg-[#14382C] selection:text-[#FBF9F5]">
      {/* 1. Sticky Navigation Bar */}
      <Header onOrderClick={scrollToOrder} />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <Hero onExploreClick={scrollToGifts} />

        {/* 3. Brand Introduction (Thoughtfully Chosen. Beautifully Gifted.) */}
        <BrandIntro />

        {/* 4. Gift Categories (Find a Gift They’ll Remember) */}
        <Categories onSelectCategory={handleSelectCategory} />

        {/* 5. Featured / Curated Gifts (Curated With Love) */}
        <FeaturedGifts onOrderProduct={handleOrderProduct} />

        {/* 6. Occasions (Gifts for Every Occasion) */}
        <Occasions onSelectOccasion={handleSelectOccasion} />

        {/* 7. How It Works (4-Step Timeline) */}
        <HowItWorks />

        {/* 8. Delivery & Service (From Our Hands to Their Moment.) */}
        <DeliveryService onOrderClick={scrollToOrder} />

        {/* 9. Customer & Order Policies (Compact + Modal) */}
        <Policies />

        {/* 9.5. Gifting Guide & SEO FAQ Section */}
        <GiftingGuideFAQ />

        {/* 10. Main Order Form & 11. Smart WhatsApp Order Flow */}
        <OrderForm
          initialProduct={selectedProductForOrder}
          initialOccasion={selectedOccasionForOrder}
          onClearInitialProduct={() => setSelectedProductForOrder(null)}
        />

        {/* 12. Instagram / Social Presence (Follow The Moments) */}
        <InstagramSection />

        {/* 13. Final CTA (Make Someone's Moment Special.) */}
        <FinalCTA onOrderClick={scrollToOrder} />
      </main>

      {/* 14. Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Ordering Trigger */}
      <QuickWhatsAppFloat />
    </div>
  );
}
