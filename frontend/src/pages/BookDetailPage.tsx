import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { BookDetail, ReadingStatus, ListingItem } from '../types';
import { useAuthStore } from '../store/authStore';
import { RatingStars } from '../components/books/RatingStars';
import { BookCard } from '../components/books/BookCard';
import { SellBookModal } from '../components/marketplace/SellBookModal';
import { CheckoutModal } from '../components/marketplace/CheckoutModal';
import { Heart, ArrowLeft, Tag, ShoppingBag, Plus, Sparkles } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [usedListings, setUsedListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | ''>('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadBookData() {
      setLoading(true);
      try {
        const [bookRes, listingsRes] = await Promise.all([
          api.getBookDetails(parseInt(id!, 10)),
          api.getListingsForBook(parseInt(id!, 10)),
        ]);
        setBook(bookRes.data.data);
        setIsFavorite(!!bookRes.data.data.isFavorite);
        setReadingStatus(bookRes.data.data.readingStatus || '');
        setUsedListings(listingsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBookData();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!book || !isAuthenticated) return;
    try {
      const res = await api.toggleFavorite(book.id);
      setIsFavorite(res.data.data.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (status: ReadingStatus) => {
    if (!book || !isAuthenticated) return;
    try {
      await api.updateReadingStatus(book.id, status);
      setReadingStatus(status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !isAuthenticated) return;
    setReviewSubmitting(true);
    try {
      await api.createReview(book.id, {
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        body: reviewBody.trim() || undefined,
      });
      const res = await api.getBookDetails(book.id);
      setBook(res.data.data);
      setReviewTitle('');
      setReviewBody('');
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 mt-4">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-primary">Book not found</h2>
        <Link to="/books" className="text-accent text-sm mt-2 inline-block">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Link to="/books" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Explore</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[280px] aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gray-100">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-50 text-accent font-serif text-center p-4">
                {book.title}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="w-full max-w-[280px] mt-5 space-y-2.5">
              <button
                onClick={handleToggleFavorite}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 border transition-all ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-red-200 hover:text-red-600'
                }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>

              <select
                value={readingStatus}
                onChange={(e) => handleStatusChange(e.target.value as ReadingStatus)}
                className="w-full py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">+ Add to Reading Library</option>
                <option value="WANT_TO_READ">Want to Read</option>
                <option value="CURRENTLY_READING">Currently Reading</option>
                <option value="COMPLETED">Completed</option>
                <option value="ABANDONED">Abandoned</option>
              </select>

              <button
                onClick={() => setSellModalOpen(true)}
                className="w-full py-2.5 px-4 bg-orange-50 text-accent border border-orange-200 rounded-xl text-sm font-semibold hover:bg-orange-100 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Plus size={15} />
                <span>Sell a Copy of this Book</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="w-full max-w-[280px] mt-5 py-2.5 px-4 bg-accent text-white rounded-xl text-sm font-semibold text-center hover:bg-accent-hover transition-colors"
            >
              Log in to track, buy &amp; sell
            </Link>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            {book.categories && book.categories.map((c) => (
              <span key={c.id} className="inline-block px-2.5 py-0.5 text-xs font-semibold text-accent bg-accent-light rounded-full mr-2 mb-2">
                {c.name}
              </span>
            ))}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary leading-tight mt-1">{book.title}</h1>
            {book.subtitle && <p className="text-gray-500 text-base mt-1">{book.subtitle}</p>}
            {book.author && (
              <p className="text-sm text-gray-600 mt-2">
                by <span className="font-semibold text-primary">{book.author.name}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 py-3 border-y border-gray-100">
            <RatingStars rating={book.averageRating || 0} size={20} />
            <span className="font-bold text-lg text-primary">{book.averageRating > 0 ? book.averageRating.toFixed(2) : '0.0'}</span>
            <span className="text-xs text-gray-400">({book.totalReviews || 0} reviews)</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-lg text-primary">MSRP {formatPrice(book.price)}</span>
          </div>

          {/* Used copies banner */}
          {usedListings.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-green-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-green-600" /> {usedListings.length} Pre-Loved Copies Available from Readers!
                </span>
                <span className="text-xs font-bold text-green-700">From {formatPrice(Math.min(...usedListings.map(l => l.listingPrice)))}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {usedListings.map((l) => (
                  <div key={l.id} className="p-3 bg-white rounded-xl border border-green-100 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-800 rounded">
                        {l.conditionGrade.replace('_', ' ')}
                      </span>
                      <p className="text-xs font-bold text-primary mt-1">{formatPrice(l.listingPrice)}</p>
                      <p className="text-[10px] text-gray-400">by {l.seller?.name}</p>
                    </div>
                    <button
                      onClick={() => setSelectedListing(l)}
                      className="px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover flex items-center gap-1"
                    >
                      <ShoppingBag size={12} /> Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-serif font-bold text-lg text-primary mb-2">Overview</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {book.description || 'No description available for this book.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl text-xs text-gray-600">
            <div>
              <p className="text-gray-400 font-semibold">ISBN</p>
              <p className="font-medium text-gray-800 mt-0.5">{book.isbn}</p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold">Language</p>
              <p className="font-medium text-gray-800 mt-0.5">{book.language || 'English'}</p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold">Pages</p>
              <p className="font-medium text-gray-800 mt-0.5">{book.pageCount ? `${book.pageCount} pages` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold">Publisher</p>
              <p className="font-medium text-gray-800 mt-0.5">{book.publisher || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-bold text-primary">Community Reviews</h2>

        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="p-5 bg-orange-50/40 rounded-xl border border-orange-100 space-y-3">
            <h4 className="font-semibold text-sm text-primary">Write a Review</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Your Rating:</span>
              <RatingStars rating={reviewRating} size={18} interactive onRatingChange={setReviewRating} />
            </div>
            <input
              type="text"
              placeholder="Review title (optional)"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <textarea
              placeholder="Write your thoughts on this book..."
              rows={3}
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-5 py-2 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {reviewSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="space-y-4 pt-2">
          {book.recentReviews && book.recentReviews.length > 0 ? (
            book.recentReviews.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-primary">{r.user?.name || 'Reader'}</span>
                    <RatingStars rating={r.rating} size={13} />
                  </div>
                  <span className="text-[11px] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.title && <h5 className="font-semibold text-sm text-gray-800">{r.title}</h5>}
                {r.body && <p className="text-xs text-gray-600 leading-relaxed">{r.body}</p>}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-6">No reviews written yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>

      {/* Modals */}
      {book && (
        <SellBookModal
          preselectedBook={book}
          isOpen={sellModalOpen}
          onClose={() => setSellModalOpen(false)}
          onSuccess={() => {
            api.getListingsForBook(book.id).then((res) => setUsedListings(res.data.data || []));
          }}
        />
      )}

      {selectedListing && (
        <CheckoutModal
          listing={selectedListing}
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          onSuccess={() => {
            if (book) {
              api.getListingsForBook(book.id).then((res) => setUsedListings(res.data.data || []));
            }
          }}
        />
      )}
    </div>
  );
};
