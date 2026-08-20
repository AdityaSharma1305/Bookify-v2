import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { ReadingProgressItem, FavoriteItem, CollectionItem, ReadingStatus } from '../types';
import { BookCard } from '../components/books/BookCard';
import { BookGridSkeleton } from '../components/common/Skeleton';
import { Bookmark, Heart, FolderPlus, Plus, Check } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CURRENTLY_READING' | 'WANT_TO_READ' | 'COMPLETED' | 'FAVORITES' | 'COLLECTIONS'>('CURRENTLY_READING');
  const [readingList, setReadingList] = useState<ReadingProgressItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'FAVORITES') {
        const res = await api.getFavorites(0, 50);
        setFavorites(res.data.data.content);
      } else if (activeTab === 'COLLECTIONS') {
        const res = await api.getCollections();
        setCollections(res.data.data);
      } else {
        const res = await api.getLibrary(activeTab as ReadingStatus, 0, 50);
        setReadingList(res.data.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePage = async (bookId: number, currentPage: number) => {
    try {
      await api.updateReadingProgress(bookId, currentPage);
      loadTabData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      await api.createCollection({ name: newCollectionName.trim() });
      setNewCollectionName('');
      loadTabData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Personal Shelf &amp; Tracker
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-2">My Reading Library</h1>
          <p className="text-xs text-gray-500 mt-1">Organize your reading journey, track daily page milestones, and curate custom lists</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { id: 'CURRENTLY_READING', label: '📖 Currently Reading' },
          { id: 'WANT_TO_READ', label: '📌 Want to Read' },
          { id: 'COMPLETED', label: '🏆 Completed' },
          { id: 'FAVORITES', label: '❤️ Favorites' },
          { id: 'COLLECTIONS', label: '📂 Custom Lists' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#C59B27] text-white shadow-md'
                : 'bg-white text-gray-600 border border-[#EDE5D8] hover:bg-[#FAF6F0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <BookGridSkeleton count={8} />
      ) : activeTab === 'FAVORITES' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {favorites.length > 0 ? (
            favorites.map((f) => <BookCard key={f.id} book={f.book} isFavorite />)
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#EDE5D8] p-8 space-y-2">
              <Heart className="mx-auto text-gray-300" size={32} />
              <p className="font-serif font-bold text-sm text-primary">No favorite books added yet</p>
              <p className="text-xs text-gray-400">Click the heart icon on any book in the catalog to pin it here.</p>
            </div>
          )}
        </div>
      ) : activeTab === 'COLLECTIONS' ? (
        <div className="space-y-6">
          <form onSubmit={handleCreateCollection} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="New collection name (e.g. 2026 Must Reads)..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-[#EDE5D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C59B27]/40 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#C59B27] hover:bg-[#A6811E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 transition-colors"
            >
              <Plus size={15} /> Create
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {collections.length > 0 ? (
              collections.map((c) => (
                <div key={c.id} className="p-6 bg-white border border-[#EDE5D8] hover:border-[#C59B27]/50 rounded-3xl space-y-2 shadow-sm transition-all">
                  <div className="flex items-center space-x-2 text-primary font-bold">
                    <FolderPlus className="text-[#C59B27]" size={20} />
                    <h4 className="font-serif">{c.name}</h4>
                  </div>
                  <p className="text-xs text-gray-400">{c.bookCount || 0} books in collection</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#EDE5D8] p-8 space-y-2">
                <FolderPlus className="mx-auto text-gray-300" size={32} />
                <p className="font-serif font-bold text-sm text-primary">No custom collections yet</p>
                <p className="text-xs text-gray-400">Create thematic reading lists like "Weekend Reads" or "Startup Classics".</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {readingList.length > 0 ? (
            readingList.map((item) => (
              <div key={item.id} className="p-5 bg-white border border-[#EDE5D8] hover:border-[#C59B27]/40 rounded-3xl flex gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-20 aspect-[2/3] bg-[#FAF6F0] rounded-2xl overflow-hidden shrink-0 shadow-md border border-[#EDE5D8]">
                  {item.book.coverImage && (
                    <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-primary line-clamp-2">{item.book.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.book.author?.name}</p>
                  </div>

                  {activeTab === 'CURRENTLY_READING' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] text-gray-600 font-semibold">
                        <span>Page {item.currentPage} of {item.totalPages || 320}</span>
                        <span className="text-[#C59B27]">{item.percentage || Math.round((item.currentPage / (item.totalPages || 320)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-[#EDE5D8]/50 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C59B27] h-full transition-all duration-500 rounded-full"
                          style={{ width: `${item.percentage || Math.min(100, Math.round((item.currentPage / (item.totalPages || 320)) * 100))}%` }}
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="number"
                          placeholder="Page #"
                          defaultValue={item.currentPage}
                          onBlur={(e) => handleUpdatePage(item.book.id, parseInt(e.target.value, 10) || 0)}
                          className="w-24 px-2.5 py-1 text-xs border border-[#EDE5D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                        />
                        <button className="px-3 py-1 bg-[#FAF6F0] hover:bg-[#EDE5D8] text-[11px] font-bold text-gray-700 rounded-xl transition-colors">
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'COMPLETED' && (
                    <div className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl gap-1.5 font-bold border border-emerald-200">
                      <Check size={14} /> Completed
                    </div>
                  )}

                  {activeTab === 'WANT_TO_READ' && (
                    <div className="inline-flex items-center text-xs text-[#A6811E] bg-amber-50 px-2.5 py-1 rounded-xl gap-1.5 font-bold border border-amber-200">
                      <span>📌 On Wishlist</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#EDE5D8] p-8 space-y-2">
              <Bookmark className="mx-auto text-gray-300" size={32} />
              <p className="font-serif font-bold text-sm text-primary">No books currently in this shelf</p>
              <p className="text-xs text-gray-400">Browse the catalog to add books to your reading shelf.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
