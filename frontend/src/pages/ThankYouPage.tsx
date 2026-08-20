import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { CheckCircle2, Sparkles, BookOpen, ShoppingBag, ArrowRight, Home } from 'lucide-react';

export const ThankYouPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <SEOHead title="Order Confirmed — Thank You!" description="Your Bookify order has been successfully placed." />
      
      <div className="max-w-lg w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
          <CheckCircle2 size={40} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed • Escrow Protected
          </span>
          <h1 className="font-serif text-3xl font-bold text-primary">Thank You for Your Order!</h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Your literary transaction is secured. The seller has been notified and is preparing your pre-loved book for dispatch with care.
          </p>
        </div>

        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-left space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles size={14} className="text-accent" />
            <span>What happens next?</span>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-gray-600">
            <li>You can track delivery progress under your <Link to="/orders" className="text-accent underline font-semibold">Orders Dashboard</Link>.</li>
            <li>Funds are safely held until you confirm receiving the book in good condition.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/orders"
            className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 shadow-md"
          >
            <ShoppingBag size={15} />
            <span>View My Orders</span>
          </Link>
          <Link
            to="/books"
            className="px-6 py-3 bg-white text-[#C59B27] border-2 border-[#C59B27] text-xs font-bold rounded-xl hover:bg-[#C59B27] hover:text-white transition-all flex items-center justify-center space-x-2"
          >
            <BookOpen size={15} />
            <span>Discover More Books</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
