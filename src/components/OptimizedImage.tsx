import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
  fallbackTitle?: string;
  categoryName?: string;
  onClick?: () => void;
}

/**
 * Normalizes any image path so that both local Vite dev paths and
 * production static paths (/assets/images/...) resolve reliably without 404s.
 */
export function normalizeImagePath(rawPath: string): { jpgUrl: string; webpUrl: string } {
  if (!rawPath) {
    return { jpgUrl: '/assets/images/tgg_hero_curated_gifting_1790253103850.jpg', webpUrl: '/assets/images/tgg_hero_curated_gifting_1790253103850.webp' };
  }

  // Strip leading /src/assets/images/ or src/assets/images/ to /assets/images/
  let cleanPath = rawPath.replace(/^\/?src\/assets\/images\//, '/assets/images/');

  // If path is just filename without /assets/images/, prefix it
  if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http')) {
    cleanPath = `/assets/images/${cleanPath}`;
  }

  // Determine webp counterpart if it's a local assets/images path
  const webpUrl = cleanPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  return { jpgUrl: cleanPath, webpUrl };
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  aspectRatio = 'aspect-[4/3]',
  fallbackTitle,
  categoryName,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { jpgUrl, webpUrl } = normalizeImagePath(src);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-[#F4EFE6] select-none ${aspectRatio} ${className}`}
    >
      {/* 1. Subtle Shimmer / Placeholder Skeleton (Prevents Layout Shifts & Glitches) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-[#F4EFE6] via-[#EADBCE]/50 to-[#F4EFE6] animate-pulse">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <img
              src="/tgg_logo.png"
              alt=""
              className="w-10 h-auto object-contain opacity-50 grayscale"
              aria-hidden="true"
            />
            <span className="text-[10px] uppercase tracking-widest text-[#14382C] font-semibold">
              The Gift Gallery
            </span>
          </div>
        </div>
      )}

      {/* 2. Error Fallback: Elegant branded placeholder if image fails to load */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#FBF9F5] to-[#F4EFE6] border border-[#EADBCE]">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-[#C59B27]/40 flex items-center justify-center mb-3">
            <img
              src="/tgg_logo.png"
              alt="TGG Hallmark"
              className="w-9 h-auto object-contain"
            />
          </div>
          {categoryName && (
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#C59B27] mb-1">
              {categoryName}
            </span>
          )}
          <span className="text-xs font-serif font-bold text-[#14382C] line-clamp-1 max-w-[200px]">
            {fallbackTitle || alt || 'The Gift Gallery Exclusive'}
          </span>
          <span className="text-[10px] text-slate-500 font-light mt-1">
            Curated on WhatsApp
          </span>
        </div>
      ) : (
        /* 3. Modern High-Performance <picture> with WebP + JPG fallback */
        <picture>
          <source srcSet={webpUrl} type="image/webp" />
          <source srcSet={jpgUrl} type="image/jpeg" />
          <img
            src={jpgUrl}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              // Try fallback or set error state
              setHasError(true);
            }}
            className={`w-full h-full object-cover object-center transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            } ${imgClassName}`}
          />
        </picture>
      )}
    </div>
  );
};
