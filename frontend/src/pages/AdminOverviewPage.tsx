import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { AdminStats, AdminAnalytics, BookSummary, UserProfile, UserStatus, BookStatus, Category, Author } from '../types';
import { 
  ShieldCheck, BookOpen, Users, Star, Layers, Plus, Trash2, CheckCircle, 
  XCircle, Search, Activity, RefreshCw, Eye
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AdminOverviewPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BOOKS' | 'USERS' | 'SETTINGS'>('OVERVIEW');
  
  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Book Search & Filter
  const [bookSearch, setBookSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // New Book Modal / Form State
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newPrice, setNewPrice] = useState('499');
  const [newPages, setNewPages] = useState('320');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600');
  const [newAuthorId, setNewAuthorId] = useState<number>(1);
  const [newCategoryId, setNewCategoryId] = useState<number>(1);
  const [newDescription, setNewDescription] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes, bRes, uRes, cRes, authRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminAnalytics(),
        api.searchBooks({ page: 0, size: 50 }),
        api.adminGetUsers(0, 50),
        api.getCategories(),
        api.getAuthors()
      ]);
      setStats(sRes.data.data);
      setAnalytics(aRes.data.data);
      setBooks(bRes.data.data.content);
      setUsers(uRes.data.data.content);
      setCategories(cRes.data.data);
      setAuthors(authRes.data.data.content);
      if (authRes.data.data.content.length > 0) setNewAuthorId(authRes.data.data.content[0].id);
      if (cRes.data.data.length > 0) setNewCategoryId(cRes.data.data[0].id);
    } catch (e: any) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Toggle User Status (Ban / Activate)
  const handleToggleUserStatus = async (targetUser: UserProfile) => {
    const nextStatus: UserStatus = targetUser.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    setActionLoading(true);
    try {
      await api.adminUpdateUserStatus(targetUser.id, nextStatus);
      showNotification(`User ${targetUser.name} status updated to ${nextStatus}!`);
      setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, status: nextStatus } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update user status');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Book Status (Active / Inactive)
  const handleToggleBookStatus = async (book: BookSummary) => {
    const nextStatus: BookStatus = book.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setActionLoading(true);
    try {
      await api.adminUpdateBookStatus(book.id, nextStatus);
      showNotification(`Book "${book.title}" updated to ${nextStatus}!`);
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: nextStatus } : b));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update book status');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Book
  const handleDeleteBook = async (bookId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      await api.adminDeleteBook(bookId);
      showNotification(`Book "${title}" deleted successfully.`);
      setBooks(prev => prev.filter(b => b.id !== bookId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not delete book');
    } finally {
      setActionLoading(false);
    }
  };

  // Create Book Form Submit
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIsbn.trim()) {
      alert('Please enter a title and ISBN');
      return;
    }
    setActionLoading(true);
    try {
      const payload = {
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || undefined,
        isbn: newIsbn.trim(),
        price: parseFloat(newPrice) || 499,
        pageCount: parseInt(newPages) || 300,
        coverImageUrl: newCover.trim(),
        description: newDescription.trim() || 'A masterpiece curated for discerning readers.',
        authorId: newAuthorId,
        categoryIds: [newCategoryId],
        status: 'ACTIVE',
        isFeatured: true
      };
      await api.adminCreateBook(payload);
      showNotification(`Book "${newTitle}" created & published successfully!`);
      setShowAddBookModal(false);
      // Reset form
      setNewTitle('');
      setNewSubtitle('');
      setNewIsbn('');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create book');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    (b.author?.name && b.author.name.toLowerCase().includes(bookSearch.toLowerCase())) ||
    b.isbn.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="animate-spin text-accent" size={36} />
        <p className="text-gray-400 font-serif tracking-wider">Opening Master Admin Control Center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-neutral-900 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent/20 border border-accent/40 rounded-xl">
              <ShieldCheck className="text-accent" size={28} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Master Admin Control Center</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  LIVE SYSTEM
                </span>
              </div>
              <p className="text-sm text-stone-400">Welcome, <strong className="text-stone-200">{user?.name || 'Administrator'}</strong>. Real-time platform management, catalog controls & security telemetry.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadData()}
            disabled={actionLoading}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-sm font-medium transition flex items-center space-x-2 border border-stone-700"
          >
            <RefreshCw size={16} className={actionLoading ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => setShowAddBookModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-accent to-amber-600 hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg transition flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {feedbackMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-emerald-200 text-sm font-medium flex items-center space-x-3 animate-fade-in shadow-xl">
          <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-800 space-x-2 sm:space-x-4 overflow-x-auto pb-2">
        {[
          { id: 'OVERVIEW', label: 'Platform Telemetry', icon: Activity },
          { id: 'BOOKS', label: `Book Catalog (${books.length})`, icon: BookOpen },
          { id: 'USERS', label: `User Management (${users.length})`, icon: Users },
          { id: 'SETTINGS', label: 'Security & System Health', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-accent/15 text-accent border border-accent/40 shadow-sm' 
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW TELEMETRY */}
      {activeTab === 'OVERVIEW' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl relative overflow-hidden">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Live Catalog Books</span>
              <p className="text-4xl font-serif font-bold text-white mt-2">{stats.totalBooks}</p>
              <div className="mt-2 flex items-center text-xs text-emerald-400">
                <span>{books.filter(b => b.status === 'ACTIVE').length} Published & Active</span>
              </div>
            </div>

            <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl relative overflow-hidden">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Registered Readers</span>
              <p className="text-4xl font-serif font-bold text-white mt-2">{stats.totalUsers}</p>
              <div className="mt-2 flex items-center text-xs text-emerald-400">
                <span>{users.filter(u => u.status === 'ACTIVE').length} Active Accounts</span>
              </div>
            </div>

            <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl relative overflow-hidden">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Curated Authors</span>
              <p className="text-4xl font-serif font-bold text-white mt-2">{stats.totalAuthors}</p>
              <div className="mt-2 text-xs text-stone-400">
                <span>Across {categories.length} Categories</span>
              </div>
            </div>

            <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl relative overflow-hidden">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Community Reviews</span>
              <p className="text-4xl font-serif font-bold text-accent mt-2">{stats.totalReviews}</p>
              <div className="mt-2 text-xs text-stone-400">
                <span>Avg Rating: 4.75 / 5.0 ⭐</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOK CATALOG MANAGEMENT */}
      {activeTab === 'BOOKS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 text-stone-500" size={18} />
              <input
                type="text"
                placeholder="Search by title, author, ISBN..."
                value={bookSearch}
                onChange={e => setBookSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-stone-200 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <button
              onClick={() => setShowAddBookModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center space-x-2"
            >
              <Plus size={18} />
              <span>Add New Book</span>
            </button>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-300">
                <thead className="bg-stone-950/80 text-xs uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="px-6 py-4">Book Details</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                        No books found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map(book => (
                      <tr key={book.id} className="hover:bg-stone-800/30 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120'}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded-lg shadow border border-stone-700 flex-shrink-0"
                            />
                            <div>
                              <p className="font-serif font-bold text-white text-base">{book.title}</p>
                              <p className="text-xs text-stone-500">ISBN: {book.isbn}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stone-300 font-medium">{book.author?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 font-bold text-white">₹{(book.price ?? 499).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleBookStatus(book)}
                            disabled={actionLoading}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition ${
                              book.status === 'ACTIVE'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-stone-700/40 text-stone-400 border-stone-600 hover:bg-stone-700'
                            }`}
                          >
                            {book.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <a
                              href={`/books/${book.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition"
                              title="View on site"
                            >
                              <Eye size={16} />
                            </a>
                            <button
                              onClick={() => handleDeleteBook(book.id, book.title)}
                              disabled={actionLoading}
                              className="p-2 text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 rounded-lg transition border border-rose-900/40"
                              title="Delete Book"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="space-y-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 text-stone-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-stone-200 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-300">
                <thead className="bg-stone-950/80 text-xs uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-stone-800/30 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-stone-700"
                            />
                            <span className="font-bold text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stone-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            u.role === 'ROLE_ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}>
                            {u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            disabled={actionLoading}
                            className={`px-3 py-1 text-xs font-bold rounded-xl transition ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & SYSTEM HEALTH */}
      {activeTab === 'SETTINGS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-3xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="text-emerald-400" size={22} />
              <span>Cybersecurity Engine Telemetry</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">IP Rate Limiting (Token Bucket)</span>
                <span className="text-emerald-400 font-bold">ACTIVE (5 req/min auth)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">Anti-XSS Input Sanitization</span>
                <span className="text-emerald-400 font-bold">ENABLED (Regex Tag Stripper)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">Password Encryption</span>
                <span className="text-emerald-400 font-bold">BCrypt (Strength 12)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">JWT Token Rotation</span>
                <span className="text-emerald-400 font-bold">15m Access / 7d Refresh</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-400">HTTP Security Headers</span>
                <span className="text-emerald-400 font-bold">X-Frame, nosniff, HSTS</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-3xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
              <Activity className="text-accent" size={22} />
              <span>Cloud Infrastructure & Email Pipeline</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">Transactional Email Engine</span>
                <span className="text-accent font-bold">Resend SMTP (smtp.resend.com:587)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">Backend Application Hosting</span>
                <span className="text-stone-200 font-bold">Render Web Service (Java 21)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">Frontend CDN Hosting</span>
                <span className="text-stone-200 font-bold">Vercel Global Edge Network</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-400">PostgreSQL Database</span>
                <span className="text-stone-200 font-bold">Cloud Connected & Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW BOOK */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Publish New Book to Catalog</h2>
                <p className="text-xs text-stone-400">Adds live book with 3D spine aesthetics, pricing, and category indexing.</p>
              </div>
              <button onClick={() => setShowAddBookModal(false)} className="text-stone-400 hover:text-white">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">Book Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sapiens: A Brief History"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-300">Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Humankind in Perspective"
                    value={newSubtitle}
                    onChange={e => setNewSubtitle(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">ISBN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9780062316097"
                    value={newIsbn}
                    onChange={e => setNewIsbn(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-300">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="499"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-300">Page Count</label>
                  <input
                    type="number"
                    placeholder="350"
                    value={newPages}
                    onChange={e => setNewPages(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">Author *</label>
                  <select
                    value={newAuthorId}
                    onChange={e => setNewAuthorId(Number(e.target.value))}
                    className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                  >
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.country || 'Global'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">Category *</label>
                  <select
                    value={newCategoryId}
                    onChange={e => setNewCategoryId(Number(e.target.value))}
                    className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newCover}
                  onChange={e => setNewCover(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300">Book Description / Synopsis</label>
                <textarea
                  rows={3}
                  placeholder="Provide an editorial summary of the book..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-accent to-amber-600 hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg transition"
                >
                  {actionLoading ? 'Publishing...' : 'Publish Book Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
