import React from 'react';
import { Link } from 'react-router-dom';
import { BookSummary } from '../../types';
import { RatingStars } from './RatingStars';
import { Heart, BookOpen } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface BookCardProps {
  book: BookSummary;
  isFavorite?: boolean;
  onToggleFavorite?: (bookId: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isFavorite = false,
  onToggleFavorite,
}) => {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#EDE5D8] hover:border-[#C59B27]/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Container */}
      <Link to={`/books/${book.id}`} className="relative block aspect-[2/3] overflow-hidden bg-[#FAF6F0] p-3">
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FAF6F0] to-[#EFE7DA] text-gray-400">
              <BookOpen size={36} className="text-[#C59B27]/40 mb-2" />
              <span className="text-xs text-center font-serif text-gray-600 line-clamp-2">{book.title}</span>
            </div>
          )}

          {/* Hardcover Gloss & Spine Effect */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-white/15 to-transparent pointer-events-none" />
        </div>

        {/* Favorite overlay button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(book.id);
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart size={15} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
        )}

        {/* Status tag */}
        {book.status === 'OUT_OF_STOCK' && (
          <span className="absolute bottom-5 left-5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white rounded-lg shadow-sm">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Book Meta */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-white to-[#FAF6F0]/30">
        <div className="space-y-1.5">
          {/* Genre Pill */}
          {book.categories && book.categories.length > 0 && (
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#A6811E] bg-[#C59B27]/10 border border-[#C59B27]/20 rounded-full">
              {book.categories[0].name}
            </span>
          )}

          {/* Title */}
          <Link to={`/books/${book.id}`} className="block">
            <h3 className="font-serif font-bold text-primary text-base leading-snug line-clamp-2 group-hover:text-[#C59B27] transition-colors">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          {book.author && (
            <p className="text-xs text-gray-500 line-clamp-1">
              by <span className="text-gray-800 font-semibold">{book.author.name}</span>
            </p>
          )}
        </div>

        {/* Rating and Price */}
        <div className="pt-3 border-t border-[#EDE5D8] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <RatingStars rating={book.averageRating || 0} size={12} />
            <span className="text-xs font-bold text-gray-800">
              {book.averageRating > 0 ? book.averageRating.toFixed(1) : '5.0'}
            </span>
            {book.totalReviews > 0 && (
              <span className="text-[10px] text-gray-400">({book.totalReviews})</span>
            )}
          </div>
          <span className="text-xs font-bold text-[#C59B27] px-2.5 py-1 bg-[#C59B27]/10 rounded-xl border border-[#C59B27]/20">
            {formatPrice(book.price)}
          </span>
        </div>
      </div>
    </div>
  );
};
