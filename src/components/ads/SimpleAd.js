import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SimpleAd = ({ 
  className = '',
  style = {},
  adSlot = '1681486325',
  adClient = 'ca-pub-8806399994474387'
}) => {
  const adRef = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  // Configuration
  const config = {
    slot: adSlot,
    client: adClient,
    style: { maxWidth: '300px', minHeight: '250px' }
  };

  // Check if we're on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

  // Unique key per route for DOM freshness
  const adKey = `spa-${config.slot}-${location.pathname.replace(/\//g, '-')}`;

  // SPA-optimized ad initialization (uses static script from index.html)
  useEffect(() => {
    if (!mountedRef.current || isLocalhost) {
      setIsLoading(false);
      return;
    }

    const initializeAd = () => {
      // Wait for AdSense script to be ready
      const checkAdSenseReady = () => {
        if (window.adsbygoogle && adRef.current) {
          const insElement = adRef.current.querySelector('ins.adsbygoogle');
          
          if (insElement && !insElement.hasAttribute('data-adsbygoogle-status')) {
            try {
              console.log(`🔄 SPA: Initializing ad for ${location.pathname}`);
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              
              if (mountedRef.current) {
                setIsLoading(false);
              }
            } catch (error) {
              // Handle "already have ads" error gracefully
              if (error.message?.includes('already have ads')) {
                console.log('⚠️ SPA: Ad slot already filled, this is expected behavior');
              } else {
                console.warn('⚠️ SPA: Ad initialization warning:', error.message);
              }
              
              if (mountedRef.current) {
                setIsLoading(false);
              }
            }
          } else {
            if (mountedRef.current) {
              setIsLoading(false);
            }
          }
        } else {
          // AdSense not ready yet, wait a bit more
          setTimeout(checkAdSenseReady, 100);
        }
      };

      // Small delay for DOM settlement
      setTimeout(checkAdSenseReady, 50);
    };

    setIsLoading(true);
    initializeAd();

    // Cleanup
    return () => {
      mountedRef.current = false;
    };
  }, [location.pathname, isLocalhost]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Development mode placeholder
  if (isLocalhost) {
    return (
      <div 
        className={`ad-container mrec-ad ${className} ad-placeholder-dev`}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          color: '#6c757d',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          ...config.style
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div>🚫 AdSense (SPA Mode)</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
            DEV - {location.pathname}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`ad-container mrec-ad ${className}`} 
      style={{ position: 'relative', ...style }} 
      ref={adRef}
    >
      <ins 
        key={adKey} // Forces fresh DOM element per route
        className="adsbygoogle"
        style={{ display: 'block', ...config.style }}
        data-ad-client={config.client}
        data-ad-slot={config.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      
      {/* Subtle loading indicator */}
      {isLoading && (
        <>
          <div 
            className="ad-loading-indicator"
            style={{ 
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '12px',
              height: '12px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #007bff',
              borderRadius: '50%',
              animation: 'ad-spin 1s linear infinite',
              opacity: 0.6
            }}
          />
          <style>{`
            @keyframes ad-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default SimpleAd;
