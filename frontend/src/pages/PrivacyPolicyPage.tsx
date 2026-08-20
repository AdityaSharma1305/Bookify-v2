import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { ShieldCheck, Lock, Eye, CheckCircle, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead title="Privacy Policy" description="Bookify privacy policy and user data security measures." />
      
      <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-2 border-b border-gray-100 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 text-accent border border-amber-200 rounded-full text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Privacy &amp; Security Compliance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last updated: August 20, 2026</p>
        </div>

        <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <Lock size={16} className="text-accent" /> 1. Information We Collect
          </h2>
          <p>
            Bookify collects minimal personal information necessary to deliver our literary tracking and peer-to-peer marketplace services:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
            <li><strong>Account Data:</strong> Full name, email address, password hashes (Argon2 / BCrypt), and reading goals.</li>
            <li><strong>Reading Telemetry:</strong> Books marked as read, favorites, reading progress, and reader reviews.</li>
            <li><strong>Marketplace Transactions:</strong> Shipping addresses and escrow order listings for book exchanges.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <Eye size={16} className="text-accent" /> 2. How We Protect Your Data
          </h2>
          <p>
            Your credentials and authentication tokens are secured with industry-standard cryptographic algorithms (JWT with HMAC-SHA256). Passwords are never stored in plaintext. We implement automated rate limiting, input sanitization, and CORS enforcement to protect against unauthorized access.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <CheckCircle size={16} className="text-accent" /> 3. Data Ownership &amp; Rights
          </h2>
          <p>
            You retain 100% ownership over your literary profile, reviews, and reading data. You can update your reading preferences or request complete account erasure anytime by contacting our team.
          </p>
        </section>

        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs text-amber-900 flex items-center justify-between">
          <span>Questions regarding data privacy? Contact: <strong>2k22.csai.2213448@gmail.com</strong></span>
          <span className="font-semibold text-accent">Aditya Sharma (Platform Owner)</span>
        </div>
      </div>
    </div>
  );
};
