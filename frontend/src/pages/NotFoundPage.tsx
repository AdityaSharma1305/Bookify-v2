import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#C59B27] shadow-inner">
          <BookOpen size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#C59B27] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Error 404 • Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-primary">Page Lost in the Stacks</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            The page or book collection you are looking for might have been archived, moved, or never existed in our catalog.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Home size={15} />
            <span>Go to Homepage</span>
          </Link>
          <Link
            to="/books"
            className="px-5 py-2.5 bg-white text-[#C59B27] border-2 border-[#C59B27] text-xs font-bold rounded-xl hover:bg-[#C59B27] hover:text-white transition-all flex items-center justify-center space-x-2"
          >
            <Compass size={15} />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
