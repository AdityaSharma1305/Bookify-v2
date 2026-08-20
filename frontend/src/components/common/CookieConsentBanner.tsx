import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bookify_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bookify_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('bookify_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
      <div className="bg-[#1C1A17]/95 text-[#EFE7DA] border border-amber-900/60 p-5 rounded-3xl shadow-2xl backdrop-blur-md space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-[#C59B27] rounded-xl border border-amber-500/30">
              <Cookie size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">We Value Your Privacy</h4>
              <p className="text-[10px] text-stone-400">Strictly essential &amp; telemetry cookies</p>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="text-stone-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss cookie banner"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          Bookify uses cookies solely to keep you securely signed in and preserve your reading bookmarks. Read our{' '}
          <Link to="/privacy" className="text-[#C59B27] underline hover:text-amber-300">Privacy Policy</Link>.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 bg-gradient-to-r from-[#C59B27] to-[#A6811E] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center space-x-1.5"
          >
            <ShieldCheck size={14} />
            <span>Accept All</span>
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-stone-800 text-stone-400 hover:text-white text-xs font-semibold rounded-xl border border-stone-700 hover:bg-stone-700 transition"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
};
