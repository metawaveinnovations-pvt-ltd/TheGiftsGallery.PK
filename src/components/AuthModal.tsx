import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Logo } from './Logo';
import {
  X,
  UserCheck,
  UserPlus,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface AuthModalProps {
  onAdminLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAdminLoginSuccess }) => {
  const {
    authModalOpen,
    authModalReason,
    closeAuthModal,
    loginUser,
    signupUser,
    loginAdmin,
    formOptions,
  } = usePortal();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [emailOrPhone, setEmailOrPhone] = useState('ayesha.khan@example.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  // Signup state
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  if (!authModalOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!emailOrPhone.trim()) {
      setError('Please enter your email address or WhatsApp number.');
      return;
    }
    loginUser(emailOrPhone.trim(), password);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !whatsappNumber.trim() || !email.trim()) {
      setError('Please fill in your full name, WhatsApp number, and email.');
      return;
    }
    signupUser({
      fullName: fullName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      email: email.trim(),
      city,
      defaultAddress: defaultAddress.trim(),
    });
  };

  const handleQuickDemoCustomer = () => {
    loginUser('ayesha.khan@example.com');
  };

  const handleQuickOwnerAccess = () => {
    loginAdmin('owner@startos', 'zoha');
    loginUser('owner@startos');
    if (onAdminLoginSuccess) {
      onAdminLoginSuccess();
    }
  };

  const handleQuickManagerAccess = () => {
    loginAdmin('manager@startos', 'zoha');
    loginUser('manager@startos');
    if (onAdminLoginSuccess) {
      onAdminLoginSuccess();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="bg-[#FBF9F5] rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-t sm:border border-[#C59B27]/40 shadow-2xl relative pb-[max(1rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Close sign in modal"
          className="absolute top-3.5 right-3.5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white border border-[#EADBCE] transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#14382C] text-white px-6 pt-4 sm:pt-7 pb-5 sm:pb-6 text-center border-b border-[#C59B27]/30">
          {/* Mobile Swipe Grab Handle */}
          <div className="w-10 h-1.5 bg-white/30 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="inline-flex p-1.5 rounded-xl bg-white/95 border border-[#C59B27]/50 mb-2.5 sm:mb-3">
            <Logo variant="mark" size={42} />
          </div>
          <h2 id="auth-modal-title" className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
            {tab === 'signin' ? 'Welcome Back to TGG' : 'Create Your Gifting Account'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xs mx-auto leading-relaxed">
            {authModalReason}
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 p-1 bg-[#F4EFE6] rounded-xl border border-[#EADBCE]">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'signin'
                  ? 'bg-[#14382C] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#14382C]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'signup'
                  ? 'bg-[#14382C] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#14382C]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {tab === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email or WhatsApp Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="ayesha.khan@example.com or 0300 4589210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Sign In &amp; Continue</span>
                <ArrowRight className="w-4 h-4 text-[#DFC066]" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                    >
                      {formOptions.cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  placeholder="House, Street, Sector / DHA Phase"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EADBCE] text-sm text-slate-800 focus:outline-none focus:border-[#14382C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#14382C] hover:bg-[#0D261E] text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Create Account &amp; Continue</span>
                <ArrowRight className="w-4 h-4 text-[#DFC066]" />
              </button>
            </form>
          )}

          {/* Instant 1-Tap Demo Sign-In Helper */}
          <div className="mt-5 pt-4 border-t border-[#EADBCE] space-y-2">
            <div className="text-[11px] font-medium text-slate-500 text-center">
              Instant One-Tap Access
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                className="py-2 px-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EADBCE] text-[#14382C] font-semibold text-[10px] border border-[#C59B27]/30 transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
                title="Customer Demo (Ayesha Khan)"
              >
                <Sparkles className="w-3 h-3 text-[#C59B27] shrink-0" />
                <span className="truncate">Customer</span>
              </button>
              <button
                type="button"
                onClick={handleQuickOwnerAccess}
                className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-[10px] border border-amber-300 transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
                title="Owner Login (owner@startos / zoha)"
              >
                <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">Owner</span>
              </button>
              <button
                type="button"
                onClick={handleQuickManagerAccess}
                className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 font-bold text-[10px] border border-blue-300 transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
                title="Manager Login (manager@startos / zoha)"
              >
                <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">Manager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
