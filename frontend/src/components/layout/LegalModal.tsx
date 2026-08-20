import React, { useState } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'PRIVACY' | 'TERMS' | 'ESCROW' | 'REFUND';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'PRIVACY',
}) => {
  const [activeTab, setActiveTab] = useState<'PRIVACY' | 'TERMS' | 'ESCROW' | 'REFUND'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary">Bookify Trust &amp; Legal Center</h3>
              <p className="text-xs text-gray-500">Official policies, data protection, and user safety guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100/80 p-1.5 rounded-2xl my-4 shrink-0 overflow-x-auto">
          {[
            { id: 'PRIVACY', label: '🔒 Privacy Policy' },
            { id: 'TERMS', label: '📜 Terms of Service' },
            { id: 'ESCROW', label: '🛡️ Escrow Guarantee' },
            { id: 'REFUND', label: '🔄 Refund & Returns' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-xs ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policy Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-gray-600 leading-relaxed">
          {activeTab === 'PRIVACY' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-primary">1. Data Protection &amp; Confidentiality</h4>
              <p>
                Bookify is committed to protecting the privacy and confidentiality of your personal reading history, payment details, and contact information. We strictly comply with applicable Information Technology Rules and standard data privacy frameworks.
              </p>
              <h4 className="font-bold text-sm text-primary">2. Information We Collect</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account details (Name, verified Email Address, Profile avatar).</li>
                <li>Reading progress, book ratings, shelf collections, and reviews.</li>
                <li>Delivery shipping address solely used for pre-owned book order dispatch.</li>
                <li>Session tokens encrypted using military-grade AES-256 and stateless JWT.</li>
              </ul>
              <h4 className="font-bold text-sm text-primary">3. Zero Third-Party Data Selling</h4>
              <p>
                We <strong>never sell, rent, or lease</strong> your private information or reading habits to advertisers or data brokers. All financial transactions are processed directly via secure payment gateways.
              </p>
              <h4 className="font-bold text-sm text-primary">4. Cookies &amp; Local Storage</h4>
              <p>
                We only use essential functional cookies to keep your account session authenticated and remember your dark/light theme preferences.
              </p>
            </div>
          )}

          {activeTab === 'TERMS' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-primary">1. Acceptance of Platform Terms</h4>
              <p>
                By creating a Bookify account or browsing our catalog, you agree to abide by these Terms of Service. Bookify provides an open reading companion platform, community catalog, and peer-to-peer marketplace.
              </p>
              <h4 className="font-bold text-sm text-primary">2. Marketplace Seller Conduct</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sellers must provide accurate condition ratings (Like New, Very Good, Good, Acceptable).</li>
                <li>Only legitimate, original copies of published books are allowed. Pirated or counterfeit editions are strictly banned.</li>
                <li>Sellers must dispatch confirmed book orders within 48 business hours with tracking details.</li>
              </ul>
              <h4 className="font-bold text-sm text-primary">3. Community Reviews &amp; Conduct</h4>
              <p>
                Reader reviews must be authentic and respectful. Hate speech, abusive language, spam, or promotional links will result in immediate review moderation and account suspension.
              </p>
            </div>
          )}

          {activeTab === 'ESCROW' && (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 text-green-900 border border-green-200 rounded-2xl flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                <span className="font-bold">100% Escrow Buyer Protection Guaranteed</span>
              </div>
              <h4 className="font-bold text-sm text-primary">How Escrow Protection Works:</h4>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li><strong>Order Placed:</strong> When you purchase a pre-loved book, your payment is held safely in Bookify's secure escrow vault.</li>
                <li><strong>Seller Dispatches:</strong> The seller packs the book securely and enters valid courier tracking details.</li>
                <li><strong>Package Delivered:</strong> Once the book arrives at your door and you verify the condition, the payout is released to the seller.</li>
                <li><strong>Dispute Resolution:</strong> If the book does not arrive or differs significantly from the listing, you receive a full refund.</li>
              </ol>
            </div>
          )}

          {activeTab === 'REFUND' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-primary">1. 48-Hour Return Window</h4>
              <p>
                If a received book arrives severely damaged, missing pages, or differs significantly from the seller's condition grade, you can initiate a return claim within 48 hours of delivery.
              </p>
              <h4 className="font-bold text-sm text-primary">2. Instant Payout Refunds</h4>
              <p>
                Approved refunds are processed back to your original payment method (UPI, Card, or NetBanking) within 3-5 business days.
              </p>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
