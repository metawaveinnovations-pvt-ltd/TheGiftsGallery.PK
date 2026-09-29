import React from 'react';
import { Logo } from './Logo';
import { BRAND_INFO } from '../data/products';
import { usePortal } from '../context/PortalContext';
import { AppViewMode } from '../types';
import { Instagram, MessageCircle, MapPin, ArrowUp, User, ShieldCheck, ShoppingBag } from 'lucide-react';

interface FooterProps {
  onNavigateView?: (view: AppViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateView }) => {
  const { siteSettings, isUserAuthenticated, openAuthModal } = usePortal();

  const scrollToTop = () => {
    if (onNavigateView) onNavigateView('storefront');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Gifts & Baskets', href: '#gifts' },
    { label: 'Collections', href: '#categories' },
    { label: 'Occasions', href: '#occasions' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQs & Guide', href: '#faq-guide' },
    { label: 'Policies', href: '#policies' },
    { label: 'Order Form', href: '#order-form' },
  ];

  return (
    <footer className="bg-[#0C1A14] text-[#FBF9F5] border-t border-[#C59B27]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-emerald-950/80">
          
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start">
            <a
              href="#home"
              onClick={scrollToTop}
              title="The Gift Gallery (TGG) — Home"
              className="group flex items-center gap-3 mb-4 cursor-pointer"
            >
              <div className="p-1.5 rounded-xl bg-white/95 border border-[#C59B27]/60 shadow-md flex items-center justify-center shrink-0 group-hover:border-[#DFC066] transition-colors">
                <Logo variant="mark" size={56} />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white group-hover:text-[#DFC066] transition-colors tracking-wide block">
                  The Gift Gallery
                </span>
                <span className="text-xs text-[#DFC066] font-semibold tracking-wider uppercase">
                  TGG · Pakistan
                </span>
              </div>
            </a>

            <p className="text-sm font-serif italic text-emerald-100/80 mb-4 max-w-sm">
              “Gifts for Every Moment.”
            </p>

            <p className="text-xs text-emerald-100/60 leading-relaxed max-w-sm mb-6">
              Thoughtfully curated gifts, bespoke hampers, luxury fragrances, and personalized keepsakes delivered with care across Pakistan.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-5">
              <MapPin className="w-4 h-4 text-[#DFC066] shrink-0" />
              <span>Nationwide Delivery across Pakistan</span>
            </div>

            {/* Co-Branded Tech Partnership & Management Callout */}
            <div className="pt-4 border-t border-emerald-900/60 w-full max-w-sm">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-[#DFC066] mb-1">
                <a
                  href="#home"
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors"
                >
                  The Gifts Gallery
                </a>{' '}
                <span>×</span>{' '}
                <a
                  href={BRAND_INFO.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline decoration-[#DFC066]/50 hover:decoration-white transition-colors"
                >
                  MetaWave Innovations LTD
                </a>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Official Tech Partnership · Digitally Managed by{' '}
                <a
                  href={BRAND_INFO.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-[#DFC066] underline decoration-[#C59B27]/50 hover:decoration-[#DFC066] transition-colors"
                >
                  MetaWave Innovations LTD
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#DFC066] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/70">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => {
                      if (onNavigateView) onNavigateView('storefront');
                    }}
                    className="hover:text-[#DFC066] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {onNavigateView && (
                <>
                  <li className="pt-2 border-t border-emerald-900/50">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isUserAuthenticated) {
                          openAuthModal(
                            'Sign in or create an account to access Checkout & Payment.',
                            () => onNavigateView('checkout')
                          );
                        } else {
                          onNavigateView('checkout');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-[#DFC066] hover:text-white font-semibold transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Checkout (Card / COD / Transfer)</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isUserAuthenticated) {
                          openAuthModal(
                            'Sign in to open your User Portal and track orders.',
                            () => onNavigateView('user-portal')
                          );
                        } else {
                          onNavigateView('user-portal');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 hover:text-[#DFC066] transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#DFC066]" />
                      <span>My Gifting Portal (Track Orders)</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigateView('admin-portal')}
                      className="inline-flex items-center gap-1.5 hover:text-[#DFC066] transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#DFC066]" />
                      <span>Admin Concierge Portal</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact & Social (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#DFC066] mb-4">
              Connect & Orders
            </h4>
            
            <div className="space-y-3 text-xs text-emerald-100/80 mb-6">
              <div>
                <span className="text-emerald-100/50 block text-[11px] mb-0.5">WhatsApp / Direct Orders:</span>
                <a
                  href={BRAND_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:text-[#DFC066] flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-[#DFC066]" />
                  <span>{BRAND_INFO.whatsappNumber}</span>
                </a>
              </div>

              <div>
                <span className="text-emerald-100/50 block text-[11px] mb-0.5">Instagram Community:</span>
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:text-[#DFC066] flex items-center gap-1.5"
                >
                  <Instagram className="w-4 h-4 text-[#DFC066]" />
                  <span>{BRAND_INFO.instagramHandle}</span>
                </a>
              </div>

              <div>
                <span className="text-emerald-100/50 block text-[11px] mb-0.5">Standard Hours:</span>
                <span className="text-white">1:00 PM – 10:00 PM (1–2 Days Prior Notice)</span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#DFC066] hover:underline"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        {/* Keyword Semantic Breadcrumb Index for Search Console & SEO */}
        <div className="pt-8 pb-4 border-b border-emerald-950/60">
          <div className="text-[11px] font-medium text-emerald-100/40 uppercase tracking-wider mb-2">
            Popular Searches &amp; Specialties
          </div>
          <p className="text-[11px] text-emerald-100/60 leading-relaxed">
            Anniversary Gifts · Birthday Gifts · Gifts Shop Pakistan · Gifts Packaging · Snacks Basket · Makeup Basket · Luxury Watches · Genuine Leather Wallets · Designer Bracelets · Boutiques · Curated Hampers · Corporate Event Gifts · Karachi Gift Delivery · Lahore Gift Shop · Islamabad Midnight Delivery
          </p>
        </div>

        {/* Footer Statement, Tech Partnership & Copyright */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          
          <a
            href="#home"
            onClick={scrollToTop}
            className="text-xs font-serif tracking-widest text-[#DFC066] hover:text-white transition-colors font-semibold"
          >
            GIFTS • SURPRISES • MEMORIES
          </a>

          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-[11px] text-emerald-100/70">
            <span className="font-medium text-emerald-100/90">
              <a
                href="#home"
                onClick={scrollToTop}
                className="hover:text-[#DFC066] transition-colors"
              >
                The Gifts Gallery
              </a>{' '}
              <span className="text-[#DFC066]">×</span>{' '}
              <a
                href={BRAND_INFO.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#DFC066] underline decoration-[#C59B27]/50 hover:decoration-[#DFC066] transition-colors"
              >
                MetaWave Innovations LTD
              </a>{' '}
              Tech Partnership
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-emerald-100/30">·</span>
            <span>
              Managed by{' '}
              <a
                href={BRAND_INFO.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#DFC066] hover:text-white underline decoration-[#DFC066]/50 hover:decoration-white transition-colors"
              >
                MetaWave Innovations LTD
              </a>
            </span>
          </div>

          <p className="text-[11px] text-emerald-100/50">
            © 2026{' '}
            <a
              href="#home"
              onClick={scrollToTop}
              className="hover:text-[#DFC066] transition-colors"
            >
              The Gift Gallery
            </a>
            . All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
};
