import React from 'react';

interface LogoProps {
  variant?: 'emblem' | 'full' | 'nav';
  className?: string;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', isDark = false }) => {
  // Brand colors
  const forestGreen = isDark ? '#E5EFE9' : '#14382C';
  const gold = '#C59B27';
  const goldLight = '#DFC066';
  const goldDark = '#9E7B1A';
  const creamBg = isDark ? '#11221B' : '#FDFBF7';

  // The official circular emblem
  const Emblem = ({ size = 64 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="The Gift Gallery Emblem"
    >
      <defs>
        <linearGradient id={`goldRing-${size}`} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DFC066" />
          <stop offset="50%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#9E7B1A" />
        </linearGradient>
        <radialGradient id={`emblemBg-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={creamBg} />
          <stop offset="90%" stopColor={isDark ? '#0C1A14' : '#F7F3EA'} />
        </radialGradient>
      </defs>

      {/* Outer Golden Rim */}
      <circle cx="100" cy="100" r="95" fill={`url(#emblemBg-${size})`} stroke={`url(#goldRing-${size})`} strokeWidth="4" />
      <circle cx="100" cy="100" r="91" fill="none" stroke={`url(#goldRing-${size})`} strokeWidth="1" strokeOpacity="0.4" />

      {/* Tied Ribbon Bow at Top */}
      <g transform="translate(100, 52) scale(0.65)" stroke={gold} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Loop */}
        <path d="M-1 0 C-18 -18 -32 -2 0 0" fill="#DFC066" fillOpacity="0.3" />
        {/* Right Loop */}
        <path d="M1 0 C18 -18 32 -2 0 0" fill="#DFC066" fillOpacity="0.3" />
        {/* Knot */}
        <circle cx="0" cy="0" r="3.5" fill={gold} />
        {/* Left Ribbon End */}
        <path d="M-2 2 C-8 12 -12 20 -15 26" strokeWidth="2" />
        {/* Right Ribbon End */}
        <path d="M2 2 C8 12 12 20 15 26" strokeWidth="2" />
      </g>

      {/* Central Monogram: TGG */}
      <g id="monogram" textAnchor="middle" style={{ fontFamily: 'Georgia, "Cormorant Garamond", serif', fontWeight: 700 }}>
        {/* First T */}
        <text x="65" y="105" fontSize="48" fill={forestGreen} letterSpacing="-2">
          T
        </text>
        {/* Middle G (Gold with flourish) */}
        <text x="100" y="107" fontSize="56" fill={gold} fontStyle="italic">
          G
        </text>
        {/* Third G */}
        <text x="135" y="105" fontSize="48" fill={forestGreen} letterSpacing="-2">
          G
        </text>
      </g>

      {/* Brand Script: The Gifts Gallery */}
      <text
        x="100"
        y="134"
        textAnchor="middle"
        fontSize="17.5"
        fontStyle="italic"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="600"
        fill={goldDark}
        letterSpacing="0.8"
      >
        The Gifts Gallery
      </text>

      {/* Divider with Center 4-Point Star */}
      <g stroke={gold} strokeWidth="1" strokeOpacity="0.7">
        <line x1="50" y1="147" x2="90" y2="147" />
        {/* Star */}
        <polygon points="100,143 102,147 106,147 103,149 104,153 100,150 96,153 97,149 94,147 98,147" fill={gold} stroke="none" />
        <line x1="110" y1="147" x2="150" y2="147" />
      </g>

      {/* Tagline */}
      <text
        x="100"
        y="167"
        textAnchor="middle"
        fontSize="11"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontWeight="500"
        fill={forestGreen}
        letterSpacing="1.2"
      >
        Gifts for Every Moment.
      </text>
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Emblem size={80} />
      </div>
    );
  }

  if (variant === 'nav') {
    return (
      <a href="#home" className={`group flex items-center gap-3 transition-opacity hover:opacity-95 ${className}`}>
        <Emblem size={44} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-serif text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#14382C]'}`}>
              The Gift Gallery
            </span>
            <span className="text-[10px] font-semibold text-[#C59B27] tracking-wider uppercase">TGG</span>
          </div>
          <span className={`text-[11px] tracking-wide mt-0.5 ${isDark ? 'text-emerald-200/70' : 'text-slate-500'}`}>
            Gifts for Every Moment.
          </span>
        </div>
      </a>
    );
  }

  // Full presentation (for Hero, Footer, Policies)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Emblem size={110} />
    </div>
  );
};
