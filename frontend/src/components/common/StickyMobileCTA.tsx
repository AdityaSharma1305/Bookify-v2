import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ShoppingBag, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const StickyMobileCTA: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Hide on auth pages or checkout
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');

  useEffect(() => {
    const handleScroll = () => {
      // Show only after user scrolls down 300px on mobile screens
      if (window.scrollY > 300 && window.innerWidth < 768) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || isAuthPage) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 md:hidden z-40 animate-slide-up">
      <div className="bg-[#1C1A17]/95 border border-amber-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-lg flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 pl-1">
          <div className="p-1.5 bg-[#C59B27]/20 text-[#C59B27] rounded-lg">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white leading-tight">Explore 16+ Curated Books</p>
            <p className="text-[9px] text-stone-400">Pre-loved from ₹149</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to="/books"
            className="px-3 py-2 bg-stone-800 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 flex items-center gap-1"
          >
            <BookOpen size={12} />
            <span>Catalog</span>
          </Link>
          <Link
            to={isAuthenticated ? "/marketplace" : "/login"}
            className="px-3.5 py-2 bg-gradient-to-r from-[#C59B27] to-[#A6811E] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1"
          >
            <ShoppingBag size={12} />
            <span>{isAuthenticated ? 'Marketplace' : 'Join Free'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
