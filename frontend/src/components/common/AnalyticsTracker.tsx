import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Dispatch custom page_view telemetry event
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
        timestamp: new Date().toISOString(),
      });
      
      // Development telemetry logger
      if (import.meta.env.DEV) {
        console.debug('[Bookify Telemetry] Page View:', location.pathname);
      }
    }
  }, [location]);

  return null;
};
