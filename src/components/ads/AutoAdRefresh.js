import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AutoAdRefresh = () => {
  const location = useLocation();

  useEffect(() => {
    // Skip on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return;
    }

    const refreshGoogleAutoAds = () => {
      try {
        // Wait for DOM to be fully updated after route change
        setTimeout(() => {
          console.log('🔄 Refreshing Google Auto ads on route change:', location.pathname);
          
          if (typeof window.adsbygoogle !== 'undefined') {
            // Method 1: Signal Google Auto ads to refresh
            (window.adsbygoogle = window.adsbygoogle || []).push({
              google_ad_modifications: {
                eids: 'refresh'
              }
            });

            // Method 2: Reinitialize auto ads system
            (window.adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: 'ca-pub-8806399994474387',
              enable_page_level_ads: true
            });

            // Method 3: Force refresh of any unprocessed ad slots
            const unprocessedAds = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
            if (unprocessedAds.length > 0) {
              console.log('📱 Found', unprocessedAds.length, 'unprocessed ads, initializing...');
              unprocessedAds.forEach(() => {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              });
            }

            console.log('✅ Google Auto ads refresh completed');
          } else {
            console.warn('⚠️ Google AdSense not loaded yet');
            // Try fallback method
            if (typeof window.refreshGoogleAutoAds === 'function') {
              window.refreshGoogleAutoAds();
            }
          }
        }, 1000); // Longer delay for mobile devices
      } catch (error) {
        console.error('❌ Google Auto ads refresh error:', error);
      }
    };

    // Only refresh on route changes (not on initial load)
    if (location.pathname !== '/') {
      refreshGoogleAutoAds();
    }
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};

export default AutoAdRefresh;
