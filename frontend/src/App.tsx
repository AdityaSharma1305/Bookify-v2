import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { AuthLandingPage } from './pages/AuthLandingPage';
import { useAuthStore } from './store/authStore';
import { ExplorePage } from './pages/ExplorePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { LibraryPage } from './pages/LibraryPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminOverviewPage } from './pages/AdminOverviewPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { OrdersPage } from './pages/OrdersPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { StickyMobileCTA } from './components/common/StickyMobileCTA';
import { AnalyticsTracker } from './components/common/AnalyticsTracker';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  // Wake up Render backend on app load (free tier sleeps after inactivity)
  useEffect(() => {
    const BACKEND = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://bookify-v2-glg0.onrender.com';
    fetch(`${BACKEND}/actuator/health`, { signal: AbortSignal.timeout(30000) }).catch(() => {});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnalyticsTracker />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<LandingPage />} />
              <Route path="/books" element={<ExplorePage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/login" element={<AuthLandingPage />} />
              <Route path="/register" element={<AuthLandingPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminOverviewPage />} />
              </Route>

              {/* 404 Wildcard Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <StickyMobileCTA />
          <CookieConsentBanner />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
