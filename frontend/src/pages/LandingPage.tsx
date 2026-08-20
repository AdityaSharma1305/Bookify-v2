import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { BookSummary, Category, ListingItem } from '../types';
import { Search, Play, Pause, RotateCcw, RotateCw, Star, ArrowRight, Sparkles, Tag, ShieldCheck, ShoppingCart, Volume2, Headphones } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { CheckoutModal } from '../components/marketplace/CheckoutModal';
import { HeroStageSkeleton, BookGridSkeleton, MarketplaceCardSkeleton } from '../components/common/Skeleton';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketplaceListings, setMarketplaceListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(38);
  const [checkoutListing, setCheckoutListing] = useState<ListingItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookRes, catRes, listRes] = await Promise.all([
          api.searchBooks({ size: 50 }),
          api.getCategories(),
          api.getMarketplaceListings({ size: 6 }),
        ]);
        setBooks(bookRes.data.data.content || []);
        setCategories(catRes.data.data || []);
        setMarketplaceListings(listRes.data.data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/books?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  // Featured hero book
  const featuredHeroBook = books[0] || {
    id: 1,
    title: 'The Last Thing He Told Me',
    author: { name: 'Laura Dave' },
    price: 499,
    averageRating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
  };

  // Lower shelf books (Recent Bestsellers)
  const recentBestsellers = books.slice(1, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <HeroStageSkeleton />
          <div className="space-y-4">
            <div className="h-8 bg-[#DFD5C4] rounded-2xl w-64 animate-pulse" />
            <BookGridSkeleton count={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB] text-[#1C1917] py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      
      {/* Outer Aesthetic Container matching Outcrowd Bento SaaS Layout */}
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. HERO BENTO SHOWCASE (Inspired by Outcrowd SaaS Design)                 */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] rounded-[40px] sm:rounded-[48px] p-6 sm:p-10 lg:p-14 border border-[#EADBCA] shadow-2xl relative overflow-hidden">
          
          {/* Vibrant Outcrowd Glow Spheres */}
          <div className="absolute -top-28 -left-28 w-[450px] h-[450px] bg-gradient-to-tr from-amber-400/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute -bottom-28 -right-28 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/15 via-rose-500/15 to-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          {/* TOP HERO ROW: New & Trending + 3D Hardcover Book + Interactive Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10 pb-8 sm:pb-12">
            
            {/* Left Column: SaaS Heading, Floating Metric Pill & Search Pill */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Outcrowd Live Pill */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 rounded-full text-xs font-bold text-amber-900 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Next-Gen Literary Intelligence</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#1C1917] tracking-tight leading-[1.05]">
                  Where Great <br />
                  <span className="bg-gradient-to-r from-[#C59B27] via-[#E85D26] to-[#A638DE] bg-clip-text text-transparent">
                    Stories Live.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#7C6F5E] font-medium leading-relaxed">
                  Explore curated bestseller stacks, AI reading analytics, and a verified peer-to-peer used book marketplace.
                </p>
              </div>

              {/* High-Converting Search Pill */}
              <form onSubmit={handleHeroSubmit} className="pt-1 max-w-md">
                <div className="relative flex items-center bg-white rounded-2xl border-2 border-[#E5DCD0] shadow-md hover:border-[#C59B27] focus-within:border-[#C59B27] focus-within:ring-4 focus-within:ring-[#C59B27]/20 transition-all p-2">
                  <Search size={20} className="text-[#9C8E7B] ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-2 text-xs sm:text-sm text-[#1C1917] placeholder-[#9C8E7B] focus:outline-none font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1C1917] hover:bg-[#C59B27] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Stat Highlights */}
              <div className="flex items-center gap-4 pt-1 text-xs text-[#7C6F5E]">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="font-bold text-[#1C1917]">16+ Curated Titles</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-stone-300" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span className="font-bold text-[#1C1917]">Escrow Protected</span>
                </div>
              </div>
            </div>

            {/* Center Column: 3D Upright Hardcover Featured Book on Shelf */}
            <div className="lg:col-span-4 flex justify-center items-end">
              <Link
                to={`/books/${featuredHeroBook.id}`}
                className="group relative block transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* 3D Book Hardcover Shell with Realistic Spine, Book Edge and Drop Shadow */}
                <div className="relative w-52 sm:w-60 aspect-[2/3] rounded-r-2xl rounded-l-sm bg-gray-900 shadow-[20px_25px_35px_rgba(0,0,0,0.3),-4px_0_12px_rgba(0,0,0,0.2)] border-r-2 border-t border-b border-black/20 overflow-hidden transform perspective-1000 rotate-y-[-4deg]">
                  
                  {/* Left Spine crease */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-20 pointer-events-none" />
                  <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/20 z-20 pointer-events-none" />

                  {/* Top Bestseller Badge */}
                  <div className="absolute top-3 left-4 right-4 z-20 text-center">
                    <span className="inline-block px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] sm:text-[9px] font-bold text-amber-300 uppercase tracking-widest rounded-full border border-amber-300/30">
                      #1 NYT Bestseller
                    </span>
                  </div>

                  {/* Book Cover Image */}
                  <img
                    src={featuredHeroBook.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'}
                    alt={featuredHeroBook.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Bottom Author & Title Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 z-20 text-white">
                    <p className="font-serif font-bold text-sm sm:text-base leading-tight truncate">{featuredHeroBook.title}</p>
                    <p className="text-[11px] text-gray-300 truncate">by {featuredHeroBook.author?.name}</p>
                    <p className="text-xs font-bold text-amber-300 mt-1">{formatPrice(featuredHeroBook.price || 499)}</p>
                  </div>
                </div>

                {/* 3D Page Thickness Edge (Right Side) */}
                <div className="absolute right-[-6px] top-1 bottom-1 w-[6px] bg-[#EDE5D8] rounded-r-xs shadow-inner pointer-events-none border-l border-gray-300" />
              </Link>
            </div>

            {/* Right Column: Author of the Week + Last Listened Audiobook Player */}
            <div className="lg:col-span-4 flex items-end justify-center lg:justify-end gap-3 sm:gap-4">
              
              {/* Author of the Week with Rotated Label */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-[#8C7E6A] uppercase tracking-wider -rotate-90 origin-center select-none whitespace-nowrap -ml-4">
                  Author of the Week
                </span>
                
                {/* Author Card (Warm Mustard Background from mockup) */}
                <div className="w-28 sm:w-32 bg-[#D4A359] rounded-3xl p-3 sm:p-3.5 text-center shadow-lg border border-[#C29248] text-white space-y-1.5 transform hover:-translate-y-1 transition-all">
                  <p className="font-serif font-bold text-xs sm:text-sm text-white leading-tight">Stephen King</p>
                  <p className="text-[9px] text-[#F9E8CA] font-semibold uppercase tracking-wider">Collection</p>
                  <p className="text-[10px] text-[#2C2418] font-bold bg-[#E8BA73] rounded-full py-0.5 px-2 inline-block">78 books</p>
                  <div className="pt-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="Stephen King"
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white/80 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Last Listened Audiobook Player with Rotated Label */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-[#8C7E6A] uppercase tracking-wider -rotate-90 origin-center select-none whitespace-nowrap -ml-4">
                  Last listened
                </span>

                {/* Audiobook Player Card (White Card with Vinyl CD Artwork from mockup) */}
                <div className="w-32 sm:w-36 bg-white rounded-3xl p-3 sm:p-3.5 shadow-xl border border-[#E5DCD0] space-y-2 text-center transform hover:-translate-y-1 transition-all">
                  <p className="font-serif font-bold text-[11px] text-[#1C1917] leading-tight line-clamp-1">
                    False Witness
                  </p>
                  <p className="text-[9px] text-[#8C7E6A] line-clamp-1">Karin Slaughter</p>

                  {/* Interactive Vinyl Album Art */}
                  <div className="relative w-14 h-14 mx-auto my-1">
                    <div className={`w-full h-full rounded-full bg-[#1C1917] border-2 border-[#D4A359] flex items-center justify-center shadow-md overflow-hidden ${
                      isPlayingAudio ? 'animate-spin' : ''
                    }`} style={{ animationDuration: '4s' }}>
                      <div className="w-5 h-5 rounded-full bg-white border border-gray-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#1C1917]" />
                      </div>
                    </div>
                  </div>

                  {/* Audio scrubber bar */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioProgress}
                      onChange={(e) => setAudioProgress(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C59B27]"
                    />
                  </div>

                  {/* Player Controls (Skip 15s, Play/Pause) */}
                  <div className="flex items-center justify-center space-x-2 pt-0.5 text-[#5C5040]">
                    <button
                      onClick={() => setAudioProgress((p) => Math.max(0, p - 15))}
                      className="p-1 hover:text-[#1C1917] transition-colors"
                      title="Rewind 15s"
                    >
                      <RotateCcw size={12} />
                    </button>
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-7 h-7 bg-[#1C1917] text-white rounded-full flex items-center justify-center shadow-xs hover:bg-[#C59B27] transition-colors"
                      title={isPlayingAudio ? 'Pause' : 'Play Preview'}
                    >
                      {isPlayingAudio ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                    </button>
                    <button
                      onClick={() => setAudioProgress((p) => Math.min(100, p + 15))}
                      className="p-1 hover:text-[#1C1917] transition-colors"
                      title="Forward 15s"
                    >
                      <RotateCw size={12} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. THE PHYSICAL 3D BOOKSHELF LEDGE (From reference mockup)                 */}
          {/* ========================================================================= */}
          <div className="relative -mx-6 sm:-mx-10 lg:-mx-14 my-4">
            {/* Top Shelf Surface */}
            <div className="h-4 sm:h-5 bg-gradient-to-b from-[#F2ECE1] to-[#E3D9C9] border-t border-[#DFD4C2] shadow-xs" />
            {/* Front Shelf Bevel */}
            <div className="h-3 sm:h-4 bg-[#D6CBB7] border-b border-[#B8AA94]" />
            {/* Deep Cast Shadow under shelf */}
            <div className="h-6 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />
          </div>

          {/* ========================================================================= */}
          {/* 3. RECENT BESTSELLERS (Lower Shelf from reference mockup)                  */}
          {/* ========================================================================= */}
          <div className="pt-4 flex items-center">
            
            {/* Rotated "Recent Bestsellers" label */}
            <div className="shrink-0 mr-4 sm:mr-6">
              <span className="text-[11px] font-bold text-[#8C7E6A] uppercase tracking-wider -rotate-90 origin-center block select-none whitespace-nowrap">
                Recent Bestsellers
              </span>
            </div>

            {/* Horizontal Stand of Bestsellers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1">
              {recentBestsellers.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 bg-white/60 hover:bg-white p-3 rounded-2xl border border-[#E8DFC7] shadow-xs hover:shadow-md transition-all group"
                >
                  {/* Book Cover with 3D shadow */}
                  <Link
                    to={`/books/${book.id}`}
                    className="w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                  >
                    <img
                      src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details + Star Rating + Golden "Buy Now" Button */}
                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
                    {/* Stars */}
                    <div className="flex items-center justify-center sm:justify-start space-x-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          className={s <= Math.round(book.averageRating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>

                    <Link to={`/books/${book.id}`} className="block">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] truncate group-hover:text-[#C59B27] transition-colors">
                        {book.title}
                      </h4>
                    </Link>
                    <p className="text-[11px] text-[#7C6F5E] truncate">by {book.author?.name}</p>

                    {/* Golden / Ochre Rounded Outlined "Buy Now" button */}
                    <div className="pt-1">
                      <Link
                        to={`/books/${book.id}`}
                        className="inline-block px-4 py-1.5 rounded-full border-2 border-[#C59B27] text-[#C59B27] hover:bg-[#C59B27] hover:text-white font-bold text-[11px] transition-all shadow-xs"
                      >
                        Buy Now • {formatPrice(book.price || 399)}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. PRE-LOVED P2P MARKETPLACE CAROUSEL (In Rupee ₹)                         */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                <Tag size={13} />
                <span>Reader-to-Reader Marketplace</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Pre-Owned Books from Fellow Readers
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-bold text-[#C59B27] hover:text-[#A6811E] flex items-center space-x-1"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketplaceListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E5DCD0] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex space-x-3.5">
                    <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-xs border border-gray-200">
                      <img
                        src={item.photoUrl || item.book?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-md">
                        {item.conditionGrade.replace('_', ' ')}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1C1917] truncate">{item.book?.title}</h4>
                      <p className="text-[11px] text-gray-500 truncate">Seller: {item.seller?.name}</p>
                      <p className="text-xs font-bold text-[#1C1917]">{formatPrice(item.listingPrice)}</p>
                    </div>
                  </div>
                  {item.conditionDescription && (
                    <p className="text-xs text-gray-500 italic mt-3 bg-gray-50 p-2 rounded-xl line-clamp-2">
                      "{item.conditionDescription}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[11px] text-green-700 font-semibold">
                    <ShieldCheck size={14} />
                    <span>Escrow Protected</span>
                  </div>
                  <button
                    onClick={() => setCheckoutListing(item)}
                    className="px-4 py-1.5 bg-[#C59B27] hover:bg-[#A6811E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <ShoppingCart size={13} />
                    <span>Buy for {formatPrice(item.listingPrice)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. BROWSE BY GENRE CAPSULES                                                */}
        {/* ========================================================================= */}
        <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 border border-[#E8DFD1] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-[#1C1917]">Browse Literary Categories</h3>
            <Link to="/books" className="text-xs font-bold text-[#C59B27] hover:underline">
              View All 16+ Genres
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {categories.map((cat, idx) => {
              const colorSchemes = [
                'from-amber-500/10 to-orange-500/20 border-amber-300/60 text-amber-900 group-hover:from-amber-500 group-hover:to-orange-600',
                'from-emerald-500/10 to-teal-500/20 border-emerald-300/60 text-emerald-900 group-hover:from-emerald-600 group-hover:to-teal-600',
                'from-blue-500/10 to-indigo-500/20 border-blue-300/60 text-blue-900 group-hover:from-blue-600 group-hover:to-indigo-600',
                'from-purple-500/10 to-pink-500/20 border-purple-300/60 text-purple-900 group-hover:from-purple-600 group-hover:to-pink-600',
                'from-rose-500/10 to-red-500/20 border-rose-300/60 text-rose-900 group-hover:from-rose-600 group-hover:to-red-600',
                'from-violet-500/10 to-purple-500/20 border-violet-300/60 text-violet-900 group-hover:from-violet-600 group-hover:to-purple-600',
              ];
              const scheme = colorSchemes[idx % colorSchemes.length];

              return (
                <Link
                  key={cat.id}
                  to={`/books?genre=${encodeURIComponent(cat.slug)}`}
                  className={`p-4 rounded-3xl bg-gradient-to-br ${scheme} border text-center transition-all duration-300 group shadow-xs hover:shadow-lg hover:-translate-y-1`}
                >
                  <p className="font-serif font-bold text-xs group-hover:text-white transition-colors leading-snug">{cat.name}</p>
                  <p className="text-[10px] opacity-75 group-hover:text-white/90 mt-1 font-semibold">{cat.bookCount || 0} books</p>
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Checkout Modal for Marketplace */}
      {checkoutListing && (
        <CheckoutModal
          listing={checkoutListing}
          isOpen={Boolean(checkoutListing)}
          onClose={() => setCheckoutListing(null)}
          onSuccess={() => {
            setCheckoutListing(null);
            api.getMarketplaceListings({ size: 6 }).then((res) => {
              setMarketplaceListings(res.data.data.content || []);
            });
          }}
        />
      )}
    </div>
  );
};
