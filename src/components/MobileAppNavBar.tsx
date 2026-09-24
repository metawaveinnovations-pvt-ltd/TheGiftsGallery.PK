import React, { useState, useEffect } from 'react';
import { Gift, Home, Sparkles, MessageCircle, ClipboardCheck, PhoneCall } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

interface MobileAppNavBarProps {
  onOrderClick: () => void;
  hasSelectedProduct?: boolean;
}

export const MobileAppNavBar: React.FC<MobileAppNavBarProps> = ({
  onOrderClick,
  hasSelectedProduct = false,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'gifts' | 'occasions' | 'order'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const giftsEl = document.getElementById('gifts');
      const occasionsEl = document.getElementById('occasions');
      const orderEl = document.getElementById('order-form');

      if (orderEl && scrollPos >= orderEl.offsetTop) {
        setActiveTab('order');
      } else if (occasionsEl && scrollPos >= occasionsEl.offsetTop) {
        setActiveTab('occasions');
      } else if (giftsEl && scrollPos >= giftsEl.offsetTop) {
        setActiveTab('gifts');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Mobile Bottom App Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#FBF9F5]/95 backdrop-blur-lg border-t border-[#EADBCE] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* Tab 1: Home */}
        <a
          href="#home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all active:scale-90 ${
            activeTab === 'home' ? 'text-[#14382C]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 font-medium ${activeTab === 'home' ? 'font-bold text-[#14382C]' : ''}`}>
            Home
          </span>
        </a>

        {/* Tab 2: Gifts Catalog */}
        <a
          href="#gifts"
          onClick={() => setActiveTab('gifts')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all active:scale-90 ${
            activeTab === 'gifts' ? 'text-[#14382C]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Gift className={`w-5 h-5 transition-transform ${activeTab === 'gifts' ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            {activeTab === 'gifts' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 font-medium ${activeTab === 'gifts' ? 'font-bold text-[#14382C]' : ''}`}>
            Catalog
          </span>
        </a>

        {/* Tab 3: Occasions */}
        <a
          href="#occasions"
          onClick={() => setActiveTab('occasions')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all active:scale-90 ${
            activeTab === 'occasions' ? 'text-[#14382C]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Sparkles className={`w-5 h-5 transition-transform ${activeTab === 'occasions' ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            {activeTab === 'occasions' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 font-medium ${activeTab === 'occasions' ? 'font-bold text-[#14382C]' : ''}`}>
            Occasions
          </span>
        </a>

        {/* Tab 4: Order Form / Cart */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('order');
            onOrderClick();
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all active:scale-90 relative cursor-pointer ${
            activeTab === 'order' ? 'text-[#14382C]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ClipboardCheck className={`w-5 h-5 transition-transform ${activeTab === 'order' ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            {hasSelectedProduct && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#C59B27] ring-2 ring-white animate-pulse" />
            )}
            {activeTab === 'order' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 font-medium ${activeTab === 'order' ? 'font-bold text-[#14382C]' : ''}`}>
            Order
          </span>
        </button>

        {/* Tab 5: WhatsApp Instant Assist */}
        <a
          href={BRAND_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 text-[#25D366] transition-all active:scale-90"
        >
          <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold text-emerald-800">
            WhatsApp
          </span>
        </a>
      </div>
    </nav>
  );
};
