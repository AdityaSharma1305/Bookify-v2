import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { LegalModal } from './LegalModal';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, Heart, Award, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'PRIVACY' | 'TERMS' | 'ESCROW' | 'REFUND'>('PRIVACY');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const openLegal = (tab: 'PRIVACY' | 'TERMS' | 'ESCROW' | 'REFUND') => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <>
      <footer className="bg-[#141423] text-gray-300 border-t border-gray-800 mt-20 relative overflow-hidden">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
          
          {/* Top Newsletter & Guarantee Banner */}
          <div className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="space-y-1.5 text-center lg:text-left max-w-lg">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[11px] font-bold">
                <Sparkles size={13} />
                <span>The Weekly Book Digest</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Join 50,000+ Readers Across India</h3>
              <p className="text-xs text-gray-400">
                Receive handpicked bestseller summaries, literary quotes, author spotlights, and exclusive used book drops.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
              {subscribed ? (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-xs font-bold flex items-center justify-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>Welcome to Bookify Weekly! Check your inbox soon.</span>
                </div>
              ) : (
                <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/10 focus-within:border-amber-400/50 transition-all">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#E85D26] to-[#FFA463] text-white font-bold text-xs rounded-xl hover:opacity-95 transition-opacity flex items-center space-x-1.5 shadow-md shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
            
            {/* Column 1: Brand & Creator About */}
            <div className="lg:col-span-2 space-y-4">
              <Logo size="md" variant="light" />
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Bookify is an independent, non-commercial reading platform and community book marketplace created &amp; designed with passion by <strong className="text-white">Aditya Sharma</strong> to help book lovers discover great reads, build daily reading habits, and share pre-loved books.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-semibold text-gray-300">
                  <Lock size={13} className="text-amber-400" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-semibold text-gray-300">
                  <Heart size={13} className="text-red-400" />
                  <span>Created by Aditya Sharma</span>
                </div>
              </div>
            </div>

            {/* Column 2: Discover */}
            <div>
              <h4 className="font-serif font-bold text-sm text-white tracking-wide uppercase mb-4">Discover</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li><Link to="/books" className="hover:text-amber-400 transition-colors">Bestseller Catalog</Link></li>
                <li><Link to="/books?sort=averageRating,desc" className="hover:text-amber-400 transition-colors">Top Rated Titles</Link></li>
                <li><Link to="/books?genre=fiction" className="hover:text-amber-400 transition-colors">Fiction &amp; Literature</Link></li>
                <li><Link to="/books?genre=self-help" className="hover:text-amber-400 transition-colors">Self-Help &amp; Habits</Link></li>
                <li><Link to="/books?genre=technology" className="hover:text-amber-400 transition-colors">Science &amp; Tech</Link></li>
              </ul>
            </div>

            {/* Column 3: Marketplace & Library */}
            <div>
              <h4 className="font-serif font-bold text-sm text-white tracking-wide uppercase mb-4">Marketplace</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li><Link to="/marketplace" className="hover:text-amber-400 transition-colors">Pre-Loved Books</Link></li>
                <li><Link to="/library" className="hover:text-amber-400 transition-colors">My Reading Shelf</Link></li>
                <li><Link to="/dashboard" className="hover:text-amber-400 transition-colors">Reading Statistics</Link></li>
                <li><Link to="/orders" className="hover:text-amber-400 transition-colors">Track Orders</Link></li>
                <li><button onClick={() => openLegal('ESCROW')} className="hover:text-amber-400 transition-colors text-left">Escrow Buyer Protection</button></li>
              </ul>
            </div>

            {/* Column 4: Legal & Policies */}
            <div>
              <h4 className="font-serif font-bold text-sm text-white tracking-wide uppercase mb-4">Trust &amp; Legal</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <button onClick={() => openLegal('PRIVACY')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span>Privacy Policy</span>
                    <span className="px-1.5 py-0.2 bg-green-500/20 text-green-400 text-[9px] rounded font-bold">Secure</span>
                  </button>
                </li>
                <li><button onClick={() => openLegal('TERMS')} className="hover:text-amber-400 transition-colors">Terms of Service</button></li>
                <li><button onClick={() => openLegal('ESCROW')} className="hover:text-amber-400 transition-colors">Seller Protection Policy</button></li>
                <li><button onClick={() => openLegal('REFUND')} className="hover:text-amber-400 transition-colors">Refund &amp; Return Policy</button></li>
                <li><span className="text-gray-400 cursor-default">Creator: Aditya Sharma</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Verified Payments */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Bookify — A personal passion product designed &amp; developed with ❤️ by <strong>Aditya Sharma</strong>.
            </p>

            {/* Payment Icons */}
            <div className="flex items-center space-x-3 text-[11px] text-gray-400">
              <span className="font-semibold text-gray-400">Verified Secure Payments:</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-bold">UPI</span>
                <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-bold">RuPay</span>
                <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-bold">Visa</span>
                <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-bold">MasterCard</span>
                <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-bold">NetBanking</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Legal & Privacy Modal */}
      <LegalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
      />
    </>
  );
};
