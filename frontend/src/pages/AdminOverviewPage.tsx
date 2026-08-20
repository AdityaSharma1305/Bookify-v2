import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { AdminStats, AdminAnalytics } from '../types';
import { BookOpen, Users, Star, Layers, ShieldCheck } from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminAnalytics()]).then(([sRes, aRes]) => {
      setStats(sRes.data.data);
      setAnalytics(aRes.data.data);
    });
  }, []);

  if (!stats) return <div className="text-center py-20">Loading admin analytics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="text-accent" size={26} />
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Admin Control Center</h1>
          <p className="text-sm text-gray-500">Platform overview, catalog size, and community metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-400 font-semibold uppercase">Total Books</span>
          <p className="text-3xl font-serif font-bold text-primary mt-1">{stats.totalBooks}</p>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-400 font-semibold uppercase">Registered Users</span>
          <p className="text-3xl font-serif font-bold text-primary mt-1">{stats.totalUsers}</p>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-400 font-semibold uppercase">Authors</span>
          <p className="text-3xl font-serif font-bold text-primary mt-1">{stats.totalAuthors}</p>
        </div>
        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-400 font-semibold uppercase">Reviews</span>
          <p className="text-3xl font-serif font-bold text-primary mt-1">{stats.totalReviews}</p>
        </div>
      </div>
    </div>
  );
};
