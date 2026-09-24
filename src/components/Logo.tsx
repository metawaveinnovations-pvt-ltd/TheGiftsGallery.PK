import React from 'react';

interface LogoProps {
  variant?: 'mark' | 'emblem' | 'full' | 'nav';
  className?: string;
  isDark?: boolean;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  isDark = false,
  size = 'md',
}) => {
  // Dimension mapping
  const getWidth = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm':
        return 70;
      case 'md':
        return 120;
      case 'lg':
        return 180;
      case 'xl':
        return 260;
      default:
        return 120;
    }
  };

  const width = getWidth();

  // The Exact Official TGG Image Logo Component
  const ExactTGGMark = ({ markWidth = width }: { markWidth?: number }) => {
    return (
      <picture className="shrink-0 inline-flex items-center justify-center">
        <source srcSet="/tgg_logo.webp" type="image/webp" />
        <source srcSet="/tgg_logo.png" type="image/png" />
        <img
          src="/tgg_logo.png"
          alt="The Gift Gallery (TGG) Official Logo"
          width={markWidth}
          style={{
            width: markWidth,
            height: 'auto',
            aspectRatio: '400 / 280',
            maxHeight: '100%',
          }}
          className="shrink-0 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 select-none"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
        />
      </picture>
    );
  };

  // 1. Navigation variant (Clean and compact for sticky header)
  if (variant === 'nav') {
    return (
      <a
        href="#home"
        className={`group flex items-center gap-3 transition-opacity hover:opacity-95 ${className}`}
      >
        <ExactTGGMark markWidth={52} />
        <div className="flex flex-col">
          <span
            className={`font-serif text-lg sm:text-xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-[#0E2D21]'
            }`}
          >
            The Gift Gallery
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#C59B27] tracking-widest">
            TGG · Curated Gifting
          </span>
        </div>
      </a>
    );
  }

  // 2. Pure mark variant (Only the bow and monogram)
  if (variant === 'mark' || variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <ExactTGGMark markWidth={typeof size === 'number' ? size : 75} />
      </div>
    );
  }

  // 3. Full centerpiece variant (For Hero, Brand section, Footer, Order Confirmation)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <ExactTGGMark markWidth={typeof size === 'number' ? size : 150} />
      <div className="mt-3">
        <h2
          className={`font-serif text-xl sm:text-2xl font-bold tracking-wider uppercase ${
            isDark ? 'text-white' : 'text-[#0E2D21]'
          }`}
        >
          The Gift Gallery
        </h2>
        <p className="text-xs sm:text-sm font-serif italic text-[#C59B27] tracking-wide mt-0.5">
          Gifts for Every Moment.
        </p>
      </div>
    </div>
  );
};
