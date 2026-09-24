import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { BRAND_INFO } from '../data/products';
import { Instagram, Menu, X, Gift, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
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
    { label: 'Policies', href: '#policies' },
    { label: 'Order', href: '#order-form' },
  ];

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#14382C] text-[#FBF9F5] text-[12px] font-medium tracking-wide py-1.5 px-4 text-center border-b border-[#C59B27]/30 flex items-center justify-center gap-3">
        <span>✨ Nationwide Delivery Across Pakistan</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <span className="hidden sm:inline">1–2 Days Prior Notice</span>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
        <a
          href={BRAND_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#DFC066] hover:underline font-semibold"
        >
          WhatsApp: {BRAND_INFO.whatsappNumber}
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
          <div className="shrink-0">
            <Logo variant="nav" />
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#1C2826]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 text-slate-700 hover:text-[#14382C] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C59B27] hover:after:w-full after:transition-all after:duration-200 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions (Order Now + Instagram + WhatsApp) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct WhatsApp link */}
            <a
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp Concierge"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#14382C] hover:bg-[#F4EFE6] border border-[#C59B27]/40 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="hidden md:inline">WhatsApp Concierge</span>
              <span className="md:hidden">WhatsApp</span>
            </a>

            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Gift Gallery Instagram"
              className="hidden sm:flex p-2 text-slate-700 hover:text-[#14382C] hover:bg-[#F4EFE6] rounded-full transition-colors"
              title="Visit @thegiftsgallery.pk on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              onClick={onOrderClick}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] shadow-sm hover:shadow transition-all duration-200 border border-[#C59B27]/40 active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#DFC066]" />
              <span>Order Now</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 rounded-lg hover:bg-slate-100 focus:outline-none lg:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FBF9F5] border-b border-[#EADBCE] px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-800 rounded-md hover:bg-[#F4EFE6] hover:text-[#14382C]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#EADBCE]/80 flex items-center justify-between">
              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-[#14382C]"
              >
                <Instagram className="w-4 h-4 text-[#C59B27]" />
                <span>@thegiftsgallery.pk</span>
              </a>
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#14382C] underline decoration-[#C59B27]"
              >
                WhatsApp (03390088458)
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
