import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { BRAND_INFO } from '../data/products';
import { usePortal } from '../context/PortalContext';
import { AppViewMode } from '../types';
import { Instagram, Menu, X, Gift, User, ShieldCheck } from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Gifts', href: '#gifts' },
    { label: 'Collections', href: '#categories' },
    { label: 'Occasions', href: '#occasions' },
    { label: 'Process', href: '#how-it-works' },
    { label: 'FAQs', href: '#faq-guide' },
  ];

  const handleNavAnchor = (href: string) => {
    if (activeView !== 'storefront') {
      onNavigateView('storefront');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
    setMobileMenuOpen(false);
  };

  const handleUserPortalClick = () => {
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

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#14382C] text-[#FBF9F5] text-[12px] font-medium tracking-wide py-1.5 px-4 text-center border-b border-[#C59B27]/30 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <a
          href="#home"
          onClick={() => onNavigateView('storefront')}
          className="hover:text-[#DFC066] transition-colors"
        >
          {siteSettings.announcementText}
        </a>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
        <span className="hidden sm:inline">{siteSettings.noticePeriodText}</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <a
          href={siteSettings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Gift Gallery Instagram"
          className="inline-flex items-center gap-1 text-[#DFC066] hover:underline font-semibold"
        >
          <Instagram className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{siteSettings.instagramHandle}</span>
        </a>
      </div>

      {/* Main Sticky Header: Follows Top Bar Contract */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FBF9F5]/95 backdrop-blur-md shadow-sm border-b border-[#EADBCE]/80 py-2.5'
            : 'bg-[#FBF9F5] border-b border-[#EADBCE]/50 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Zone 1: Brand Zone */}
          <div className="shrink-0" onClick={() => onNavigateView('storefront')}>
            <Logo variant="nav" />
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1C2826]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleNavAnchor(link.href)}
                className="relative py-1 text-slate-700 hover:text-[#14382C] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C59B27] hover:after:w-full after:transition-all after:duration-200 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleUserPortalClick}
              className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                activeView === 'user-portal'
                  ? 'text-[#14382C] font-bold underline decoration-[#C59B27] underline-offset-4'
                  : 'text-slate-700 hover:text-[#14382C]'
              }`}
            >
              User Portal
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('admin-portal')}
              className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                activeView === 'admin-portal'
                  ? 'text-[#14382C] font-bold underline decoration-[#C59B27] underline-offset-4'
                  : 'text-slate-700 hover:text-[#14382C]'
              }`}
            >
              Admin
            </button>
          </nav>

          {/* Zone 3: Actions (User Sign In / Portal + Instagram + Checkout Order Now) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleUserPortalClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#14382C] hover:bg-[#F4EFE6] border border-[#C59B27]/40 transition-colors whitespace-nowrap cursor-pointer"
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
              className="inline-flex items-center justify-center p-2 text-slate-700 hover:text-[#14382C] hover:bg-[#F4EFE6] rounded-full transition-colors"
              title="Visit @thegiftsgallery.pk on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              onClick={onOrderClick}
              className="min-h-[40px] sm:min-h-[44px] inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] shadow-sm hover:shadow transition-all duration-200 border border-[#C59B27]/40 active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#DFC066]" />
              <span>Order &amp; Checkout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-800 rounded-xl hover:bg-slate-100 focus:outline-none lg:hidden cursor-pointer active:scale-95 transition-transform"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FBF9F5] border-b border-[#EADBCE] px-4 pt-3 pb-5 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleNavAnchor(link.href)}
                className="min-h-[44px] flex items-center px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-[#F4EFE6] hover:text-[#14382C] active:scale-[0.99] transition-all"
              >
                {link.label}
              </a>
            ))}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleUserPortalClick}
                className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#14382C] bg-[#F4EFE6] rounded-xl border border-[#C59B27]/40 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#C59B27]" />
                <span>
                  {isUserAuthenticated ? 'My User Portal' : 'Sign In / Portal'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateView('admin-portal');
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-800 bg-white rounded-xl border border-[#EADBCE] cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#14382C]" />
                <span>Admin Portal</span>
              </button>
            </div>

            <div className="pt-3 border-t border-[#EADBCE]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center gap-2 text-xs text-slate-700 font-medium hover:text-[#14382C]"
              >
                <Instagram className="w-4 h-4 text-[#C59B27]" />
                <span>{siteSettings.instagramHandle}</span>
              </a>
              <a
                href={siteSettings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center text-xs font-semibold text-[#14382C] underline decoration-[#C59B27]"
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
