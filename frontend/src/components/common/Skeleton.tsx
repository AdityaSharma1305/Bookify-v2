import React from 'react';

// Base Shimmer Block
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-[#EDE5D8]/90 via-[#DFD5C4]/70 to-[#EDE5D8]/90 rounded-2xl ${className}`} />
);

// 3D Hardcover Book Card Skeleton
export const BookCardSkeleton: React.FC = () => (
  <div className="flex flex-col space-y-3 p-4 bg-[#FAF6F0] rounded-[28px] border border-[#EAE1D3] shadow-sm animate-pulse">
    {/* 3D Spine Cover Placeholder */}
    <div className="w-full aspect-[2/3] bg-gradient-to-br from-[#E2D7C5] to-[#D5C9B5] rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/10 border-r border-white/20" />
      <div className="w-12 h-16 bg-white/20 rounded-lg" />
    </div>

    {/* Metadata Placeholders */}
    <div className="space-y-2 pt-1">
      <div className="h-4 bg-[#DFD5C4] rounded-md w-4/5" />
      <div className="h-3 bg-[#E8DFD1] rounded-md w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-[#C59B27]/20 rounded-full w-16" />
        <div className="h-4 bg-[#DFD5C4] rounded-md w-10" />
      </div>
    </div>
  </div>
);

// Grid of Book Skeletons
export const BookGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <BookCardSkeleton key={i} />
    ))}
  </div>
);

// Hero 3D Stage Skeleton (for Landing Page)
export const HeroStageSkeleton: React.FC = () => (
  <div className="bg-[#FAF6F0] rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14 border border-[#E8DFD1] shadow-2xl animate-pulse space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
      <div className="lg:col-span-4 space-y-4">
        <div className="h-12 bg-[#DFD5C4] rounded-2xl w-3/4" />
        <div className="h-5 bg-[#E8DFD1] rounded-lg w-1/2" />
        <div className="h-12 bg-white rounded-full w-full border border-[#DFD5C4]" />
      </div>

      <div className="lg:col-span-4 flex justify-center">
        <div className="w-48 sm:w-56 h-72 sm:h-84 bg-gradient-to-br from-[#DFD5C4] to-[#C59B27]/20 rounded-2xl shadow-xl" />
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="h-28 bg-[#EDE5D8] rounded-3xl" />
        <div className="h-28 bg-[#EDE5D8] rounded-3xl" />
      </div>
    </div>
  </div>
);

// Pre-Loved Marketplace Card Skeleton
export const MarketplaceCardSkeleton: React.FC = () => (
  <div className="p-5 bg-[#FAF6F0] rounded-3xl border border-[#EAE1D3] shadow-sm animate-pulse space-y-4">
    <div className="flex space-x-4">
      <div className="w-20 h-28 bg-[#DFD5C4] rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[#DFD5C4] rounded w-3/4" />
        <div className="h-3 bg-[#E8DFD1] rounded w-1/2" />
        <div className="h-5 bg-emerald-500/20 rounded-full w-20" />
      </div>
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-[#EDE5D8]">
      <div className="h-6 bg-[#C59B27]/20 rounded-full w-16" />
      <div className="h-8 bg-[#1C1917]/20 rounded-xl w-24" />
    </div>
  </div>
);

// Stats Grid Skeleton (for Admin & Dashboard)
export const StatsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-6 bg-stone-900/60 border border-stone-800 rounded-3xl space-y-2">
        <div className="h-3 bg-stone-700 rounded w-1/2" />
        <div className="h-8 bg-stone-600 rounded w-3/4" />
        <div className="h-3 bg-stone-800 rounded w-2/3" />
      </div>
    ))}
  </div>
);
