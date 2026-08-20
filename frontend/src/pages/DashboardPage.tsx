import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { UserDashboard } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, CheckCircle, Flame, Star, Target, TrendingUp } from 'lucide-react';

import { StatsGridSkeleton } from '../components/common/Skeleton';

export const DashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUserDashboard()
      .then((res) => setDashboard(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-28 bg-[#FAF6F0] rounded-3xl border border-[#EDE5D8]" />
        <StatsGridSkeleton />
        <div className="h-72 bg-[#FAF6F0] rounded-3xl border border-[#EDE5D8]" />
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Reader Insights &amp; Metrics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-2">Personal Reading Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Track reading frequency, milestone streaks, and annual literary challenges</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="p-6 bg-white border border-[#EDE5D8] rounded-3xl shadow-sm space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Books Finished</span>
            <CheckCircle className="text-emerald-500" size={20} />
          </div>
          <p className="text-3xl font-serif font-bold text-primary">{dashboard.booksRead}</p>
        </div>

        <div className="p-6 bg-white border border-[#EDE5D8] rounded-3xl shadow-sm space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Currently Reading</span>
            <BookOpen className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-serif font-bold text-primary">{dashboard.currentlyReading}</p>
        </div>

        <div className="p-6 bg-white border border-[#EDE5D8] rounded-3xl shadow-sm space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Want to Read</span>
            <Flame className="text-[#C59B27]" size={20} />
          </div>
          <p className="text-3xl font-serif font-bold text-primary">{dashboard.wantToRead}</p>
        </div>

        <div className="p-6 bg-white border border-[#EDE5D8] rounded-3xl shadow-sm space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Avg Rating Given</span>
            <Star className="text-amber-500 fill-amber-500" size={20} />
          </div>
          <p className="text-3xl font-serif font-bold text-primary">{dashboard.averageRatingGiven || '5.0'}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 sm:p-8 bg-white border border-[#EDE5D8] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
              <TrendingUp size={20} className="text-[#C59B27]" /> Monthly Reading Velocity
            </h3>
            <span className="text-xs font-semibold text-[#C59B27] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {new Date().getFullYear()} Stacks
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.booksReadPerMonth}>
                <XAxis dataKey="label" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#C59B27" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reading Goal Card */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1C1917] via-[#2A2620] to-[#141210] text-white rounded-3xl shadow-lg flex flex-col justify-between relative overflow-hidden border border-[#C59B27]/30">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#C59B27]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-[#C59B27]">
              <Target size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10 text-amber-200">
                Annual Challenge
              </span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-white">{new Date().getFullYear()} Reading Goal</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              You have completed <strong className="text-[#C59B27] font-serif text-sm">{dashboard.booksRead}</strong> out of <strong className="text-white font-serif text-sm">{dashboard.readingGoal || 12}</strong> target books.
            </p>
          </div>

          <div className="my-6 space-y-2.5 relative z-10">
            <div className="flex justify-between text-xs text-gray-300 font-semibold">
              <span>Goal Completion</span>
              <span className="text-[#C59B27] font-bold">{Math.min(100, Math.round((dashboard.booksRead / (dashboard.readingGoal || 1)) * 100))}%</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-[#FFD000] to-[#C59B27] h-full transition-all duration-500 rounded-full shadow-sm"
                style={{ width: `${Math.min(100, Math.round((dashboard.booksRead / (dashboard.readingGoal || 1)) * 100))}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center italic relative z-10 border-t border-white/10 pt-3">
            "A reader lives a thousand lives before he dies."
          </p>
        </div>
      </div>
    </div>
  );
};
