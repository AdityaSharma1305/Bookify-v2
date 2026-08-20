import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaProps {
  title?: string;
  description?: string;
}

export const SEOHead: React.FC<MetaProps> = ({ title, description }) => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title ? `${title} | Bookify` : 'Bookify — Intelligent Literary Catalog & Marketplace';
    document.title = pageTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        description || 'Discover bestseller curations, AI-powered book summaries, reading habit tracking, and peer-to-peer used book marketplace on Bookify.'
      );
    }
  }, [title, description, location.pathname]);

  return null;
};
