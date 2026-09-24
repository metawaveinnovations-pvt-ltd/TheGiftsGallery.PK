import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

export const QuickWhatsAppFloat: React.FC = () => {
  return (
    <aside
      aria-label="Direct WhatsApp Ordering Support"
      className="hidden md:flex fixed bottom-6 right-6 z-30 group items-center gap-2 animate-in fade-in"
    >
      <span className="bg-[#14382C] text-[#DFC066] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-[#C59B27]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Order on WhatsApp
      </span>
      <a
        href={BRAND_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Order at 03390088458"
        className="w-13 h-13 rounded-full bg-[#14382C] text-white flex items-center justify-center shadow-xl border-2 border-[#DFC066] hover:bg-[#0D261E] hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <MessageCircle className="w-6 h-6 text-[#DFC066]" />
      </a>
    </aside>
  );
};
