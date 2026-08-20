import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Compass, Bookmark, ShoppingBag, ArrowUp, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141210] text-[#D5C9B5] border-t border-stone-800/80 mt-20 relative overflow-hidden">
      {/* Subtle Warm Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        {/* Top Newsletter & Digest Glass Box */}
        <div className="bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/10 rounded-[32px] p-6 sm:p-10 mb-14 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#C59B27]/15 text-[#C59B27] border border-[#C59B27]/30 rounded-full text-xs font-bold">
              <Sparkles size={14} />
              <span>The Bibliophile Dispatch</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">Curated Weekly Literary Stacks</h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Receive handpicked bestseller recommendations, author retrospectives, and exclusive pre-loved marketplace drops delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-center space-x-2 animate-fade-in shadow-lg">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>You're subscribed to Bookify Dispatch! Check your inbox soon.</span>
              </div>
            ) : (
              <div className="flex bg-stone-900/90 p-1.5 rounded-2xl border border-stone-700 focus-within:border-[#C59B27] shadow-inner transition-all">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#C59B27] to-[#A6811E] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center space-x-2 shadow-md shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Main 3-Column Modern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Creator Story (6 cols on md) */}
          <div className="md:col-span-6 space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              Bookify is a modern, non-corporate literary ecosystem and peer-to-peer book marketplace created with passion by <strong className="text-stone-200">Aditya Sharma</strong>. Designed for readers who cherish the tactile elegance of curated hardcovers and the joy of community reading habits.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs font-semibold text-stone-300">
                <Heart size={13} className="text-rose-400" />
                <span>Crafted by Aditya Sharma</span>
              </span>
              <a
                href="https://github.com/AdityaSharma1305/Bookify-v2"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-300 hover:text-white transition-colors"
              >
                <Github size={13} />
                <span>Open Source on GitHub</span>
              </a>
            </div>
          </div>

          {/* Col 2: Discover & Stacks (3 cols on md) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wider uppercase flex items-center space-x-2">
              <Compass size={16} className="text-[#C59B27]" />
              <span>Explore Catalog</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/books" className="hover:text-[#C59B27] transition-colors">Bestseller Curations</Link></li>
              <li><Link to="/books?sort=averageRating,desc" className="hover:text-[#C59B27] transition-colors">Highest Rated Classics</Link></li>
              <li><Link to="/books?genre=fiction" className="hover:text-[#C59B27] transition-colors">Fiction &amp; Literature</Link></li>
              <li><Link to="/books?genre=self-help" className="hover:text-[#C59B27] transition-colors">Personal Growth &amp; Habits</Link></li>
              <li><Link to="/books?genre=business-finance" className="hover:text-[#C59B27] transition-colors">Business &amp; Finance</Link></li>
              <li><Link to="/books?genre=technology" className="hover:text-[#C59B27] transition-colors">Technology &amp; Computer Science</Link></li>
            </ul>
          </div>

          {/* Col 3: Community & Library (3 cols on md) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wider uppercase flex items-center space-x-2">
              <Bookmark size={16} className="text-[#C59B27]" />
              <span>Reader Hub</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/marketplace" className="hover:text-[#C59B27] transition-colors">Pre-Loved Book Marketplace</Link></li>
              <li><Link to="/library" className="hover:text-[#C59B27] transition-colors">Personal Bookshelf</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#C59B27] transition-colors">Reading Telemetry &amp; Goals</Link></li>
              <li><Link to="/orders" className="hover:text-[#C59B27] transition-colors">Escrow Order Tracking</Link></li>
              <li><Link to="/profile" className="hover:text-[#C59B27] transition-colors">Reader Profile &amp; Bio</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Clean Copyright, Creator & Policy Links (No Email Exposed) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-stone-300 font-medium">
              &copy; {new Date().getFullYear()} Bookify &bull; Independent Literary Platform
            </p>
            <p className="text-[11px] text-stone-500">
              Curated and maintained with passion &bull; New Delhi, India
            </p>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-4 text-xs text-stone-400">
            <Link to="/privacy" className="hover:text-[#C59B27] transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-[#C59B27] transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl border border-stone-800 transition shadow-sm text-xs font-semibold"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
