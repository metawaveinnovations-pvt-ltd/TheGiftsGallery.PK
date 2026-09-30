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
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { MobileAppNavBar } from './components/MobileAppNavBar';
import { AuthModal } from './components/AuthModal';
import { CheckoutPage } from './components/CheckoutPage';
import { UserPortal } from './components/UserPortal';
import { AdminPortal } from './components/AdminPortal';
import { usePortal } from './context/PortalContext';
import { AppViewMode, Product } from './types';

export default function App() {
  const {
    isUserAuthenticated,
    openAuthModal,
    setCheckoutDraft,
  } = usePortal();

  const [activeView, setActiveView] = useState<AppViewMode>('storefront');

  const [selectedProductForOrder, setSelectedProductForOrder] = useState<{
    product: Product;
    selectedTier?: string;
  } | null>(null);

  const [selectedOccasionForOrder, setSelectedOccasionForOrder] = useState<string | null>(null);

  const handleNavigateView = (view: AppViewMode) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToOrder = () => {
    if (activeView !== 'storefront') {
      setActiveView('storefront');
      setTimeout(() => {
        const el = document.getElementById('order-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGifts = () => {
    if (activeView !== 'storefront') {
      setActiveView('storefront');
      setTimeout(() => {
        const el = document.getElementById('gifts');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }
    const el = document.getElementById('gifts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderProduct = (product: Product, selectedTier?: string) => {
    setSelectedProductForOrder({ product, selectedTier });
    scrollToOrder();
  };

  const handleCheckoutProduct = (product: Product, selectedTier?: string) => {
    setCheckoutDraft({
      product,
      selectedTier: selectedTier || product.tiers?.[1]?.size || product.tiers?.[0]?.size,
      quantity: 1,
    });
    if (!isUserAuthenticated) {
      openAuthModal(
        `Sign in or create your complimentary account to order "${product.name}" and complete Checkout (Card, COD, or Bank Transfer).`,
        () => handleNavigateView('checkout')
      );
    } else {
      handleNavigateView('checkout');
    }
  };

  const handleSelectCategory = () => {
    scrollToGifts();
  };

  const handleSelectOccasion = (occasionName: string) => {
    setSelectedOccasionForOrder(occasionName);
    scrollToOrder();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C2826] selection:bg-[#14382C] selection:text-[#FBF9F5] pb-20 min-[800px]:pb-0">
      {/* PWA Home Screen Installation Prompt (Mobile / Tablet / Desktop) */}
      <PWAInstallBanner />

      {/* Sign-In & Sign-Up Modal (Triggered at Checkout / Portal points) */}
      <AuthModal onAdminLoginSuccess={() => handleNavigateView('admin-portal')} />

      {/* 1. Sticky Navigation Bar */}
      <Header
        activeView={activeView}
        onNavigateView={handleNavigateView}
        onOrderClick={scrollToOrder}
      />

      <main className="flex-grow">
        {activeView === 'checkout' && (
          <CheckoutPage
            onBackToStore={() => handleNavigateView('storefront')}
            onOpenUserPortal={() => handleNavigateView('user-portal')}
          />
        )}

        {activeView === 'user-portal' && (
          <UserPortal
            onBackToStore={() => handleNavigateView('storefront')}
            onStartCheckoutWithDraft={(draft) => {
              setCheckoutDraft(draft);
              handleNavigateView('checkout');
            }}
          />
        )}

        {activeView === 'admin-portal' && (
          <AdminPortal onBackToStore={() => handleNavigateView('storefront')} />
        )}

        {activeView === 'storefront' && (
          <>
            {/* 2. Hero Section */}
            <Hero onExploreClick={scrollToGifts} />

            {/* 3. Brand Introduction (Thoughtfully Chosen. Beautifully Gifted.) */}
            <BrandIntro />

            {/* 4. Gift Categories (Find a Gift They’ll Remember) */}
            <Categories onSelectCategory={handleSelectCategory} />

            {/* 5. Featured / Curated Gifts (Curated With Love) */}
            <FeaturedGifts
              onOrderProduct={handleOrderProduct}
              onCheckoutProduct={handleCheckoutProduct}
            />

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

            {/* 10. Main Order Form & 11. Smart WhatsApp / Checkout Order Flow */}
            <OrderForm
              initialProduct={selectedProductForOrder}
              initialOccasion={selectedOccasionForOrder}
              onClearInitialProduct={() => setSelectedProductForOrder(null)}
              onProceedToCheckout={() => handleNavigateView('checkout')}
              onOpenUserPortal={() => handleNavigateView('user-portal')}
            />

            {/* 12. Instagram / Social Presence (Follow The Moments) */}
            <InstagramSection />

            {/* 13. Final CTA (Make Someone's Moment Special.) */}
            <FinalCTA onOrderClick={scrollToOrder} />
          </>
        )}
      </main>

      {/* 14. Footer */}
      <Footer onNavigateView={handleNavigateView} />

      {/* Native App-Style Mobile Bottom Navigation Dock (< 800px) */}
      <MobileAppNavBar
        activeView={activeView}
        onNavigateView={handleNavigateView}
        onOrderClick={scrollToOrder}
        hasSelectedProduct={!!selectedProductForOrder}
      />

      {/* Floating WhatsApp Quick Ordering Trigger (Desktop / Laptop) */}
      <QuickWhatsAppFloat />
    </div>
  );
}
