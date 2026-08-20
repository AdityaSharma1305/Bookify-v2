import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Scale, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead title="Terms of Service" description="Bookify terms and conditions for readers and marketplace sellers." />
      
      <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-2 border-b border-gray-100 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 text-accent border border-amber-200 rounded-full text-xs font-bold">
            <Scale size={14} />
            <span>Platform Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Terms of Service</h1>
          <p className="text-xs text-gray-400">Effective: August 20, 2026</p>
        </div>

        <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <BookOpen size={16} className="text-accent" /> 1. Peer-to-Peer Marketplace Integrity
          </h2>
          <p>
            Bookify allows readers to list and purchase second-hand, pre-loved books. Sellers must provide accurate condition descriptions (e.g. <em>Like New</em>, <em>Very Good</em>, <em>Good</em>). False representation of book quality may result in immediate suspension.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <CheckCircle size={16} className="text-accent" /> 2. Community Conduct &amp; Reviews
          </h2>
          <p>
            Reviews and discussions must remain respectful and relevant to literary content. Defamatory, abusive, or spam comments are strictly prohibited and automatically moderated by administrators.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <Scale size={16} className="text-accent" /> 3. Governing Law
          </h2>
          <p>
            This service is operated as an independent platform engineered by Aditya Sharma. By accessing Bookify, you agree to these fair usage terms.
          </p>
        </section>
      </div>
    </div>
  );
};
