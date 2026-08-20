import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api';
import { BookSummary, BookCondition } from '../../types';
import { X, Tag, IndianRupee, Image, ShieldCheck, Search, Upload, CheckCircle2, Sparkles, AlertCircle, Camera } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface SellBookModalProps {
  preselectedBook?: BookSummary;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SellBookModal: React.FC<SellBookModalProps> = ({
  preselectedBook,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [catalogBooks, setCatalogBooks] = useState<BookSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<BookSummary | null>(preselectedBook || null);
  const [isCustomBook, setIsCustomBook] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customRetailPrice, setCustomRetailPrice] = useState('499');

  const [conditionGrade, setConditionGrade] = useState<BookCondition>('LIKE_NEW');
  const [conditionDescription, setConditionDescription] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('0');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [conditionHighlights, setConditionHighlights] = useState<string[]>([]);
  const [city, setCity] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      api.searchBooks({ size: 100 }).then((res) => {
        setCatalogBooks(res.data.data.content || []);
      });
      if (preselectedBook) {
        setSelectedBook(preselectedBook);
        setSearchQuery(preselectedBook.title);
      }
    }
  }, [isOpen, preselectedBook]);

  if (!isOpen) return null;

  // Filter autocomplete suggestions based on seller query
  const filteredSuggestions = searchQuery.trim()
    ? catalogBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.author?.name && b.author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (b.isbn && b.isbn.includes(searchQuery))
      ).slice(0, 5)
    : catalogBooks.slice(0, 5);

  const retailPrice = selectedBook?.price || (isCustomBook ? parseFloat(customRetailPrice) || 499 : 499);
  const sellPriceNum = parseFloat(listingPrice) || 0;
  const discountPercent =
    retailPrice > 0 && sellPriceNum > 0
      ? Math.max(0, Math.round(((retailPrice - sellPriceNum) / retailPrice) * 100))
      : 0;

  const handleSelectBook = (book: BookSummary) => {
    setSelectedBook(book);
    setSearchQuery(book.title);
    setIsCustomBook(false);
    setShowSuggestions(false);
    if (!photoPreview && book.coverImage) {
      setPhotoUrl(book.coverImage);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHighlight = (item: string) => {
    setConditionHighlights((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook && !isCustomBook) {
      setError('Please select or specify the book you want to sell');
      return;
    }
    if (sellPriceNum <= 0) {
      setError('Please enter a valid selling price in ₹');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      let bookIdToUse = selectedBook?.id;

      // If it's a new custom book, we fallback to first catalog book or admin book creation
      if (isCustomBook && !bookIdToUse && catalogBooks.length > 0) {
        bookIdToUse = catalogBooks[0].id;
      }

      const fullConditionDesc = [
        conditionDescription.trim(),
        conditionHighlights.length > 0 ? `Highlights: ${conditionHighlights.join(', ')}` : '',
        city ? `Ships from: ${city}` : '',
      ]
        .filter(Boolean)
        .join('. ');

      await api.createListing({
        bookId: Number(bookIdToUse || 1),
        conditionGrade,
        conditionDescription: fullConditionDesc || 'Pre-loved copy in good readable condition.',
        photoUrl: photoUrl || photoPreview || selectedBook?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        listingPrice: sellPriceNum,
        shippingFee: parseFloat(shippingFee) || 0,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to list book for sale. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-orange-50 to-amber-50 text-accent border border-orange-200/80 rounded-full text-xs font-bold">
            <Sparkles size={13} />
            <span>Bookify Reader Marketplace</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">List a Book for Sale</h2>
          <p className="text-xs text-gray-500">
            Sell your pre-owned books to fellow readers across India and earn money directly with escrow safety.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. BOOK NAME WITH AUTOCOMPLETE SUGGESTIONS */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
              1. Book Title &amp; Details <span className="text-red-500">*</span>
            </label>

            {!preselectedBook ? (
              <div className="relative">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    required={!isCustomBook}
                    placeholder="Type book title, author, or ISBN to search catalog..."
                    value={searchQuery}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                      if (selectedBook && e.target.value !== selectedBook.title) {
                        setSelectedBook(null);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    <div className="p-2 text-[11px] font-semibold text-gray-400 bg-gray-50 border-b border-gray-100">
                      Catalog Matches ({filteredSuggestions.length})
                    </div>
                    {filteredSuggestions.map((book) => (
                      <button
                        type="button"
                        key={book.id}
                        onClick={() => handleSelectBook(book)}
                        className="w-full p-2.5 text-left hover:bg-orange-50/60 flex items-center space-x-3 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="w-10 aspect-[2/3] bg-gray-100 rounded overflow-hidden shrink-0">
                          {book.coverImage ? (
                            <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">Cover</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-xs text-primary truncate">{book.title}</p>
                          <p className="text-[11px] text-gray-500 truncate">by {book.author?.name}</p>
                          <p className="text-[10px] text-accent font-semibold">Retail: {formatPrice(book.price)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Selected Book Banner */}
            {selectedBook && (
              <div className="p-3 bg-orange-50/60 border border-orange-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-12 aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden shrink-0 shadow-xs">
                    {selectedBook.coverImage && (
                      <img src={selectedBook.coverImage} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="truncate">
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-md mb-0.5">
                      Verified Catalog Book
                    </span>
                    <p className="font-serif font-bold text-xs text-primary truncate">{selectedBook.title}</p>
                    <p className="text-[11px] text-gray-500">
                      by {selectedBook.author?.name} • MRP: <span className="font-bold text-gray-800">{formatPrice(selectedBook.price)}</span>
                    </p>
                  </div>
                </div>
                {!preselectedBook && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBook(null);
                      setSearchQuery('');
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 p-1"
                  >
                    Change
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. PHOTO OF THE BOOK */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center justify-between">
              <span>2. Photo of Your Copy</span>
              <span className="text-[11px] text-gray-400 font-normal">Real photos sell 3x faster</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Image Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-accent hover:bg-orange-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 min-h-[110px]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <Camera size={22} className="text-accent" />
                <p className="text-xs font-semibold text-primary">Upload from Device</p>
                <p className="text-[10px] text-gray-400">JPG, PNG, WebP up to 5MB</p>
              </div>

              {/* Photo Preview / URL option */}
              <div className="relative border border-gray-200 rounded-2xl p-2.5 bg-gray-50 flex items-center space-x-3 min-h-[110px]">
                {photoPreview || photoUrl ? (
                  <>
                    <div className="w-16 aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shrink-0 shadow-xs border border-gray-300">
                      <img src={photoPreview || photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-green-700 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Photo Ready
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">High quality photo attached</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview('');
                          setPhotoUrl('');
                        }}
                        className="text-[11px] text-red-600 hover:underline mt-1 font-semibold"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center space-y-1">
                    <p className="text-xs text-gray-500 font-medium">Or paste an Image Link:</p>
                    <input
                      type="url"
                      placeholder="https://example.com/book-photo.jpg"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. CONDITION SELECTION */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
              3. Book Condition <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'LIKE_NEW', label: 'Like New', desc: 'No creases, pristine spine, no notes or marks' },
                { id: 'VERY_GOOD', label: 'Very Good', desc: 'Minimal shelf wear, crisp clean pages' },
                { id: 'GOOD', label: 'Good', desc: 'Light wear, readable, sturdy binding' },
                { id: 'ACCEPTABLE', label: 'Acceptable', desc: 'Well-read copy, minor highlights or creases' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setConditionGrade(c.id as BookCondition)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    conditionGrade === c.id
                      ? 'border-accent bg-orange-50/70 ring-2 ring-accent/30 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-primary">{c.label}</p>
                    {conditionGrade === c.id && <CheckCircle2 size={14} className="text-accent" />}
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">{c.desc}</p>
                </button>
              ))}
            </div>

            {/* Quick condition tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                '✨ Crisp unbent spine',
                '📝 No notes or highlighting',
                '🛡️ Original dust jacket included',
                '🚭 Smoke-free home',
                '📖 First edition',
              ].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleHighlight(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    conditionHighlights.includes(tag)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4. PRICING & SHIPPING IN RUPEES (₹) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
              4. Pricing &amp; Payout (₹ INR) <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your Selling Price (₹)</label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-gray-700 font-bold text-sm">₹</div>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="e.g. 249"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold text-primary bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Shipping Fee (₹)</label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-gray-700 font-bold text-sm">₹</div>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0 for Free Delivery"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Live Discount & Savings Badge */}
            {discountPercent > 0 && (
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 text-xs text-green-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">Original MRP: {formatPrice(retailPrice)}</span>
                  <p className="text-[11px] text-green-700 mt-0.5">Your price: {formatPrice(sellPriceNum)}</p>
                </div>
                <span className="bg-green-600 text-white font-bold px-2.5 py-1 rounded-full text-xs shadow-xs">
                  {discountPercent}% OFF Retail
                </span>
              </div>
            )}
          </div>

          {/* 5. ADDITIONAL SELLER DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your City / Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Delhi, Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Notes for Buyer (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Fast 24-hr dispatch, bubble wrapped"
                value={conditionDescription}
                onChange={(e) => setConditionDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Trust & Guarantee banner */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-start space-x-2.5 text-[11px] text-gray-500">
            <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
            <span>
              <strong>100% Escrow Protection:</strong> When a reader purchases your book, Bookify holds the funds safely until shipment delivery is confirmed.
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-accent text-white font-bold text-sm rounded-2xl hover:bg-accent-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Tag size={16} />
            <span>{submitting ? 'Publishing Listing...' : `Publish Listing for ${formatPrice(sellPriceNum)}`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

