import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { BRAND_INFO } from '../data/products';
import { usePortal } from '../context/PortalContext';
import { AppViewMode } from '../types';
import {
  Instagram,
  Menu,
  X,
  Gift,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  CalendarHeart,
  Clock,
  FileCheck,
  HelpCircle,
  ShoppingBag,
  Truck,
  ArrowUpRight,
} from 'lucide-react';

interface HeaderProps {
  activeView: AppViewMode;
  onNavigateView: (view: AppViewMode) => void;
  onOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigateView,
  onOrderClick,
}) => {
  const {
    siteSettings,
    isUserAuthenticated,
    userProfile,
    openAuthModal,
  } = usePortal();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCenterDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCenterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const exploreDropdownItems = [
    {
      label: 'Occasions & Milestones',
      subtitle: 'Birthdays, Anniversaries, Nikkah & Corporate',
      href: '#occasions',
      icon: CalendarHeart,
    },
    {
      label: 'How It Works',
      subtitle: 'Our 4-step bespoke gifting & curation process',
      href: '#how-it-works',
      icon: Clock,
    },
    {
      label: 'Delivery & Coverage',
      subtitle: 'Nationwide PK shipping & midnight surprises',
      href: '#delivery',
      icon: Truck,
    },
    {
      label: 'Customer Policies',
      subtitle: 'Booking notice, advance verification & care',
      href: '#policies',
      icon: FileCheck,
    },
    {
      label: 'Gifting Guide & FAQs',
      subtitle: 'Answers on tiers, customization & timelines',
      href: '#faq-guide',
      icon: HelpCircle,
    },
  ];

  const handleNavAnchor = (href: string) => {
    setCenterDropdownOpen(false);
    setMobileMenuOpen(false);
    if (activeView !== 'storefront') {
      onNavigateView('storefront');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUserPortalClick = () => {
    setCenterDropdownOpen(false);
    setMobileMenuOpen(false);
    if (!isUserAuthenticated) {
      openAuthModal(
        'Sign in or create an account to access your personal User Portal, order tracking, and saved recipients.',
        () => onNavigateView('user-portal')
      );
    } else {
      onNavigateView('user-portal');
    }
  };

  const handleCheckoutNav = () => {
    setCenterDropdownOpen(false);
    setMobileMenuOpen(false);
    if (!isUserAuthenticated) {
      openAuthModal(
        'Sign in or create your account to proceed to Order Checkout (Card, COD, or Bank Transfer).',
        () => onNavigateView('checkout')
      );
    } else {
      onNavigateView('checkout');
    }
  };

  const handleMouseEnterDropdown = () => {
    if (dropdownTimeoutRef.current) {
      window.clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setCenterDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setCenterDropdownOpen(false);
    }, 160);
  };

  return (
    <>
      {/* Top Executive Micro Announcement Bar */}
      <div className="bg-[#102E23] text-[#FBF9F5]/95 text-[11px] sm:text-[12px] font-medium tracking-wide py-1.5 px-4 text-center border-b border-[#C59B27]/25 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <a
          href="#home"
          onClick={() => onNavigateView('storefront')}
          className="hover:text-[#DFC066] transition-colors duration-200"
        >
          {siteSettings.announcementText}
        </a>
        <span aria-hidden="true" className="text-[#C59B27]/50 hidden sm:inline">
          ·
        </span>
        <span className="hidden sm:inline text-emerald-100/85">
          {siteSettings.noticePeriodText}
        </span>
        <span aria-hidden="true" className="text-[#C59B27]/50">
          ·
        </span>
        <a
          href={siteSettings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Gift Gallery Instagram"
          className="group inline-flex items-center gap-1 text-[#DFC066] hover:text-white font-semibold transition-colors duration-200"
        >
          <Instagram className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
          <span className="hidden md:inline underline-offset-4 group-hover:underline decoration-[#DFC066]/60">
            {siteSettings.instagramHandle}
          </span>
        </a>
      </div>

      {/* Main Sticky Header: 3-Zone Architecture with 5-Tab Center Navigation (3rd Tab Dropdown) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FBF9F5]/95 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(20,56,44,0.12)] border-b border-[#EADBCE] py-2'
            : 'bg-[#FBF9F5]/98 border-b border-[#EADBCE]/75 py-2.5 min-[800px]:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Brand Zone */}
          <div
            className="shrink-0 transition-transform duration-200 hover:scale-[1.01]"
            onClick={() => onNavigateView('storefront')}
          >
            <Logo variant="nav" />
          </div>

          {/* Zone 2: 5-Tab Navigation Pill Dock (>= 800px) — 3rd (Center) Tab is Dropdown */}
          <nav
            aria-label="Primary Navigation"
            className="hidden min-[800px]:flex items-center gap-0.5 bg-[#F4EFE6]/90 backdrop-blur-md border border-[#EADBCE] rounded-full p-1 shadow-[inset_0_1px_2px_rgba(20,56,44,0.05),0_2px_10px_-4px_rgba(20,56,44,0.05)]"
          >
            {/* Tab 1: Curated Gifts */}
            <a
              href="#gifts"
              onClick={(e) => {
                e.preventDefault();
                handleNavAnchor('#gifts');
              }}
              className="relative px-3.5 xl:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-[#1C2826] hover:text-[#14382C] hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(20,56,44,0.1)] transition-all duration-200 whitespace-nowrap after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-4 after:h-[1.5px] after:bg-[#C59B27] after:rounded-full after:transition-all after:duration-200"
            >
              Curated Gifts
            </a>

            {/* Tab 2: Collections */}
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                handleNavAnchor('#categories');
              }}
              className="relative px-3.5 xl:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-[#1C2826] hover:text-[#14382C] hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(20,56,44,0.1)] transition-all duration-200 whitespace-nowrap after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-4 after:h-[1.5px] after:bg-[#C59B27] after:rounded-full after:transition-all after:duration-200"
            >
              Collections
            </a>

            {/* Tab 3 (CENTER): Interactive Boutique Dropdown Menu */}
            <div
              ref={dropdownRef}
              className="relative mx-0.5"
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                type="button"
                onClick={() => setCenterDropdownOpen((prev) => !prev)}
                aria-expanded={centerDropdownOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  centerDropdownOpen
                    ? 'bg-[#14382C] text-[#DFC066] border border-[#14382C] shadow-[0_4px_14px_-3px_rgba(20,56,44,0.3)]'
                    : 'bg-white text-[#14382C] border border-[#C59B27]/40 hover:border-[#C59B27] hover:bg-[#FFFDF9] hover:shadow-[0_3px_12px_-3px_rgba(197,155,39,0.22)]'
                }`}
              >
                <Sparkles
                  className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    centerDropdownOpen ? 'text-[#DFC066]' : 'text-[#C59B27]'
                  }`}
                />
                <span>Explore TGG</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    centerDropdownOpen ? 'rotate-180 text-[#DFC066]' : 'text-[#C59B27]'
                  }`}
                />
              </button>

              {/* Center Dropdown Panel */}
              {centerDropdownOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 -translate-x-1/2 mt-2.5 w-[380px] rounded-2xl bg-[#FBF9F5]/98 backdrop-blur-xl border border-[#C59B27]/35 shadow-[0_22px_50px_-12px_rgba(20,56,44,0.22)] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Top Header */}
                  <div className="px-3 py-2 mb-1.5 border-b border-[#EADBCE]/80 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                      The Gift Gallery · Concierge Hub
                    </span>
                    <span className="text-[10px] font-serif italic text-slate-500">
                      Gifts for Every Moment
                    </span>
                  </div>

                  {/* Dropdown Links */}
                  <div className="space-y-1">
                    {exploreDropdownItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavAnchor(item.href);
                          }}
                          className="group flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-[#F4EFE6]/90 border border-transparent hover:border-[#EADBCE]/80 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#EADBCE] group-hover:bg-[#14382C] group-hover:border-[#14382C] text-[#14382C] group-hover:text-[#DFC066] flex items-center justify-center shrink-0 transition-all duration-200 mt-0.5 shadow-2xs">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-serif font-bold text-[#14382C] group-hover:text-[#C59B27] transition-colors">
                                {item.label}
                              </div>
                              <div className="text-[11px] text-slate-500 leading-snug">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#C59B27] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 mt-1" />
                        </a>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer Quick Actions */}
                  <div className="mt-2.5 pt-2.5 border-t border-[#EADBCE] grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCenterDropdownOpen(false);
                        onOrderClick();
                      }}
                      className="px-3 py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EADBCE] text-[#14382C] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Custom Form</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckoutNav}
                      className="px-3 py-2 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#DFC066]" />
                      <span>Direct Checkout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tab 4: User Portal */}
            <button
              type="button"
              onClick={handleUserPortalClick}
              className={`relative px-3.5 xl:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeView === 'user-portal'
                  ? 'bg-[#14382C] text-white shadow-[0_2px_8px_-2px_rgba(20,56,44,0.25)]'
                  : "text-[#1C2826] hover:text-[#14382C] hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(20,56,44,0.1)] after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-4 after:h-[1.5px] after:bg-[#C59B27] after:rounded-full after:transition-all after:duration-200"
              }`}
            >
              User Portal
            </button>

            {/* Tab 5: Admin Portal */}
            <button
              type="button"
              onClick={() => onNavigateView('admin-portal')}
              className={`relative px-3.5 xl:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeView === 'admin-portal'
                  ? 'bg-[#14382C] text-white shadow-[0_2px_8px_-2px_rgba(20,56,44,0.25)]'
                  : "text-[#1C2826] hover:text-[#14382C] hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(20,56,44,0.1)] after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-4 after:h-[1.5px] after:bg-[#C59B27] after:rounded-full after:transition-all after:duration-200"
              }`}
            >
              Admin Portal
            </button>
          </nav>

          {/* Zone 3: Actions (User Sign In / Portal + Instagram + Checkout Order Now) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleUserPortalClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#14382C] bg-white/90 hover:bg-[#F4EFE6] border border-[#EADBCE] hover:border-[#C59B27]/60 shadow-2xs hover:shadow-xs transition-all duration-200 whitespace-nowrap cursor-pointer"
              title={isUserAuthenticated ? 'Open User Portal' : 'Sign In / Sign Up'}
            >
              <User className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>
                {isUserAuthenticated
                  ? userProfile.fullName.split(' ')[0]
                  : 'Sign In'}
              </span>
            </button>

            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Gift Gallery Instagram"
              className="inline-flex items-center justify-center w-8 h-8 text-slate-700 hover:text-[#14382C] bg-white/70 hover:bg-[#F4EFE6] border border-transparent hover:border-[#EADBCE] rounded-full transition-all duration-200"
              title="Visit @thegiftsgallery.pk on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              onClick={onOrderClick}
              className="min-h-[38px] sm:min-h-[40px] inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wide text-[#FBF9F5] bg-[#14382C] hover:bg-[#0D261E] border border-[#C59B27]/45 hover:border-[#DFC066] shadow-xs hover:shadow-[0_6px_16px_-4px_rgba(20,56,44,0.28)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#DFC066] shrink-0" />
              <span className="hidden min-[400px]:inline">Order &amp; Checkout</span>
              <span className="min-[400px]:hidden">Order</span>
            </button>

            {/* Mobile Menu Button (< 800px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-800 rounded-xl hover:bg-[#F4EFE6] border border-transparent hover:border-[#EADBCE] focus:outline-none min-[800px]:hidden cursor-pointer active:scale-95 transition-all duration-200"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (< 800px — Mirrors the 5-Tab Architecture) */}
        {mobileMenuOpen && (
          <div className="min-[800px]:hidden bg-[#FBF9F5]/98 backdrop-blur-xl border-b border-[#EADBCE] px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Mobile Tab 1: Curated Gifts */}
            <a
              href="#gifts"
              onClick={(e) => {
                e.preventDefault();
                handleNavAnchor('#gifts');
              }}
              className="min-h-[42px] flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-[#F4EFE6] hover:text-[#14382C] transition-all"
            >
              <span>1. Curated Gifts</span>
            </a>

            {/* Mobile Tab 2: Collections */}
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                handleNavAnchor('#categories');
              }}
              className="min-h-[42px] flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-[#F4EFE6] hover:text-[#14382C] transition-all"
            >
              <span>2. Collections</span>
            </a>

            {/* Mobile Tab 3 (Center Dropdown Accordion): Explore TGG */}
            <div className="rounded-xl border border-[#EADBCE] bg-white/90 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
                className="w-full min-h-[42px] flex items-center justify-between px-4 py-2 text-sm font-semibold text-[#14382C] bg-[#F4EFE6]/70 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  <span>3. Explore TGG (Occasions, Process &amp; FAQs)</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C59B27] transition-transform duration-200 ${
                    mobileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileDropdownOpen && (
                <div className="p-2 space-y-1 border-t border-[#EADBCE]/60">
                  {exploreDropdownItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavAnchor(item.href);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-[#F4EFE6] hover:text-[#14382C] transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Tabs 4 & 5: User Portal & Admin Portal */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleUserPortalClick}
                className="min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#14382C] bg-[#F4EFE6] hover:bg-[#EADBCE] rounded-xl border border-[#C59B27]/40 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>4. User Portal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateView('admin-portal');
                }}
                className="min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-[#F4EFE6] rounded-xl border border-[#EADBCE] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#14382C]" />
                <span>5. Admin Portal</span>
              </button>
            </div>

            <div className="pt-3 border-t border-[#EADBCE]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] flex items-center gap-2 text-xs text-slate-700 font-medium hover:text-[#14382C]"
              >
                <Instagram className="w-4 h-4 text-[#C59B27]" />
                <span>{siteSettings.instagramHandle}</span>
              </a>
              <a
                href={siteSettings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] flex items-center text-xs font-semibold text-[#14382C] underline decoration-[#C59B27]"
              >
                WhatsApp: {siteSettings.whatsappNumber}
              </a>
            </div>
            <div className="pt-2 border-t border-[#EADBCE]/60 text-[11px] text-slate-500">
              <a
                href="#home"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateView('storefront');
                }}
                className="font-medium text-[#14382C] hover:text-[#C59B27] transition-colors"
              >
                The Gifts Gallery
              </a>{' '}
              <span className="text-[#C59B27]">×</span>{' '}
              <a
                href={BRAND_INFO.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#14382C] hover:text-[#C59B27] underline decoration-[#C59B27]/50 transition-colors"
              >
                MetaWave Innovations LTD
              </a>{' '}
              · Managed by{' '}
              <a
                href={BRAND_INFO.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#14382C] hover:text-[#C59B27] underline decoration-[#C59B27]/50 transition-colors"
              >
                MetaWave Innovations LTD
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
