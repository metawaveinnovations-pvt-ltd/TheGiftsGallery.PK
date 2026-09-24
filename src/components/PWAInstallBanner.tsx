import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone, Sparkles, Check } from 'lucide-react';
import { Logo } from './Logo';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('tgg_pwa_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('tgg_pwa_dismissed', 'true');
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  // If not on iOS and not installable yet, don't show banner
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Mobile & Tablet App-Style Prompt */}
      <div className="bg-gradient-to-r from-[#14382C] via-[#1B4B3B] to-[#14382C] text-white border-b border-[#C59B27]/30 px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300 relative z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-[#C59B27]/40 flex items-center justify-center shrink-0 p-1">
              <Logo variant="mark" size={24} />
            </div>
            <div className="truncate">
              <span className="font-semibold text-white block sm:inline">The Gift Gallery App:</span>{' '}
              <span className="text-[#DFC066] font-medium hidden sm:inline">Add to Home Screen for fast gifts ordering &amp; order tracking</span>
              <span className="text-emerald-100/90 text-[11px] sm:hidden block truncate">Install for fastest mobile experience</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isInstallable && (
              <button
                type="button"
                onClick={install}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#b0881f] text-slate-900 font-semibold text-xs transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {isIOS && (
              <button
                type="button"
                onClick={() => setShowIOSModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#b0881f] text-slate-900 font-semibold text-xs transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Add to Home</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1 rounded-md text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Home Screen Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#FBF9F5] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#C59B27]/40 text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#14382C] flex items-center justify-center p-1">
                  <Logo variant="mark" size={28} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#14382C]">Install The Gift Gallery</h3>
                  <span className="text-[11px] text-slate-500">iPhone &amp; iPad Safari</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Install as a lightweight app on your home screen for instant 1-tap access, offline browsing, and smooth full-screen ordering:
            </p>

            <ol className="space-y-3 text-xs text-slate-700 mb-6 bg-white rounded-2xl p-4 border border-[#EADBCE]">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#14382C] text-[#DFC066] font-bold text-[11px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="font-semibold text-slate-900 inline-flex items-center gap-1">Share <Share2 className="w-3.5 h-3.5 inline text-blue-500" /></strong> icon in your Safari toolbar.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#14382C] text-[#DFC066] font-bold text-[11px] flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  Scroll down and select <strong className="font-semibold text-slate-900">Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#14382C] text-[#DFC066] font-bold text-[11px] flex items-center justify-center shrink-0">
                  3
                </span>
                <span>
                  Tap <strong className="font-semibold text-slate-900">Add</strong> at top right. Done!
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#14382C] hover:bg-[#1B4B3B] text-[#DFC066] font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
