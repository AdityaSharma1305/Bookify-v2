import React from 'react';
import { ListingItem } from '../../types';
import { ShoppingCart, ShieldCheck, Tag } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface ListingCardProps {
  listing: ListingItem;
  onBuy: (listing: ListingItem) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onBuy }) => {
  const getBadgeColor = (condition: string) => {
    switch (condition) {
      case 'LIKE_NEW': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'VERY_GOOD': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'GOOD': return 'bg-amber-50 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#EDE5D8] hover:border-[#C59B27]/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-5 group">
      <div className="space-y-3">
        <div className="flex gap-3.5">
          <div className="w-18 aspect-[2/3] bg-[#FAF6F0] rounded-2xl overflow-hidden shadow-md shrink-0 border border-[#EDE5D8]">
            {listing.book?.coverImage ? (
              <img src={listing.book.coverImage} alt={listing.book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Cover</div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border ${getBadgeColor(listing.conditionGrade)}`}>
              {listing.conditionGrade.replace('_', ' ')}
            </span>
            <h4 className="font-serif font-bold text-sm text-primary line-clamp-2 group-hover:text-[#C59B27] transition-colors leading-snug">
              {listing.book?.title}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-1">by <span className="text-gray-700 font-semibold">{listing.book?.author?.name}</span></p>
            <p className="text-[11px] text-gray-400">Seller: <span className="font-semibold text-gray-700">{listing.seller?.name}</span></p>
          </div>
        </div>

        {listing.conditionDescription && (
          <p className="text-xs text-gray-600 italic bg-[#FAF6F0]/80 p-3 rounded-2xl border border-[#EDE5D8]/60 line-clamp-2">
            "{listing.conditionDescription}"
          </p>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#EDE5D8] flex items-center justify-between">
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-serif font-bold text-base text-primary">{formatPrice(listing.listingPrice)}</span>
            {listing.originalPrice && listing.originalPrice > listing.listingPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(listing.originalPrice)}</span>
            )}
          </div>
          {listing.discountPercentage ? (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {listing.discountPercentage}% OFF
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">Verified Seller</span>
          )}
        </div>

        <button
          onClick={() => onBuy(listing)}
          className="px-4 py-2 bg-[#C59B27] hover:bg-[#A6811E] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm hover:shadow-md transition-all"
        >
          <ShoppingCart size={13} />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
