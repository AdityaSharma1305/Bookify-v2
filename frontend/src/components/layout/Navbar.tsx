import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Search, Bookmark, User, LogOut, Shield, ShoppingBag, Headphones, BookOpen, MoreVertical } from 'lucide-react';
import { Logo } from './Logo';
import { api } from '../../api';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, refreshToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMediaType, setActiveMediaType] = useState<'BOOKS' | 'AUDIOBOOKS'>('BOOKS');

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch (err) {
        // ignore
      }
    }
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3D6]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Left: Stylized Logo */}
          <div className="flex items-center space-x-3">
            <Logo size="md" />
          </div>

          {/* 2. Center: Segmented Books vs AudioBooks Toggle (from design) */}
          <div className="hidden md:flex items-center bg-[#EDE5D8]/80 p-1 rounded-full border border-[#DFD5C4] shadow-xs">
            <button
              onClick={() => {
                setActiveMediaType('BOOKS');
                if (location.pathname !== '/') navigate('/');
              }}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeMediaType === 'BOOKS'
                  ? 'bg-[#C59B27] text-white shadow-sm'
                  : 'text-[#6B5E4C] hover:text-[#2C2418]'
              }`}
            >
              <BookOpen size={15} />
              <span>Books</span>
            </button>
            <button
              onClick={() => {
                setActiveMediaType('AUDIOBOOKS');
                if (location.pathname !== '/') navigate('/');
              }}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeMediaType === 'AUDIOBOOKS'
                  ? 'bg-[#C59B27] text-white shadow-sm'
                  : 'text-[#6B5E4C] hover:text-[#2C2418]'
              }`}
            >
              <Headphones size={15} />
              <span>AudioBooks</span>
            </button>
          </div>

          {/* 3. Right: Navigation Icons Bar (Bookmark, Bag with Badge, User Avatar, Menu) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Explore Catalog link */}
            <Link
              to="/books"
              className="text-xs font-bold text-[#5C5040] hover:text-[#1C1917] hidden lg:inline px-3 py-1.5 rounded-full hover:bg-[#EDE5D8] transition-colors"
            >
              Catalog
            </Link>

            {/* Marketplace link */}
            <Link
              to="/marketplace"
              className="text-xs font-bold text-[#C59B27] hover:text-[#A6811E] hidden sm:inline px-3 py-1.5 rounded-full bg-[#C59B27]/10 hover:bg-[#C59B27]/20 border border-[#C59B27]/30 transition-colors"
            >
              Marketplace
            </Link>

            {/* Admin Control Center link */}
            {user?.role === 'ROLE_ADMIN' && (
              <Link
                to="/admin"
                className="text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-300 hidden sm:inline px-3 py-1.5 rounded-full transition-colors flex items-center space-x-1"
              >
                <span>⚙️ Admin Panel</span>
              </Link>
            )}

            {/* Bookmark Icon */}
            <Link
              to={isAuthenticated ? "/library" : "/login"}
              title="My Library & Saved Books"
              className="p-2.5 rounded-full text-[#5C5040] hover:text-[#1C1917] hover:bg-[#EDE5D8] transition-colors"
            >
              <Bookmark size={19} />
            </Link>

            {/* Shopping Bag with Badge */}
            <Link
              to={isAuthenticated ? "/orders" : "/marketplace"}
              title="Marketplace Orders & Cart"
              className="relative p-2.5 rounded-full text-[#5C5040] hover:text-[#1C1917] hover:bg-[#EDE5D8] transition-colors"
            >
              <ShoppingBag size={19} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C59B27] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {isAuthenticated ? '2' : '0'}
              </span>
            </Link>

            {/* User Avatar / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#C59B27]/50 transition-all focus:outline-none"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#D5C9B5] shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <MoreVertical size={16} className="text-[#8C7E6A]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-primary truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-accent"
                    >
                      <User size={15} className="mr-2.5" /> Profile &amp; Settings
                    </Link>
                    <Link
                      to="/library"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-accent"
                    >
                      <Bookmark size={15} className="mr-2.5" /> My Bookshelf
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-accent"
                    >
                      <ShoppingBag size={15} className="mr-2.5" /> Orders &amp; Sales
                    </Link>
                    {user?.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                      >
                        <Shield size={15} className="mr-2.5" /> Admin Control
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 mt-1 border-t border-gray-50"
                    >
                      <LogOut size={15} className="mr-2.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-[#1C1917] hover:text-[#C59B27] px-3.5 py-2 rounded-full hover:bg-[#EDE5D8] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-white bg-[#C59B27] hover:bg-[#A6811E] px-4 py-2 rounded-full shadow-sm transition-all"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
