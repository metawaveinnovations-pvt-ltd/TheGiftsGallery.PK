import React from 'react';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Cake, HeartHandshake, Heart, UserCheck, GraduationCap, Baby, Briefcase, Package } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cake':
        return Cake;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Heart':
        return Heart;
      case 'UserCheck':
        return UserCheck;
      case 'GraduationCap':
        return GraduationCap;
      case 'Baby':
        return Baby;
      case 'Briefcase':
        return Briefcase;
      case 'Package':
        return Package;
      default:
        return Package;
    }
  };

  return (
    <section id="categories" className="py-16 md:py-24 bg-[#F5F0E6]/50 border-y border-[#EADBCE]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
              CURATED COLLECTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#14382C] tracking-tight">
              Find a Gift They’ll Remember
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-light">
              Explore signature gifting concepts tailored to each relationship and milestone.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-slate-500 font-medium">
            Hand-assembled with premium packaging · Delivery nationwide
          </div>
        </div>

        {/* Categories Grid (8 categories) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = getIcon(cat.iconName);
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#F4EFE6] text-[#14382C] group-hover:bg-[#14382C] group-hover:text-[#DFC066] transition-colors flex items-center justify-center border border-[#C59B27]/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                      TGG Collection
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-[#14382C] group-hover:text-[#C59B27] transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#9E7B1A] mb-2.5">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#14382C] group-hover:text-[#C59B27] transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
