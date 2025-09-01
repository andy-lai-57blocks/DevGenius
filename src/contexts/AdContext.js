import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const AdContext = createContext();

// Get configuration from environment variables
// Create .env.local file with your AdSense settings:
// REACT_APP_GOOGLE_AD_CLIENT=ca-pub-your-publisher-id
// REACT_APP_GOOGLE_AD_BANNER_SLOT=your-banner-slot-id  
// REACT_APP_GOOGLE_AD_MREC_SLOT=your-mrec-slot-id
const AD_CLIENT = process.env.REACT_APP_GOOGLE_AD_CLIENT || 'ca-pub-8806399994474387';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Ad configuration
const AD_UNITS = {
  banner: {
    slot: process.env.REACT_APP_GOOGLE_AD_BANNER_SLOT || '8870579772',
    format: 'banner',
    style: { width: '100%', height: '90px' }
  },
  mrec: {
    slot: process.env.REACT_APP_GOOGLE_AD_MREC_SLOT || '1681486325',
    format: 'auto',
    responsive: true
  }
};

export const AdProvider = ({ children }) => {
  const [adsenseLoaded, setAdsenseLoaded] = useState(false);
  const [loadedAds, setLoadedAds] = useState(new Set());
  const [adErrors, setAdErrors] = useState(new Map());
  const location = useLocation();

  // Don't load ads in development
  useEffect(() => {
    if (IS_DEVELOPMENT) {
      console.log('🚫 AdSense disabled in development environment');
      return;
    }

    if (window.adsbygoogle) {
      setAdsenseLoaded(true);
      return;
    }

    // AdSense script should already be loaded from index.html
    const checkAdsense = () => {
      if (window.adsbygoogle) {
        setAdsenseLoaded(true);
      } else {
        setTimeout(checkAdsense, 100);
      }
    };
    
    checkAdsense();
  }, []);

  // Refresh ads when route changes
  useEffect(() => {
    if (IS_DEVELOPMENT || !adsenseLoaded) return;

    console.log('🔄 Route changed, refreshing ads:', location.pathname);
    
    // Clear loaded ads state to allow re-initialization
    setLoadedAds(new Set());
    setAdErrors(new Map());

    // Small delay to ensure DOM is updated
    setTimeout(() => {
      // Trigger re-initialization of visible ads
      const adElements = document.querySelectorAll('.adsbygoogle');
      adElements.forEach(element => {
        // Reset AdSense status to allow re-initialization
        element.removeAttribute('data-adsbygoogle-status');
        element.removeAttribute('data-ad-status');
        element.removeAttribute('data-processing');
      });
    }, 100);
  }, [location.pathname, adsenseLoaded]);

  // Initialize a specific ad
  const initializeAd = useCallback(async (adId, element) => {
    if (IS_DEVELOPMENT) {
      console.log('🚫 Ad initialization skipped in development:', adId);
      return false;
    }
    
    if (!adsenseLoaded || !element) return false;

    try {
      // Check if already processed
      if (element.getAttribute('data-adsbygoogle-status') === 'done') {
        setLoadedAds(prev => new Set([...prev, adId]));
        return true;
      }

      // Initialize the ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      // Wait and check if loaded
      const checkLoaded = () => {
        return new Promise((resolve) => {
          const check = () => {
            const hasContent = element.children.length > 0 || 
                             element.innerHTML.trim() !== '' ||
                             element.getAttribute('data-adsbygoogle-status') === 'done';
            
            if (hasContent) {
              setLoadedAds(prev => new Set([...prev, adId]));
              resolve(true);
            } else {
              // Check again after delay
              setTimeout(() => {
                const hasDelayedContent = element.children.length > 0 || 
                                        element.innerHTML.trim() !== '' ||
                                        element.getAttribute('data-adsbygoogle-status') === 'done';
                
                if (hasDelayedContent) {
                  setLoadedAds(prev => new Set([...prev, adId]));
                }
                resolve(hasDelayedContent);
              }, 2000);
            }
          };
          
          setTimeout(check, 1000);
        });
      };

      return await checkLoaded();
    } catch (error) {
      console.error(`AdSense error for ${adId}:`, error);
      setAdErrors(prev => new Map([...prev, [adId, error.message]]));
      return false;
    }
  }, [adsenseLoaded]);

  const value = {
    adsenseLoaded,
    loadedAds,
    adErrors,
    initializeAd,
    AD_UNITS,
    AD_CLIENT,
    IS_DEVELOPMENT
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};
