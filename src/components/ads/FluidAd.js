import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const FluidAd = ({ 
  className = '',
  style = {},
  adSlot = '4012628436',
  adClient = 'ca-pub-8806399994474387'
}) => {
  const adRef = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  // Configuration for fluid ad
  const config = {
    slot: adSlot,
    client: adClient,
    format: 'fluid',
    layoutKey: '-6t+ed+2i-1n-4w'
  };

  // Check if we're on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

  // Unique key per route for DOM freshness
  const adKey = `fluid-${config.slot}-${location.pathname.replace(/\//g, '-')}`;

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
              console.log(`🔄 SPA: Initializing fluid ad for ${location.pathname}`);
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              
              if (mountedRef.current) {
                setIsLoading(false);
              }
            } catch (error) {
              // Handle "already have ads" error gracefully
              if (error.message?.includes('already have ads')) {
                console.log('⚠️ SPA: Fluid ad slot already filled, this is expected behavior');
              } else {
                console.warn('⚠️ SPA: Fluid ad initialization warning:', error.message);
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
        className={`ad-container fluid-ad ${className} ad-placeholder-dev`}
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
          minHeight: '120px',
          margin: '20px 0'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div>🚫 AdSense (Fluid Ad)</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
            DEV MODE - {location.pathname}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`ad-container fluid-ad ${className}`} 
      style={{ position: 'relative', ...style }} 
      ref={adRef}
    >
      <ins 
        key={adKey} // Forces fresh DOM element per route
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format={config.format}
        data-ad-layout-key={config.layoutKey}
        data-ad-client={config.client}
        data-ad-slot={config.slot}
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

export default FluidAd;
