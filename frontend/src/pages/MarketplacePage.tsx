import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { ListingItem, BookCondition } from '../types';
import { useAuthStore } from '../store/authStore';
import { ListingCard } from '../components/marketplace/ListingCard';
import { MarketplaceCardSkeleton } from '../components/common/Skeleton';
import { SellBookModal } from '../components/marketplace/SellBookModal';
import { CheckoutModal } from '../components/marketplace/CheckoutModal';
import { Tag, Plus, Search, Filter, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketplacePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);

  useEffect(() => {
    loadListings();
  }, [conditionFilter]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const res = await api.getMarketplaceListings({
        q: searchQuery.trim() || undefined,
        condition: conditionFilter || undefined,
        size: 30,
      });
      setListings(res.data.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadListings();
  };

  const handleBuyClick = (listing: ListingItem) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedListing(listing);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] p-8 rounded-3xl border border-[#EDE5D8] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-[#C59B27] rounded-full text-xs font-bold">
            <Sparkles size={13} />
            <span>Reader-to-Reader Marketplace</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
            Buy &amp; Sell Pre-Loved Books
          </h1>
          <p className="text-xs text-gray-600">
            Get great titles at up to 70% off retail prices with 100% escrow buyer protection, or declutter your bookshelf and earn instant payouts.
          </p>
        </div>

        <button
          onClick={() => (isAuthenticated ? setSellModalOpen(true) : navigate('/login'))}
          className="px-6 py-3.5 bg-[#C59B27] hover:bg-[#A6811E] text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus size={18} />
          <span>+ Sell a Book</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search used books for sale..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#EDE5D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C59B27]/40 focus:border-[#C59B27] shadow-xs"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={15} />
        </form>

        {/* Condition Filter Badges */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: '', label: 'All Conditions' },
            { id: 'LIKE_NEW', label: 'Like New' },
            { id: 'VERY_GOOD', label: 'Very Good' },
            { id: 'GOOD', label: 'Good' },
            { id: 'ACCEPTABLE', label: 'Acceptable' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setConditionFilter(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                conditionFilter === c.id
                  ? 'bg-[#C59B27] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-[#EDE5D8] hover:bg-[#FAF6F0]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <MarketplaceCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} onBuy={handleBuyClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 space-y-3">
          <Tag className="mx-auto text-accent" size={32} />
          <h3 className="font-serif font-bold text-lg text-primary">No copies currently listed</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Be the first reader to list a book for sale and make it available to the community!
          </p>
          <button
            onClick={() => (isAuthenticated ? setSellModalOpen(true) : navigate('/login'))}
            className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent-hover"
          >
            List a Book Now
          </button>
        </div>
      )}

      {/* Modals */}
      <SellBookModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onSuccess={loadListings}
      />

      {selectedListing && (
        <CheckoutModal
          listing={selectedListing}
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          onSuccess={loadListings}
        />
      )}
    </div>
  );
};
