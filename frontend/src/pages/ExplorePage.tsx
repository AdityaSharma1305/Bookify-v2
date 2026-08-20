import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { BookSummary, Category, PageResponse } from '../types';
import { BookCard } from '../components/books/BookCard';
import { BookGridSkeleton } from '../components/common/Skeleton';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse<BookSummary> | null>(null);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.data.data || []));
  }, []);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const res = await api.searchBooks({
          q: query || undefined,
          genre: genre || undefined,
          minRating: minRating || undefined,
          page,
          size: 18,
          sort,
        });
        setBooks(res.data.data.content);
        setPageInfo(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [query, genre, sort, page, minRating]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '0');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Curated Literary Stacks
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-2">Explore Bestseller Books</h1>
          <p className="text-xs text-gray-500 mt-1">Discover thousands of handpicked titles across fiction, tech, business, and philosophy</p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              placeholder="Search by title, author..."
              defaultValue={query}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateParam('q', (e.target as HTMLInputElement).value || null);
                }
              }}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#EDE5D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C59B27]/40 focus:border-[#C59B27] shadow-xs"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={15} />
          </div>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-white border border-[#EDE5D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C59B27]/40 focus:border-[#C59B27] text-gray-700 font-semibold shadow-xs"
          >
            <option value="createdAt,desc">✨ Newest Added</option>
            <option value="averageRating,desc">⭐ Highest Rated</option>
            <option value="price,asc">₹ Price: Low to High</option>
            <option value="price,desc">₹ Price: High to Low</option>
            <option value="title,asc">📖 Title: A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <aside className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-sm space-y-6 md:sticky md:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE5D8]">
            <span className="font-serif font-bold text-sm text-primary flex items-center gap-1.5">
              <Filter size={16} className="text-[#C59B27]" /> Catalog Filters
            </span>
            {(query || genre || minRating) && (
              <button onClick={() => setSearchParams({})} className="text-xs text-[#C59B27] hover:underline font-bold">
                Reset all
              </button>
            )}
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Browse Category</h4>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('genre', null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !genre ? 'bg-[#C59B27] text-white shadow-sm' : 'text-gray-600 hover:bg-[#FAF6F0]'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam('genre', c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center transition-all ${
                    genre === c.slug ? 'bg-[#C59B27] text-white shadow-sm' : 'text-gray-600 hover:bg-[#FAF6F0]'
                  }`}
                >
                  <span>{c.name}</span>
                  {c.bookCount ? <span className="text-[10px] opacity-75">{c.bookCount}</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Minimum Reader Rating</h4>
            <div className="space-y-1.5">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => updateParam('minRating', minRating === r ? null : String(r))}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    minRating === r ? 'bg-[#C59B27] text-white shadow-sm' : 'text-gray-600 hover:bg-[#FAF6F0] border border-[#EDE5D8]'
                  }`}
                >
                  <span>⭐ {r}+ Stars &amp; Above</span>
                  <span className="text-[10px]">Top Picks</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-[#DFD5C4] rounded-lg w-40 animate-pulse" />
                <div className="h-8 bg-[#DFD5C4] rounded-xl w-32 animate-pulse" />
              </div>
              <BookGridSkeleton count={9} />
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
              {books.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
              <p className="font-serif text-lg text-gray-700 font-semibold">No books match your criteria</p>
              <p className="text-xs text-gray-400 mt-1">Try relaxing your search terms or filters.</p>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 px-4 py-2 bg-accent text-white rounded-full text-xs font-medium hover:bg-accent-hover"
              >
                Clear Filters
              </button>
            </div>
          )}

          {pageInfo && pageInfo.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6 border-t border-gray-100">
              <button
                disabled={pageInfo.first}
                onClick={() => updateParam('page', String(page - 1))}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 text-gray-600"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-gray-600">
                Page {pageInfo.page + 1} of {pageInfo.totalPages}
              </span>
              <button
                disabled={pageInfo.last}
                onClick={() => updateParam('page', String(page + 1))}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 text-gray-600"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
