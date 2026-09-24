import React from 'react';
import { Truck, Sparkles, MessageCircle, Heart, ShieldCheck, MapPin } from 'lucide-react';

interface DeliveryServiceProps {
  onOrderClick: () => void;
}

export const DeliveryService: React.FC<DeliveryServiceProps> = ({ onOrderClick }) => {
  const servicePillars = [
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'Careful door-to-door delivery available across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and beyond.',
    },
    {
      icon: Sparkles,
      title: 'Carefully Prepared',
      desc: 'Every gift is prepared with exquisite attention to detail — from silk ribbons and custom wax seals to pristine protective packaging.',
    },
    {
      icon: MessageCircle,
      title: 'Easy Ordering',
      desc: 'Order conveniently directly through WhatsApp. Transparent communication, real photos before dispatch, and prompt support.',
    },
    {
      icon: Heart,
      title: 'Special Moments',
      desc: 'We specialize in turning celebrations into lifelong memories. Optional midnight delivery arrangements available for milestone surprises.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F5F0E6]/60 border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
            DELIVERY & SERVICE EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#14382C] tracking-tight mb-4">
            From Our Hands to Their Moment.
          </h2>
          <p className="text-base text-slate-600 font-light">
            We handle every surprise with the utmost reverence, ensuring your gift arrives in flawless, celebration-ready condition.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {servicePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-7 border border-[#EADBCE] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] text-[#14382C] flex items-center justify-center mb-5 border border-[#C59B27]/30">
                  <Icon className="w-6 h-6 text-[#14382C]" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#14382C] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Delivery assurance box & CTA */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C59B27]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#14382C] text-[#DFC066] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#14382C]">Delivering Across Pakistan</span>
                <span className="text-[11px] text-[#C59B27] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fragile Handling Guaranteed
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Standard delivery timings: 1:00 PM – 10:00 PM. Same-city hand delivery and inter-city express couriers dispatched with temperature & impact protection.
              </p>
            </div>
          </div>

          <button
            onClick={onOrderClick}
            className="w-full md:w-auto px-7 py-3.5 rounded-full text-xs font-semibold tracking-wide text-white bg-[#14382C] hover:bg-[#0D261E] border border-[#C59B27]/50 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] shrink-0"
          >
            Order Your Gift
          </button>
        </div>

      </div>
    </section>
  );
};
