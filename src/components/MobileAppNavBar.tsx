import React, { useState, useEffect } from 'react';
import { Gift, Home, MessageCircle, ShoppingBag, User } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { AppViewMode } from '../types';

interface MobileAppNavBarProps {
  activeView: AppViewMode;
  onNavigateView: (view: AppViewMode) => void;
  onOrderClick: () => void;
  hasSelectedProduct?: boolean;
}

export const MobileAppNavBar: React.FC<MobileAppNavBarProps> = ({
  activeView,
  onNavigateView,
  onOrderClick,
  hasSelectedProduct = false,
}) => {
  const { orders, isUserAuthenticated, openAuthModal, siteSettings } = usePortal();
  const [activeSection, setActiveSection] = useState<'home' | 'gifts' | 'order'>('home');

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  useEffect(() => {
    if (activeView !== 'storefront') return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      const giftsEl = document.getElementById('gifts');
      const orderEl = document.getElementById('order-form');

      if (orderEl && scrollPos >= orderEl.offsetTop) {
        setActiveSection('order');
      } else if (giftsEl && scrollPos >= giftsEl.offsetTop) {
        setActiveSection('gifts');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView]);

  const handleHomeTap = () => {
    setActiveSection('home');
    if (activeView !== 'storefront') {
      onNavigateView('storefront');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCatalogTap = () => {
    setActiveSection('gifts');
    if (activeView !== 'storefront') {
      onNavigateView('storefront');
      setTimeout(() => {
        const el = document.getElementById('gifts');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      const el = document.getElementById('gifts');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckoutTap = () => {
    if (!isUserAuthenticated) {
      openAuthModal(
        'Sign in or create your complimentary account to proceed to Order Checkout (Card, COD, or Bank Transfer).',
        () => onNavigateView('checkout')
      );
    } else {
      onNavigateView('checkout');
    }
  };

  const handlePortalTap = () => {
    if (!isUserAuthenticated) {
      openAuthModal(
        'Sign in or create an account to access your User Portal, track orders, and manage saved recipients.',
        () => onNavigateView('user-portal')
      );
    } else {
      onNavigateView('user-portal');
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom App Navigation"
      className="fixed bottom-0 inset-x-0 z-40 min-[800px]:hidden bg-[#FBF9F5]/95 backdrop-blur-xl border-t border-[#EADBCE] shadow-[0_-6px_24px_rgba(20,56,44,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1.5">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={handleHomeTap}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 transition-all active:scale-90 cursor-pointer ${
            activeView === 'storefront' && activeSection === 'home'
              ? 'text-[#14382C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home
              className={`w-5 h-5 transition-transform ${
                activeView === 'storefront' && activeSection === 'home'
                  ? 'scale-110 stroke-[2.4]'
                  : 'stroke-2'
              }`}
            />
            {activeView === 'storefront' && activeSection === 'home' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium ${
              activeView === 'storefront' && activeSection === 'home'
                ? 'font-bold text-[#14382C]'
                : ''
            }`}
          >
            Home
          </span>
        </button>

        {/* Tab 2: Gifts Catalog */}
        <button
          type="button"
          onClick={handleCatalogTap}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 transition-all active:scale-90 cursor-pointer ${
            activeView === 'storefront' && activeSection === 'gifts'
              ? 'text-[#14382C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Gift
              className={`w-5 h-5 transition-transform ${
                activeView === 'storefront' && activeSection === 'gifts'
                  ? 'scale-110 stroke-[2.4]'
                  : 'stroke-2'
              }`}
            />
            {activeView === 'storefront' && activeSection === 'gifts' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium ${
              activeView === 'storefront' && activeSection === 'gifts'
                ? 'font-bold text-[#14382C]'
                : ''
            }`}
          >
            Catalog
          </span>
        </button>

        {/* Tab 3 (Center Elevated App Action): Order & Checkout */}
        <button
          type="button"
          onClick={handleCheckoutTap}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] -mt-3 transition-transform active:scale-90 cursor-pointer"
        >
          <div
            className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-md border transition-all ${
              activeView === 'checkout'
                ? 'bg-[#C59B27] text-[#14382C] border-[#14382C]'
                : 'bg-[#14382C] text-[#DFC066] border-[#C59B27]/60'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {hasSelectedProduct && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#DFC066] ring-2 ring-[#FBF9F5] animate-pulse" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 font-semibold ${
              activeView === 'checkout' ? 'text-[#C59B27] font-bold' : 'text-[#14382C]'
            }`}
          >
            Checkout
          </span>
        </button>

        {/* Tab 4: My Portal (Orders & Saved Recipients) */}
        <button
          type="button"
          onClick={handlePortalTap}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 transition-all active:scale-90 relative cursor-pointer ${
            activeView === 'user-portal' ? 'text-[#14382C]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <User
              className={`w-5 h-5 transition-transform ${
                activeView === 'user-portal' ? 'scale-110 stroke-[2.4]' : 'stroke-2'
              }`}
            />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[#14382C] text-[#DFC066] text-[9px] font-mono font-bold flex items-center justify-center border border-[#C59B27]/50">
                {activeOrdersCount}
              </span>
            )}
            {activeView === 'user-portal' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium ${
              activeView === 'user-portal' ? 'font-bold text-[#14382C]' : ''
            }`}
          >
            Portal
          </span>
        </button>

        {/* Tab 5: Custom Order Builder / Concierge */}
        <button
          type="button"
          onClick={() => {
            setActiveSection('order');
            onOrderClick();
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 transition-all active:scale-90 cursor-pointer ${
            activeView === 'storefront' && activeSection === 'order'
              ? 'text-[#14382C]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MessageCircle
              className={`w-5 h-5 transition-transform ${
                activeView === 'storefront' && activeSection === 'order'
                  ? 'scale-110 stroke-[2.4] text-[#14382C]'
                  : 'stroke-2'
              }`}
            />
            {activeView === 'storefront' && activeSection === 'order' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium ${
              activeView === 'storefront' && activeSection === 'order'
                ? 'font-bold text-[#14382C]'
                : ''
            }`}
          >
            Custom
          </span>
        </button>
      </div>
    </nav>
  );
};
