import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  clickable?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark', clickable = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const content = (
    <div className="flex items-center space-x-2.5 group select-none">
      {/* Luxury Geometric Emblem */}
      <div className={`${iconSizes[size]} relative rounded-2xl bg-[#141423] p-1.5 flex items-center justify-center shadow-md border border-amber-400/20 group-hover:border-amber-400/50 transition-all duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 38 38" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logo-flame" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#E85D26" />
              <stop offset="100%" stop-color="#FFA463" />
            </linearGradient>
            <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FCD34D" />
              <stop offset="100%" stop-color="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Left Wing / Page */}
          <path d="M19 5C11 5 5 8 5 11V31C5 28 11 25 19 25V5Z" fill="url(#logo-flame)" />
          {/* Right Wing / Page */}
          <path d="M19 5C27 5 33 8 33 11V31C33 28 27 25 19 25V5Z" fill="url(#logo-flame)" fillOpacity="0.85" />
          {/* Central Golden Spine & Bookmark */}
          <path d="M19 3V14L22 12L25 14V3H19Z" fill="url(#logo-gold)" />
          {/* North Star */}
          <polygon points="29,4 30,6 32,7 30,8 29,10 28,8 26,7 28,6" fill="#FFF" opacity="0.9" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-serif font-bold tracking-tight leading-none ${textSizes[size]} ${
          variant === 'light' ? 'text-white' : 'text-[#141423]'
        }`}>
          Book<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D26] to-[#FFA463]">ify</span>
          <span className="text-[10px] font-sans tracking-widest text-amber-500 font-extrabold ml-1.5 uppercase px-1.5 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
            PRO
          </span>
        </span>
      </div>
    </div>
  );

  return clickable ? <Link to="/">{content}</Link> : content;
};
